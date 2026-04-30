# Pelican Libertex Social — Windows VPS deployment (ngrok)

Развёртывание на собственной Windows VPS-ке с публикацией через ngrok-туннель
на зарезервированный субдомен `*.ngrok-free.dev`. Без необходимости иметь свой домен.

## Что должно быть на сервере перед установкой

- **Windows Server 2019/2022** или **Windows 10/11**
- Минимум **2 ГБ ОЗУ** + 5 ГБ свободного диска (Chrome + Node)
- Права **Administrator**
- Исходящий доступ в интернет (для ngrok-туннеля)
- **Домен не нужен** — ngrok сам даёт публичный HTTPS

## Быстрый старт

1. Залить `pelican-vps-win.zip` на VPS (RDP-копи-паст, scp, WinSCP — что удобнее).
2. Распаковать в любую директорию.
3. Открыть **PowerShell как администратор** в этой директории.
4. Запустить:
   ```powershell
   Set-ExecutionPolicy -Scope Process Bypass -Force
   .\install.ps1
   ```
5. Через ~30 секунд проверить:
   ```powershell
   Get-Service PelicanServer, PelicanRefresher, PelicanNgrok
   Invoke-WebRequest https://snaking-qualm-mandate.ngrok-free.dev -UseBasicParsing |
       Select-Object StatusCode
   ```

`install.ps1` идемпотентен — можно перезапускать сколько угодно раз.

## Что делает install.ps1

| Шаг | Действие |
|---|---|
| 1 | Проверяет/ставит Node.js 20 LTS через `winget` (`OpenJS.NodeJS.LTS`) |
| 2 | Проверяет/ставит Google Chrome через `winget` (`Google.Chrome`) |
| 3 | Скачивает `nssm.exe` (Non-Sucking Service Manager) в `C:\Pelican\bin\` |
| 4 | Скачивает свежий `ngrok.exe` v3 |
| 5 | Копирует исходники в `C:\Pelican\`, правит `.env` (CHROME_EXE) |
| 6 | `npm install --omit=dev` |
| 7 | Регистрирует **3 Windows-службы** через NSSM с auto-restart, ротацией логов 5 МБ |
| 8 | Открывает Windows Firewall на порт 8787 (только для локального доступа) |
| 9 | Печатает финальный URL и команды для логов |

## Архитектура

```
                                              ┌────────────────────────────┐
                                              │ ngrok edge (Cloudflare)    │
   Друг (браузер) ──── 443 ──── ngrok ────────►│                            │
   https://snaking-qualm-mandate.ngrok-free.dev│ туннель к твоей VPS        │
                                              └────────────┬───────────────┘
                                                           │
                                                  ┌────────▼─────────┐
                                                  │ ngrok.exe (Win svc) │
                                                  │  PelicanNgrok    │
                                                  └────────┬─────────┘
                                                           │ к 127.0.0.1:8787
                                                  ┌────────▼─────────┐
                                                  │ node server.js   │
                                                  │  PelicanServer   │
                                                  └────────┬─────────┘
                                                           │ Bearer token
                                                           ▼
                                                 papi.copy-trade.io

   ┌───────────────────────┐
   │ node refresher.js     │ ───► headless Chrome ─── libertex.copy-trade.io
   │  PelicanRefresher     │       (puppeteer-core)
   └───────────────────────┘                  токен в .env каждые 45 мин
