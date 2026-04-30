#requires -Version 5.1
# Pelican Libertex Social — autostart launcher.
# Starts proxy, refresher and ngrok tunnel as detached, hidden Windows processes
# that survive the calling shell exiting.

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

# Ensure logs dir
$logs = Join-Path $root 'logs'
if (-not (Test-Path $logs)) { New-Item -ItemType Directory -Path $logs -Force | Out-Null }

function Read-DotEnv($file) {
    $envMap = @{}
    if (-not (Test-Path $file)) { return $envMap }
    foreach ($line in Get-Content -Path $file -Encoding UTF8) {
        if ($line -match '^\s*([A-Z_][A-Z0-9_]*)=(.*)$') {
            $envMap[$Matches[1]] = $Matches[2]
        }
    }
    return $envMap
}

$envMap = Read-DotEnv (Join-Path $root '.env')
$ngrokDomain = $envMap['NGROK_DOMAIN']

# Resolve ngrok.exe location: prefer local one shipped with the project
$ngrokLocal = Join-Path $root 'ngrok.exe'
$ngrokCmd = $null
if (Test-Path $ngrokLocal) { $ngrokCmd = $ngrokLocal }
else {
    $maybe = Get-Command ngrok -ErrorAction SilentlyContinue
    if ($maybe) { $ngrokCmd = $maybe.Source }
}

# Resolve node.exe
$nodeFound = Get-Command node -ErrorAction SilentlyContinue
if ($nodeFound) { $nodeCmd = $nodeFound.Source } else { $nodeCmd = 'C:\Program Files\nodejs\node.exe' }

# Skip start if a process already listens on PORT (avoid duplicates after wake)
$port = if ($envMap['PORT']) { [int]$envMap['PORT'] } else { 8787 }
$portBusy = $false
try {
    $portBusy = (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) -ne $null
} catch {}

if (-not $portBusy) {
    Write-Host "[start] launching server.js on port $port"
    Start-Process -FilePath $nodeCmd -ArgumentList 'server.js' `
        -WorkingDirectory $root -WindowStyle Hidden `
        -RedirectStandardOutput (Join-Path $logs 'server.out.log') `
        -RedirectStandardError  (Join-Path $logs 'server.err.log')
} else {
    Write-Host "[start] server already on :$port, skipping"
}

# Refresher: don't double-launch (check by command line via WMI)
$refresherRunning = $false
try {
    $refresherRunning = (Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
        Where-Object { $_.CommandLine -match 'refresher\.js' }) -ne $null
} catch {}

if (-not $refresherRunning) {
    Write-Host "[start] launching refresher.js"
    Start-Process -FilePath $nodeCmd -ArgumentList 'refresher.js' `
        -WorkingDirectory $root -WindowStyle Hidden `
        -RedirectStandardOutput (Join-Path $logs 'refresher.out.log') `
        -RedirectStandardError  (Join-Path $logs 'refresher.err.log')
} else {
    Write-Host "[start] refresher already running, skipping"
}

# ngrok: don't double-launch
$ngrokRunning = $false
try {
    $ngrokRunning = (Get-Process ngrok -ErrorAction SilentlyContinue) -ne $null
} catch {}

if (-not $ngrokRunning -and $ngrokCmd) {
    $args = @('http', "$port", '--log=stdout')
    if ($ngrokDomain) { $args += "--domain=$ngrokDomain" }
    Write-Host "[start] launching ngrok ($ngrokCmd) -> $ngrokDomain"
    Start-Process -FilePath $ngrokCmd -ArgumentList $args `
        -WorkingDirectory $root -WindowStyle Hidden `
        -RedirectStandardOutput (Join-Path $logs 'ngrok.out.log') `
        -RedirectStandardError  (Join-Path $logs 'ngrok.err.log')
} elseif ($ngrokRunning) {
    Write-Host "[start] ngrok already running, skipping"
} else {
    Write-Host "[start] WARN: ngrok.exe not found (no public tunnel will be exposed)"
}

Write-Host "[start] done. URLs:"
Write-Host "  local:  http://localhost:$port"
if ($ngrokDomain) { Write-Host "  public: https://$ngrokDomain" }
