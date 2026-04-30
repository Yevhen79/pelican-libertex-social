// Long-running headless Chrome that keeps a libertex.copy-trade.io tab open.
// Logs in once on startup (creds via env), then refreshes the access token
// from sessionStorage on a schedule and writes it to .env via fs.

'use strict';

const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer-core');

// load .env into process.env (no dependency on dotenv)
(function loadEnv() {
  const p = path.join(__dirname, '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
})();

const PROFILE_DIR = path.join(__dirname, '.chrome-profile');
const CHROME_EXE = process.env.CHROME_EXE || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT_URL = process.env.LIBERTEX_URL || 'https://libertex.copy-trade.io/';
const STORAGE_KEY = 'oidc.user:https://identity.copy-trade.io/:libertexweb';
const ENV_PATH = path.join(__dirname, '.env');

const REFRESH_INTERVAL_MS = parseInt(process.env.REFRESH_MS || (45 * 60 * 1000), 10); // 45 min
const REFRESH_BEFORE_EXPIRY_S = 600; // refresh if < 10 min left

let browser = null;
let page = null;

function readEnv() {
  const env = {};
  if (!fs.existsSync(ENV_PATH)) return env;
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}
function writeEnv(env) {
  const txt = Object.entries(env).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
  fs.writeFileSync(ENV_PATH, txt);
}

async function launch() {
  if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });
  browser = await puppeteer.launch({
    executablePath: CHROME_EXE,
    userDataDir: PROFILE_DIR,
    headless: 'new',
    args: [
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-dev-shm-usage',
      '--no-sandbox',
    ],
  });
  page = (await browser.pages())[0] || await browser.newPage();
  console.log('[refresher] headless chrome launched');
  process.on('exit', () => { try { browser?.close(); } catch {} });
  process.on('SIGINT', () => { try { browser?.close(); } catch {}; process.exit(0); });
  process.on('SIGTERM', () => { try { browser?.close(); } catch {}; process.exit(0); });
}

async function loginIfNeeded() {
  const email = process.env.LIBERTEX_EMAIL;
  const password = process.env.LIBERTEX_PASSWORD;
  await page.goto(ROOT_URL, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    const u = page.url();
    if (u.includes('/Account/Login')) break;
    const have = await page.evaluate(k => !!sessionStorage.getItem(k), STORAGE_KEY).catch(() => false);
    if (have) return;
  }
  if (!page.url().includes('/Account/Login')) return;

  if (!email || !password) {
    throw new Error('login required but LIBERTEX_EMAIL/LIBERTEX_PASSWORD not set');
  }
  await page.waitForSelector('input#Email', { timeout: 10000 });
  await page.click('input#Email', { clickCount: 3 });
  await page.type('input#Email', email, { delay: 15 });
  await page.click('input#Password', { clickCount: 3 });
  await page.type('input#Password', password, { delay: 15 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(()=>{}),
    page.click('button[name="button"]'),
  ]);
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    const have = await page.evaluate(k => !!sessionStorage.getItem(k), STORAGE_KEY).catch(() => false);
    if (have) { console.log('[refresher] login OK'); return; }
  }
  throw new Error('login submitted but token not found');
}

async function readToken() {
  return page.evaluate(k => {
    const v = sessionStorage.getItem(k);
    if (!v) return null;
    try { const u = JSON.parse(v); return { access_token: u.access_token, expires_at: u.expires_at }; } catch { return null; }
  }, STORAGE_KEY);
}

async function refresh() {
  // Reload to trigger SPA silent renew (uses IdP cookies still alive in this browser process)
  try {
    await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
  } catch {
    // sometimes networkidle2 hangs; fall through
  }
  // Wait for sessionStorage
  let tok = null;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 500));
    tok = await readToken().catch(() => null);
    if (tok && tok.access_token) break;
    const url = page.url();
    if (url.includes('/Account/Login')) {
      // session lost — try to re-login
      console.warn('[refresher] redirected to login during refresh, re-logging in');
      await loginIfNeeded();
      return refresh();
    }
  }
  if (!tok) throw new Error('no token after reload');
  const env = readEnv();
  env.ACCESS_TOKEN = tok.access_token;
  env.EXPIRES_AT = String(tok.expires_at || '');
  env.SAVED_AT = String(Math.floor(Date.now() / 1000));
  writeEnv(env);
  const left = (tok.expires_at || 0) - Math.floor(Date.now() / 1000);
  console.log(`[refresher] token refreshed, ${left}s left`);
  return tok;
}

async function tickIfNeeded() {
  const env = readEnv();
  const now = Math.floor(Date.now() / 1000);
  const exp = parseInt(env.EXPIRES_AT || '0', 10);
  const left = exp - now;
  if (left > REFRESH_BEFORE_EXPIRY_S) return;
  try { await refresh(); }
  catch (e) { console.error('[refresher] refresh failed:', e.message); }
}

async function start() {
  await launch();
  try {
    await loginIfNeeded();
    await refresh();
  } catch (e) {
    console.error('[refresher] startup failed:', e.message);
  }
  setInterval(tickIfNeeded, 60_000);  // every minute, refresh if close to expiry
  setInterval(() => refresh().catch(e => console.error('[refresher] periodic fail:', e.message)), REFRESH_INTERVAL_MS);
}

if (require.main === module) {
  start();
}

module.exports = { start, refresh };