```

## Файлы на сервере после установки

```
C:\Pelican\
├── server.js, refresher.js, patch-catalog.js
├── index.html, app.js, styles.css, logo.svg, favicon.png
├── package.json, package-lock.json
├── node_modules\        (после npm install)
├── .env                 (creds + access_token + ngrok)
├── .catalog.json        (~18 МБ кеш)
├── .chrome-profile\     (создаётся refresher'ом, IdP-куки)
├── bin\
│   ├── nssm.exe         (service-обёртка)
│   └── ngrok.exe        (туннель)
└── logs\
    ├── server.log, server.err.log
    ├── refresher.log, refresher.err.log
    └── ngrok.log, ngrok.err.log
```

## Управление

```powershell
# Состояние
Get-Service PelicanServer, PelicanRefresher, PelicanNgrok

# Перезапуск
Restart-Service PelicanServer, PelicanRefresher, PelicanNgrok

# Стоп
Stop-Service PelicanServer, PelicanRefresher, PelicanNgrok

# Логи (live tail)
Get-Content C:\Pelican\logs\server.log -Wait
Get-Content C:\Pelican\logs\refresher.log -Wait
Get-Content C:\Pelican\logs\ngrok.log -Wait
```

## Изменение .env

```powershell
notepad C:\Pelican\.env
Restart-Service PelicanServer, PelicanRefresher, PelicanNgrok
```

В .env могут быть:
- `LIBERTEX_EMAIL`, `LIBERTEX_PASSWORD` — креды
- `NGROK_AUTHTOKEN`, `NGROK_DOMAIN` — токен и зарезервированный субдомен
- `CHROME_EXE` — путь к Chrome
- `PORT` — внутренний порт прокси (default 8787)
- `RATE_LIMIT` — req/min на IP (default 120)

## Смена ngrok-домена

Если хочешь другой ngrok-домен:
1. Зарезервируй новый в `https://dashboard.ngrok.com/domains`
2. В `C:\Pelican\.env` подмени `NGROK_DOMAIN=`
3. `Restart-Service PelicanNgrok`

## Принудительный ребилд каталога

Каталог сам пересобирается ежедневно в **11:00 Europe/Kyiv**. Если хочется сейчас:

```powershell
Remove-Item C:\Pelican\.catalog.json
Restart-Service PelicanServer
# ~30-60 мин в фоне (видно в C:\Pelican\logs\server.log)
```

Или быстрее через патч-скрипт (только пропущенные):

```powershell
cd C:\Pelican
node patch-catalog.js
Restart-Service PelicanServer
```

## Безопасность

- **`.env` в `C:\Pelican\`** — содержит креды + ngrok-токен. Доступен Administrator + SYSTEM.
- **Прокси отдаёт только whitelist эндпоинтов**: `/api/discover/*`, `/api/strategies/*`, GET-only.
- **`/__ingest`** (приём токена) принимает только с `127.0.0.1` без `X-Forwarded-For`, через ngrok недоступен.
- **Rate-limit** 120 req/min/IP (`RATE_LIMIT=` в `.env`).

## Если сломается

| Симптом | Что делать |
|---|---|
| `https://...ngrok-free.dev` → "site can't be reached" | `Get-Service PelicanNgrok`. Логи: `Get-Content C:\Pelican\logs\ngrok.log -Tail 100`. Чаще всего — конфликт с другим ngrok на этом же домене (стопни тот). |
| 502 Bad Gateway от ngrok | `Get-Service PelicanServer` — упал ли node. Логи `server.err.log`. |
| Страница грузится, но `/api/*` 401 | Рефрешер не обновил токен. `Restart-Service PelicanRefresher`. Проверь `.env` и `refresher.log`. |
| `puppeteer-core: Failed to launch browser` | Chrome не установлен либо `CHROME_EXE` неверный путь в `.env`. |
| ngrok падает с `ERR_NGROK_108` | Этот домен уже занят другой сессией ngrok (например, на твоём ноуте). Стопни ngrok там. |
| ngrok падает с `ERR_NGROK_121` | Старая версия. Скрипт качает свежую — перезапусти `install.ps1`. |

## Полное удаление (откат)

```powershell
Stop-Service PelicanServer, PelicanRefresher, PelicanNgrok -ErrorAction SilentlyContinue
& "C:\Pelican\bin\nssm.exe" remove PelicanServer confirm
& "C:\Pelican\bin\nssm.exe" remove PelicanRefresher confirm
& "C:\Pelican\bin\nssm.exe" remove PelicanNgrok confirm
Remove-Item C:\Pelican -Recurse -Force
Remove-NetFirewallRule -DisplayName 'Pelican-Local' -ErrorAction SilentlyContinue
```

## Бэкап

Сохраняй `C:\Pelican\.env` и `C:\Pelican\.catalog.json` — всё остальное переустанавливается из исходников за 2 минуты.
