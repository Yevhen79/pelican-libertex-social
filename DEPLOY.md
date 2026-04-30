# Промпт для Claude Code на Windows VPS

Скопируй этот текст целиком и вставь в Claude Code, который запущен на твоей Windows VPS-ке
(в директории, куда распакован архив `pelican-vps-win.zip`).

---

## Промпт

> Привет. Я распаковал в текущей директории комплект файлов проекта Pelican Libertex Social
> (Node-прокси + headless-Chrome рефрешер OIDC-токена + ngrok-туннель + статический фронт).
> Нужно его развернуть на этой Windows VPS так, чтобы:
>
> 1. Прокси крутился локально на 127.0.0.1:8787
> 2. Авто-старт после перезагрузки сервера (Windows-службы)
> 3. Публикация наружу через **ngrok** на зарезервированный домен
>    `snaking-qualm-mandate.ngrok-free.dev` (токен и домен лежат в `.env`)
>
> В архиве есть `install.ps1` — он сам делает всё:
> - winget установка Node.js 20 LTS и Google Chrome
> - Скачивание NSSM (service-обёртка) и ngrok.exe v3
> - Копирование исходников в `C:\Pelican`
> - Регистрация **трёх Windows-служб** через NSSM:
>   - `PelicanServer`    → `node server.js`
>   - `PelicanRefresher` → `node refresher.js` (headless Chrome для refresh OIDC-токена)
>   - `PelicanNgrok`     → `ngrok http 8787 --domain=snaking-qualm-mandate.ngrok-free.dev`
> - Открытие порта 8787 в Windows Firewall (для локального доступа)
>
> `.env` уже содержит:
> - `LIBERTEX_EMAIL`, `LIBERTEX_PASSWORD` — креды от libertex.copy-trade.io
> - `NGROK_AUTHTOKEN`, `NGROK_DOMAIN` — токен ngrok и зарезервированный субдомен
> - `CHROME_EXE` — путь к Chrome (поправится автоматом если другой)
>
> `.catalog.json` (~18 МБ) — заранее собранный кеш каталога 10000+ стратегий, страница
> заработает сразу без 30-минутного билда.
>
> Сделай:
>
> 1. Прочитай `README-VPS-Windows.md` и `install.ps1`, чтобы понять, что они делают.
> 2. Открой PowerShell **от администратора** в текущей директории и выполни:
>    ```powershell
>    Set-ExecutionPolicy -Scope Process Bypass -Force
>    .\install.ps1
>    ```
> 3. Дождись `Done.` (1-3 минуты в зависимости от скорости winget).
> 4. Проверь, что:
>    - `Get-Service PelicanServer, PelicanRefresher, PelicanNgrok` — все три **Running**
>    - `Invoke-WebRequest http://127.0.0.1:8787/__status -UseBasicParsing | % Content` отдаёт JSON
>      с `hasToken: true` (если `expired: true` — рефрешер ещё не залогинился, подожди 30 сек)
>    - В логе ngrok видна строка про `started tunnel` на нужный домен:
>      ```powershell
>      Get-Content C:\Pelican\logs\ngrok.log -Tail 30
>      ```
>    - `Invoke-WebRequest https://snaking-qualm-mandate.ngrok-free.dev/__status -UseBasicParsing`
>      возвращает 200 (внешняя проверка)
>
> 5. Если на ноуте владельца уже работает ngrok с этим же доменом — он **отвалится автоматически**
>    при старте VPS-ngrok'а (один зарезервированный домен = одна активная сессия). Это ОК и
>    ожидаемо: владелец потом стопнет ngrok локально.
>
> Если что-то сломалось:
> - Логи прокси:    `Get-Content C:\Pelican\logs\server.log -Tail 50`
> - Логи рефрешера: `Get-Content C:\Pelican\logs\refresher.log -Tail 50`
> - Логи ngrok:     `Get-Content C:\Pelican\logs\ngrok.log -Tail 50`
> - Перезапуск:     `Restart-Service PelicanServer, PelicanRefresher, PelicanNgrok`
>
> После успешного запуска расскажи мне:
> - URL: `https://snaking-qualm-mandate.ngrok-free.dev`
> - Сколько стратегий загружено (X-Catalog-Size в ответе `/api/strategies-full`)
> - Сколько секунд до истечения текущего токена (`seconds_left` из `/__status`)

---

## Что в архиве

| Файл | Назначение |
|---|---|
| `install.ps1` | Главный установщик — одна команда поднимает всё |
| `start.ps1` | Альтернативный ручной лончер (если не хочешь сервисы) |
| `server.js` | Прокси `:8787` + кеш каталога + ежедневный ребилд 11:00 Europe/Kyiv |
| `refresher.js` | Headless Chrome — поддерживает OIDC-сессию libertex |
| `patch-catalog.js` | Опциональный патч для добавления пропавших стратегий |
| `index.html`, `app.js`, `styles.css`, `logo.svg`, `favicon.png` | Фронт |
| `package.json`, `package-lock.json` | npm-зависимости (puppeteer-core) |
| `.env` | Креды + ngrok-токен + зарезервированный домен |
| `.catalog.json` | Готовый кеш 10000+ стратегий (~18 МБ) |
| `README-VPS-Windows.md` | Подробная документация |
| `DEPLOY.md` | Этот файл |

## Требования к VPS

- **Windows Server 2019/2022** или Win 10/11
- ≥ 2 ГБ ОЗУ (Chrome жрёт)
- Права **Administrator**
- Исходящий доступ в интернет (для ngrok-туннеля; входящих портов открывать не нужно — туннель сам прокидывает)
- Доменa **не нужно** — ngrok даёт публичный HTTPS-URL `snaking-qualm-mandate.ngrok-free.dev`

## Что после установки

- **Локально на VPS:** `http://127.0.0.1:8787` (для отладки)
- **Публично для друзей:** `https://snaking-qualm-mandate.ngrok-free.dev` (через ngrok)
- **Авто-старт после ребута:** все 3 службы в `Automatic`
- **Авто-обновление токена:** каждые 45 мин или при < 10 мин до истечения
- **Перелогин при истечении IdP-куки:** рефрешер использует `LIBERTEX_EMAIL`/`PASSWORD`
- **Ежедневный ребилд каталога** в 11:00 Europe/Kyiv

## Полезные команды

```powershell
# Состояние всех 3 служб
Get-Service PelicanServer, PelicanRefresher, PelicanNgrok

# Перезапуск
Restart-Service PelicanServer, PelicanRefresher, PelicanNgrok

# Логи живьём
Get-Content C:\Pelican\logs\server.log -Wait
Get-Content C:\Pelican\logs\refresher.log -Wait
Get-Content C:\Pelican\logs\ngrok.log -Wait

# Поправить .env (новый ngrok-токен / новый домен / т.п.)
notepad C:\Pelican\.env
Restart-Service PelicanServer, PelicanRefresher, PelicanNgrok

# Принудительный ребилд каталога
Remove-Item C:\Pelican\.catalog.json
Restart-Service PelicanServer    # сборка ~30-60 мин в фоне

# Полное удаление (откат)
Stop-Service PelicanServer, PelicanRefresher, PelicanNgrok
& "C:\Pelican\bin\nssm.exe" remove PelicanServer confirm
& "C:\Pelican\bin\nssm.exe" remove PelicanRefresher confirm
& "C:\Pelican\bin\nssm.exe" remove PelicanNgrok confirm
Remove-Item C:\Pelican -Recurse -Force
Remove-NetFirewallRule -DisplayName 'Pelican-Local'
```
