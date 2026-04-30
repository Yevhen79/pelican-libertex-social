# Pelican Libertex Social - Windows VPS installer (ngrok-based, no domain).
# Run from elevated PowerShell:
#     Set-ExecutionPolicy -Scope Process Bypass -Force
#     .\install.ps1
#
# Idempotent: safe to re-run. Reads creds + token + ngrok settings from .env.
# Copies sources to C:\Pelican; registers three Windows services via NSSM:
#   PelicanServer    -> node server.js
#   PelicanRefresher -> node refresher.js  (headless Chrome OIDC refresher)
#   PelicanNgrok     -> ngrok tunnel to the reserved domain in .env

param(
    [string]$InstallDir = 'C:\Pelican'
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Need-Admin {
    if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        throw "Run this script as Administrator."
    }
}
function Have-Cmd($name) { return [bool](Get-Command $name -ErrorAction SilentlyContinue) }
function Refresh-Path { $env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User') }

Need-Admin

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

# ---- Read .env from current dir to get NGROK_AUTHTOKEN, NGROK_DOMAIN ----
$envText = Get-Content "$here\.env" -Raw
$envMap = @{}
foreach ($line in ($envText -split "`r?`n")) {
    if ($line -match '^\s*([A-Z_][A-Z0-9_]*)=(.*)$') { $envMap[$Matches[1]] = $Matches[2] }
}
$ngrokToken  = $envMap['NGROK_AUTHTOKEN']
$ngrokDomain = $envMap['NGROK_DOMAIN']
if (-not $ngrokToken)  { throw "NGROK_AUTHTOKEN missing from .env. Add it before running." }
if (-not $ngrokDomain) { throw "NGROK_DOMAIN missing from .env. Add it before running." }

Write-Host "[1/9] Checking Node.js 20+..."
$nodeOk = $false
if (Have-Cmd node) {
    $v = (& node -v) -replace 'v',''
    $major = [int](($v -split '\.')[0])
    if ($major -ge 20) { Write-Host "      Node $v already installed."; $nodeOk = $true }
}
if (-not $nodeOk) {
    Write-Host "      Installing Node.js 20 LTS via winget..."
    winget install --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements | Out-Null
    Refresh-Path
    if (-not (Have-Cmd node)) { throw "Node still not on PATH. Reopen PowerShell as Admin and re-run." }
}

Write-Host "[2/9] Checking Google Chrome..."
$chromeExe = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
if (-not (Test-Path $chromeExe)) {
    Write-Host "      Installing Google Chrome via winget..."
    winget install --id Google.Chrome --silent --accept-package-agreements --accept-source-agreements | Out-Null
}
if (-not (Test-Path $chromeExe)) { throw "Chrome did not install at $chromeExe" }
Write-Host "      Chrome OK."

Write-Host "[3/9] Downloading NSSM (service wrapper)..."
$binDir = "$InstallDir\bin"
$nssmExe = "$binDir\nssm.exe"
New-Item -ItemType Directory -Path $binDir -Force | Out-Null
if (-not (Test-Path $nssmExe)) {
    $zip = "$env:TEMP\nssm.zip"
    Invoke-WebRequest -Uri 'https://nssm.cc/release/nssm-2.24.zip' -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath "$env:TEMP\nssm-extract" -Force
    $arch = if ([Environment]::Is64BitOperatingSystem) { 'win64' } else { 'win32' }
    Copy-Item "$env:TEMP\nssm-extract\nssm-2.24\$arch\nssm.exe" $nssmExe -Force
    Remove-Item $zip -Force; Remove-Item "$env:TEMP\nssm-extract" -Recurse -Force
}
Write-Host "      NSSM at $nssmExe"

Write-Host "[4/9] Downloading ngrok..."
$ngrokExe = "$binDir\ngrok.exe"
if (-not (Test-Path $ngrokExe)) {
    $zip = "$env:TEMP\ngrok.zip"
    Invoke-WebRequest -Uri 'https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip' -OutFile $zip
    Expand-Archive -Path $zip -DestinationPath "$env:TEMP\ngrok-extract" -Force
    Copy-Item "$env:TEMP\ngrok-extract\ngrok.exe" $ngrokExe -Force
    Remove-Item $zip -Force; Remove-Item "$env:TEMP\ngrok-extract" -Recurse -Force
}
Write-Host "      ngrok at $ngrokExe ($((& $ngrokExe --version)))"

Write-Host "[5/9] Copying sources to $InstallDir..."
New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
New-Item -ItemType Directory -Path "$InstallDir\logs" -Force | Out-Null
$files = @('server.js','refresher.js','patch-catalog.js','index.html','app.js','styles.css','logo.svg','favicon.png','package.json','package-lock.json','.env','.catalog.json','start.ps1')
foreach ($f in $files) {
    if (Test-Path "$here\$f") { Copy-Item "$here\$f" $InstallDir -Force }
}

# Patch .env: ensure CHROME_EXE is right for this machine
$envPath = "$InstallDir\.env"
$envT = Get-Content $envPath -Raw
if ($envT -match 'CHROME_EXE=') {
    $envT = $envT -replace 'CHROME_EXE=.*', "CHROME_EXE=$chromeExe"
} else {
    $envT = "CHROME_EXE=$chromeExe`r`n" + $envT
}
[System.IO.File]::WriteAllText($envPath, $envT, [System.Text.UTF8Encoding]::new($false))

Write-Host "[6/9] npm install..."
Push-Location $InstallDir
& npm install --omit=dev --no-audit --no-fund | Out-Null
Pop-Location

Write-Host "[7/9] Registering 3 Windows services via NSSM..."
$nodeExe = (Get-Command node).Source

function Install-NodeSvc($name, $script, $stdout, $stderr) {
    & cmd /c "`"$nssmExe`" stop $name >nul 2>&1"
    & cmd /c "`"$nssmExe`" remove $name confirm >nul 2>&1"
    & $nssmExe install $name $nodeExe $script | Out-Null
    & $nssmExe set $name AppDirectory $InstallDir | Out-Null
    & $nssmExe set $name AppStdout "$InstallDir\logs\$stdout" | Out-Null
    & $nssmExe set $name AppStderr "$InstallDir\logs\$stderr" | Out-Null
    & $nssmExe set $name AppRotateFiles 1 | Out-Null
    & $nssmExe set $name AppRotateBytes 5242880 | Out-Null
    & $nssmExe set $name Start SERVICE_AUTO_START | Out-Null
    & $nssmExe set $name AppExit Default Restart | Out-Null
    & $nssmExe set $name AppRestartDelay 5000 | Out-Null
    & $nssmExe start $name | Out-Null
}
Install-NodeSvc 'PelicanServer'    "$InstallDir\server.js"    'server.log'    'server.err.log'
Install-NodeSvc 'PelicanRefresher' "$InstallDir\refresher.js" 'refresher.log' 'refresher.err.log'

# ngrok service: token via env var, domain in args, log to AppStdout/AppStderr
& cmd /c "`"$nssmExe`" stop PelicanNgrok >nul 2>&1"
& cmd /c "`"$nssmExe`" remove PelicanNgrok confirm >nul 2>&1"
& $nssmExe install PelicanNgrok $ngrokExe 'http' '8787' "--domain=$ngrokDomain" '--log=stdout' | Out-Null
& $nssmExe set PelicanNgrok AppDirectory $InstallDir | Out-Null
& $nssmExe set PelicanNgrok AppStdout "$InstallDir\logs\ngrok.log" | Out-Null
& $nssmExe set PelicanNgrok AppStderr "$InstallDir\logs\ngrok.err.log" | Out-Null
& $nssmExe set PelicanNgrok AppRotateFiles 1 | Out-Null
& $nssmExe set PelicanNgrok AppRotateBytes 5242880 | Out-Null
& $nssmExe set PelicanNgrok Start SERVICE_AUTO_START | Out-Null
& $nssmExe set PelicanNgrok AppExit Default Restart | Out-Null
& $nssmExe set PelicanNgrok AppRestartDelay 10000 | Out-Null
& $nssmExe set PelicanNgrok AppEnvironmentExtra "NGROK_AUTHTOKEN=$ngrokToken" | Out-Null
& $nssmExe start PelicanNgrok | Out-Null
Write-Host "      services installed and started."

Write-Host "[8/9] Open Windows Firewall on port 8787 (local LAN access; ngrok already proxies WAN)..."
if (-not (Get-NetFirewallRule -DisplayName 'Pelican-Local' -ErrorAction SilentlyContinue)) {
    New-NetFirewallRule -DisplayName 'Pelican-Local' -Direction Inbound -Protocol TCP -LocalPort 8787 -Action Allow | Out-Null
}

Start-Sleep -Seconds 6
Write-Host ""
Write-Host "=== status ==="
Get-Service PelicanServer, PelicanRefresher, PelicanNgrok | Format-Table -AutoSize
Write-Host "Local check: http://127.0.0.1:8787/__status"
try { (Invoke-WebRequest -Uri 'http://127.0.0.1:8787/__status' -UseBasicParsing).Content } catch { Write-Host $_.Exception.Message }

Write-Host ""
Write-Host "[9/9] Public URL: https://$ngrokDomain"
Write-Host "      (NOTE: if your laptop is also running ngrok with this same domain,"
Write-Host "       stop it there - reserved domain can only have ONE active session.)"
Write-Host ""
Write-Host "Done."
Write-Host "Logs:  Get-Content $InstallDir\logs\server.log -Wait"
Write-Host "       Get-Content $InstallDir\logs\refresher.log -Wait"
Write-Host "       Get-Content $InstallDir\logs\ngrok.log -Wait"
