const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || '8787', 10);
const ROOT = __dirname;
const ENV_PATH = path.join(ROOT, '.env');
const UPSTREAM_HOST = 'papi.copy-trade.io';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

// ---- whitelist of allowed upstream API paths (read-only catalog only) ----
const ALLOWED = [
  /^\/api\/discover\/?$/,
  /^\/api\/discover\/[A-Za-z]+\/?$/,
  /^\/api\/strategies\/?$/,
  /^\/api\/strategies\/\d+\/?$/,
  /^\/api\/strategies\/\d+\/stats\/?$/,
  /^\/api\/strategies\/\d+\/signals\/open\/?$/,
  /^\/api\/strategies\/\d+\/signals\/closed\/?$/,
  /^\/api\/servers\/?$/,
  /^\/api\/brokers\/?$/,
];
function pathAllowed(p) { return ALLOWED.some(re => re.test(p)); }

// ---- catalog cache: aggregated full list of strategies via filter scan ----
const CATALOG_TTL_MS = 10 * 60 * 1000;
let catalogCache = { at: 0, items: null, building: null };

const SCAN_QUERIES = (() => {
  const out = [];
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for (const c of chars) out.push(c);
  const v = 'aeiouy', con = 'bcdfghjklmnprstvwz';
  for (const a of v) for (const b of con) out.push(a + b);
  for (const a of con) for (const b of v) out.push(a + b);
  for (const p of ['gold','forex','trade','sca','pro','vip','sig','bot','old','ing','er','fx','top','ai','%E2']) out.push(p);
  return Array.from(new Set(out));
})();

const upstreamAgent = new https.Agent({ keepAlive: true, maxSockets: 32, maxFreeSockets: 16 });

function upstreamGet(p, token, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const opts = {
      method: 'GET', hostname: UPSTREAM_HOST, path: p,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'User-Agent': 'pelican-proxy/0.3',
        'Connection': 'keep-alive',
      },
      agent: upstreamAgent,
      timeout: timeoutMs,
    };
    const r = https.request(opts, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(buf)); } catch (e) { reject(e); }
        } else if (res.statusCode === 404) {
          resolve(null);
        } else {
          const err = new Error(`upstream ${res.statusCode}`);
          err.status = res.statusCode;
          err.retryAfter = parseInt(res.headers['retry-after'] || '0', 10);
          reject(err);
        }
      });
    });
    r.on('timeout', () => { r.destroy(new Error('timeout')); });
    r.on('error', reject);
    r.end();
  });
}

// global pause until this timestamp (when we hit 429)
let pauseUntil = 0;
async function maybeWaitForPause() {
  const now = Date.now();
  if (pauseUntil > now) await new Promise(r => setTimeout(r, pauseUntil - now));
}

async function upstreamGetRetry(p, token, attempts = 4) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    await maybeWaitForPause();
    try { return await upstreamGet(p, token, 20000); }
    catch (e) {
      lastErr = e;
      if (e.status === 401) throw e;
      if (e.status === 429) {
        const wait = (e.retryAfter > 0 ? e.retryAfter * 1000 : 30000) + Math.random() * 1000;
        pauseUntil = Math.max(pauseUntil, Date.now() + wait);
        await new Promise(r => setTimeout(r, wait));
      } else {
        await new Promise(r => setTimeout(r, 300 + i * 500));
      }
    }
  }
  throw lastErr;
}

// Discover groups that act as alternate strategy-id sources beyond the substring scan.
// /api/discover/Strategies returns the full ranked list (~2500), CopiersBalance ~1100,
// GlobalSignals ~800. Together with the substring scan this surfaces ~3000+ active strategies.
const DISCOVER_CODES_CATALOG = [
  'Strategies', 'GlobalSignals', 'CopiersBalance',
  'CopiersProfitMonth', 'CopiersProfitYear',
  'NewSignalProviders', 'TopFreeSignals', 'TopPaidSignals',
  'PerformanceFeeMonth', 'PerformanceFeeYear',
  'AvgInstructionsPerMonth', 'WinRate',
  'ReturnLastWeek', 'ReturnLastMonth', 'ReturnLastQuarter',
  'HighRisk', 'MediumRisk', 'LowRisk',
  'MaxDrawdown', 'Spotlight',
];

async function buildCatalog(token) {
  const map = new Map();
  const concurrency = 5;

  // 1. Substring scan
  let i = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (i < SCAN_QUERIES.length) {
      const q = SCAN_QUERIES[i++];
      try {
        const arr = await upstreamGet('/api/strategies?filter=' + encodeURIComponent(q), token);
        if (Array.isArray(arr)) for (const it of arr) if (it && it.Id) map.set(it.Id, it);
      } catch (e) {}
    }
  }));
  console.log(`[catalog] after substring scan: ${map.size}`);

  // 2. Discover groups (sequential, low pressure)
  for (const code of DISCOVER_CODES_CATALOG) {
    try {
      const arr = await upstreamGet('/api/discover/' + code, token);
      if (Array.isArray(arr)) {
        for (const it of arr) {
          const s = it.Strategy;
          if (!s || !s.Id) continue;
          if (!map.has(s.Id)) {
            map.set(s.Id, {
              Id: s.Id, Name: s.Name,
              ImageUploaded: s.ImageUploaded, Profile: s.Profile,
            });
          }
        }
      }
    } catch (e) {}
  }
  console.log(`[catalog] after discover groups: ${map.size}`);

  return [...map.values()];
}

async function getCatalog(token) {
  const now = Date.now();
  if (catalogCache.items && (now - catalogCache.at) < CATALOG_TTL_MS) return catalogCache.items;
  if (catalogCache.building) return catalogCache.building;
  catalogCache.building = (async () => {
    const items = await buildCatalog(token);
    catalogCache = { at: Date.now(), items, building: null };
    console.log(`[catalog] built ${items.length} strategies`);
    return items;
  })();
  return catalogCache.building;
}

// ---- full catalog with stats+meta (full daily-refresh data for filters) ----
// Long TTL: the daily 11:00 Kyiv scheduler is the only thing that should trigger rebuilds.
// Avoids the 23h-TTL race that caused two concurrent buildFull's around restart time.
const FULL_TTL_MS = 26 * 60 * 60 * 1000;
const CATALOG_FILE = path.join(ROOT, '.catalog.json');
let fullCache = { at: 0, items: null, partial: null, building: null, progress: { loaded: 0, total: 0 } };

function saveCatalogToDisk(items) {
  try {
    fs.writeFileSync(CATALOG_FILE, JSON.stringify({ at: Date.now(), items }));
    console.log(`[catalog] persisted ${items.length} items to ${CATALOG_FILE}`);
  } catch (e) { console.error('[catalog] persist failed:', e.message); }
}

function loadCatalogFromDisk() {
  try {
    if (!fs.existsSync(CATALOG_FILE)) return null;
    const j = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
    if (!Array.isArray(j.items) || !j.at) return null;
    return j;
  } catch { return null; }
}

function compactStrategy(meta, stats, base) {
  const inc = stats?.Profitability?.Inception || {};
  const tr  = stats?.Trades?.Inception || {};
  // strip History to ~24 points to keep payload small
  const hist = inc.History || [];
  const stride = hist.length > 60 ? Math.ceil(hist.length / 60) : 1;
  const trimmed = hist.filter((_, i) => i % stride === 0 || i === hist.length - 1);
  // Fallback chain: today's fresh fetch → previous catalog value → null. So a transient
  // upstream blip during the daily rebuild keeps yesterday's data instead of nuking the row.
  return {
    Id: base.Id,
    Name: meta?.Name ?? base.Name ?? null,
    ImageUploaded: meta?.ImageUploaded ?? base.ImageUploaded ?? null,
    Profile: meta?.Profile || base.Profile || null,
    NumCopiers: meta?.NumCopiers ?? base.NumCopiers ?? null,
    Fee: meta?.Fee ?? base.Fee ?? null,
    RiskProfile: meta?.RiskProfile ?? base.RiskProfile ?? null,
    IsSimulated: meta?.IsSimulated ?? base.IsSimulated ?? false,
    IsEnabled: meta?.IsEnabled ?? base.IsEnabled ?? null,
    Inception: stats?.Inception ?? base.Inception ?? null,
    Currency: stats?.CurrencyCode ?? base.Currency ?? null,
    Return: inc.UnrealisedReturn != null ? inc.UnrealisedReturn * 100 : (inc.RealisedReturn != null ? inc.RealisedReturn * 100 : (base.Return ?? null)),
    MaxDD: inc.MaxDrawdown != null ? inc.MaxDrawdown * 100 : (base.MaxDD ?? null),
    RealisedPnl: inc.RealisedPnl ?? base.RealisedPnl ?? null,
    UnrealisedPnl: inc.UnrealisedPnl ?? base.UnrealisedPnl ?? null,
    History: trimmed.length ? trimmed : (Array.isArray(base.History) ? base.History : []),
    TradesTotal: tr.Total ?? base.TradesTotal ?? 0,
    Wins: tr.Wins ?? base.Wins ?? 0,
    Losses: tr.Losses ?? base.Losses ?? 0,
    Markets: Array.isArray(tr.Markets) ? tr.Markets.slice(0, 12).map(m => ({ n: m.MarketName, c: m.Count }))
             : (Array.isArray(base.Markets) ? base.Markets : []),
    AccountBalance: stats?.Status?.Balance ?? base.AccountBalance ?? null,
    CopiersAUM: stats?.CopiersBalance?.Balance ?? base.CopiersAUM ?? null,
    MonthlyProfit: stats?.CopiersProfit?.Month ?? base.MonthlyProfit ?? null,
    YearlyProfit: stats?.CopiersProfit?.Year ?? base.YearlyProfit ?? null,
    _stats: !!stats || !!base._stats,
    _meta:  !!meta  || !!base._meta,
  };
}

async function buildFull(token) {
  let base = await getCatalog(token);
  fullCache.progress = { loaded: 0, total: base.length };

  // Get meta-equivalent (NumCopiers, Fee, RiskProfile) from /api/discover groups for known top strategies
  const discoverMeta = await collectDiscoverMeta(token);

  // Seed base with the previous catalog so when today's fetch fails (transient 429/timeout/etc.)
  // compactStrategy can fall back to yesterday's values rather than wiping the row to nulls.
  const prev = loadCatalogFromDisk();
  const prevById = new Map();
  if (prev?.items) for (const it of prev.items) prevById.set(it.Id, it);

  // Two-tier priority for build order:
  //   1) by Return (lower _returnRank from /api/discover/{Global,Return*} = higher priority)
  //   2) by Copiers (NumCopiers desc) for ties / strategies without a return rank
  base = base.slice().sort((a, b) => {
    const ma = discoverMeta.get(a.Id), mb = discoverMeta.get(b.Id);
    const ra = ma?._returnRank ?? Infinity, rb = mb?._returnRank ?? Infinity;
    if (ra !== rb) return ra - rb;
    const ca = ma?.NumCopiers ?? -1, cb = mb?.NumCopiers ?? -1;
    return cb - ca;
  });

  // Replace each base entry with its previous-catalog version so the entire fallback chain
  // works (Return, Markets, etc.). If we have no prior data, keep the discover stub.
  const baseWithPrev = base.map(b => ({ ...(prevById.get(b.Id) || {}), ...b }));

  const out = new Array(baseWithPrev.length);
  const concurrency = 6;
  let cursor = 0;
  let statsErr = 0, statsNull = 0, fetched = 0;

  // pre-fill output with partial entries (uses prev fallback already) so the partial cache is immediately usable
  for (let i = 0; i < baseWithPrev.length; i++) {
    out[i] = compactStrategy(discoverMeta.get(baseWithPrev[i].Id) || null, null, baseWithPrev[i]);
  }
  fullCache.partial = out;

  let metaErr = 0;
  async function worker() {
    while (true) {
      const idx = cursor++;
      if (idx >= baseWithPrev.length) return;
      const b = baseWithPrev[idx];
      const [metaR, statsR] = await Promise.allSettled([
        upstreamGetRetry('/api/strategies/' + b.Id, token),
        upstreamGetRetry('/api/strategies/' + b.Id + '/stats', token),
      ]);
      let meta  = metaR.status  === 'fulfilled' ? metaR.value  : (metaErr++, null);
      let stats = statsR.status === 'fulfilled' ? statsR.value : (statsErr++, null);
      if (stats === null) statsNull++;
      // fall back to discover meta when /api/strategies/{id} returned 404 (private signal)
      if (!meta) meta = discoverMeta.get(b.Id) || null;
      out[idx] = compactStrategy(meta, stats, b);
      fullCache.progress.loaded++;
      fetched++;
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  console.log(`[full] fetched=${fetched} stats-null=${statsNull} stats-err=${statsErr} meta-err=${metaErr}`);

  // Final retry pass: anything that ended without meta AND without prior data → try once more
  // with longer cool-down. This catches the "first build for new strategy + transient blip" case.
  const stillEmpty = [];
  for (let i = 0; i < out.length; i++) {
    if (!out[i]._meta && !out[i]._stats) stillEmpty.push(i);
  }
  if (stillEmpty.length) {
    console.log(`[full] final retry pass on ${stillEmpty.length} unenriched`);
    let cur2 = 0, fixed = 0;
    async function retryWorker() {
      while (true) {
        const j = cur2++;
        if (j >= stillEmpty.length) return;
        const idx = stillEmpty[j];
        const b = baseWithPrev[idx];
        // small spacing per request to dodge bursty rate limits
        await new Promise(r => setTimeout(r, 50 + Math.random() * 150));
        const [metaR, statsR] = await Promise.allSettled([
          upstreamGetRetry('/api/strategies/' + b.Id, token, 6),
          upstreamGetRetry('/api/strategies/' + b.Id + '/stats', token, 6),
        ]);
        const meta  = metaR.status  === 'fulfilled' ? metaR.value  : null;
        const stats = statsR.status === 'fulfilled' ? statsR.value : null;
        if (meta || stats) {
          out[idx] = compactStrategy(meta || discoverMeta.get(b.Id) || null, stats, b);
          fixed++;
        }
      }
    }
    // half the concurrency for the retry pass to be gentle
    await Promise.all(Array.from({ length: Math.max(1, Math.floor(concurrency / 2)) }, retryWorker));
    console.log(`[full] final retry recovered ${fixed} of ${stillEmpty.length}`);
  }
  return out;
}

async function collectDiscoverMeta(token) {
  const map = new Map();
  // ranking signal: lower number = higher priority (used to schedule stat fetches first)
  const setRank = (id, rank) => {
    const cur = map.get(id) || {};
    if (cur._returnRank == null || rank < cur._returnRank) cur._returnRank = rank;
    map.set(id, cur);
  };
  try {
    const groups = await upstreamGet('/api/discover', token);
    if (Array.isArray(groups)) {
      const riskByGroup = { LowRisk: 'Low', MediumRisk: 'Medium', HighRisk: 'High' };
      for (const g of groups) {
        const groupRisk = riskByGroup[g.ItemType];
        for (const it of (g.Items || [])) {
          const s = it.Strategy;
          if (!s?.Id) continue;
          const cur = map.get(s.Id) || {};
          if (s.Name && !cur.Name) cur.Name = s.Name;
          if (s.NumCopiers != null) cur.NumCopiers = s.NumCopiers;
          if (s.Fee != null) cur.Fee = s.Fee;
          if (s.ImageUploaded) cur.ImageUploaded = s.ImageUploaded;
          if (s.Profile) cur.Profile = s.Profile;
          if (groupRisk && !cur.RiskProfile) cur.RiskProfile = groupRisk;
          map.set(s.Id, cur);
        }
      }
    }
  } catch {}
  // Pull ranked-by-return strategies separately for priority queue
  for (const code of ['GlobalSignals', 'ReturnLastQuarter', 'ReturnLastMonth', 'TopFreeSignals']) {
    try {
      const arr = await upstreamGet('/api/discover/' + code, token);
      if (Array.isArray(arr)) {
        for (const it of arr) {
          const s = it.Strategy;
          if (!s?.Id) continue;
          const cur = map.get(s.Id) || {};
          if (s.Name && !cur.Name) cur.Name = s.Name;
          if (s.NumCopiers != null) cur.NumCopiers = s.NumCopiers;
          if (s.Fee != null) cur.Fee = s.Fee;
          if (s.ImageUploaded) cur.ImageUploaded = s.ImageUploaded;
          if (s.Profile) cur.Profile = s.Profile;
          map.set(s.Id, cur);
          setRank(s.Id, it.Rank ?? 99999);
        }
      }
    } catch {}
  }
  return map;
}

function getFull(token) {
  const now = Date.now();
  // Fresh items: return immediately.
  if (fullCache.items && (now - fullCache.at) < FULL_TTL_MS) return Promise.resolve(fullCache.items);
  // Stale items + already rebuilding: serve stale (don't make user wait).
  if (fullCache.items && fullCache.building) return Promise.resolve(fullCache.items);
  // Stale items + idle: kick off background rebuild, return stale immediately.
  if (fullCache.items && !fullCache.building) {
    fullCache.building = (async () => {
      const t0 = Date.now();
      const items = await buildFull(token);
      fullCache = { at: Date.now(), items, partial: fullCache.items, building: null, progress: { loaded: items.length, total: items.length } };
      console.log(`[full] background-rebuilt ${items.length} enriched strategies in ${((Date.now()-t0)/1000).toFixed(1)}s`);
      saveCatalogToDisk(items);
      return items;
    })();
    return Promise.resolve(fullCache.items);
  }
  // No items at all: must wait.
  if (fullCache.building) return fullCache.building;
  fullCache.building = (async () => {
    const t0 = Date.now();
    const items = await buildFull(token);
    fullCache = { at: Date.now(), items, partial: items, building: null, progress: { loaded: items.length, total: items.length } };
    console.log(`[full] built ${items.length} enriched strategies in ${((Date.now()-t0)/1000).toFixed(1)}s`);
    saveCatalogToDisk(items);
    return items;
  })();
  return fullCache.building;
}

// ---- daily scheduler: rebuild at 11:00 Europe/Kyiv ----
let lastBuildKyivDay = null;
function kyivNowParts() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kyiv',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  return { day: `${get('year')}-${get('month')}-${get('day')}`, h: +get('hour'), m: +get('minute') };
}

function startDailyScheduler() {
  // mark today as already-built if disk cache is from today (Kyiv)
  if (fullCache.items) {
    const built = new Date(fullCache.at);
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Kyiv', year:'numeric', month:'2-digit', day:'2-digit'
    }).formatToParts(built);
    const get = t => parts.find(p => p.type === t).value;
    lastBuildKyivDay = `${get('year')}-${get('month')}-${get('day')}`;
    console.log(`[scheduler] disk cache from Kyiv day ${lastBuildKyivDay}`);
  }

  setInterval(() => {
    const { day, h, m } = kyivNowParts();
    if (h === 11 && m === 0 && lastBuildKyivDay !== day) {
      lastBuildKyivDay = day;
      console.log(`[scheduler] daily 11:00 Kyiv rebuild (${day})`);
      // Keep yesterday's items live during the rebuild — only invalidate the timestamp
      // so getFull picks up the stale-while-revalidate path. This way the API never
      // returns 0 items just because a rebuild kicked off.
      catalogCache = { at: 0, items: null, building: null };
      fullCache.at = 0;
      fullCache.partial = fullCache.items || fullCache.partial;
      fullCache.building = null;
      const env = readEnv();
      if (env.ACCESS_TOKEN) {
        getFull(env.ACCESS_TOKEN).catch(e => console.error('[scheduler] rebuild failed:', e.message));
      }
    }
  }, 30_000);
  console.log('[scheduler] daily rebuild armed for 11:00 Europe/Kyiv');
}

// ---- env file ----
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

// ---- token-source IP detector (for /__ingest) ----
function isLocal(req) {
  const ra = req.socket.remoteAddress || '';
  // Accept loopback only. Behind tunnel, remote will be tunnel's local socket too,
  // so we additionally require X-Forwarded-For absence.
  const xff = req.headers['x-forwarded-for'];
  const looksLoopback = ra === '127.0.0.1' || ra === '::1' || ra === '::ffff:127.0.0.1';
  return looksLoopback && !xff;
}

// ---- naive rate limiter (per-IP, sliding 1-min window) ----
const RATE_LIMIT = parseInt(process.env.RATE_LIMIT || '120', 10); // req/min
const buckets = new Map(); // ip -> [timestamps]
function clientIp(req) {
  const xff = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return xff || req.socket.remoteAddress || 'unknown';
}
function tooMany(req) {
  if (RATE_LIMIT <= 0) return false;
  const ip = clientIp(req);
  const now = Date.now();
  const cutoff = now - 60_000;
  let arr = buckets.get(ip) || [];
  arr = arr.filter(t => t > cutoff);
  if (arr.length >= RATE_LIMIT) { buckets.set(ip, arr); return true; }
  arr.push(now);
  buckets.set(ip, arr);
  return false;
}
setInterval(() => {
  const cutoff = Date.now() - 60_000;
  for (const [ip, arr] of buckets) {
    const f = arr.filter(t => t > cutoff);
    if (f.length === 0) buckets.delete(ip); else buckets.set(ip, f);
  }
}, 60_000).unref();

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

const server = http.createServer((req, res) => {
  const u = url.parse(req.url, true);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    return res.end();
  }

  // ---- /__ingest: only from localhost ----
  if (u.pathname === '/__ingest' && req.method === 'POST') {
    if (!isLocal(req)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'localhost_only' }));
    }
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const j = JSON.parse(body);
        if (!j.access_token) throw new Error('access_token required');
        const env = readEnv();
        env.ACCESS_TOKEN = j.access_token;
        env.EXPIRES_AT = String(j.expires_at || '');
        env.SAVED_AT = String(Math.floor(Date.now() / 1000));
        writeEnv(env);
        const len = j.access_token.length;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, len, expires_at: env.EXPIRES_AT }));
        console.log(`[ingest] token saved (len=${len}, expires_at=${env.EXPIRES_AT})`);
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ---- /capture: only from localhost ----
  if (u.pathname === '/capture') {
    if (!isLocal(req)) { res.writeHead(404); return res.end(); }
    const html = `<!doctype html><meta charset="utf-8"><title>capture</title>
<style>body{font:14px system-ui;padding:24px;max-width:600px}code{background:#f3f3f3;padding:2px 6px;border-radius:3px}</style>
<h2>Pelican — token capture</h2>
<div id="msg">Reading hash…</div>
<script>
(async()=>{
  const m=document.getElementById('msg');
  const p=new URLSearchParams(location.hash.slice(1));
  const access_token=p.get('access_token');
  const expires_at=parseInt(p.get('expires_at')||'0',10);
  if(!access_token){m.textContent='No access_token in hash.';return;}
  history.replaceState(null,'','/capture');
  try{
    const r=await fetch('/__ingest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({access_token,expires_at})});
    const j=await r.json();
    if(j.ok){m.innerHTML='OK — token ingested ('+j.len+' chars). <a href="/">Open app</a>.';}
    else{m.textContent='Error: '+JSON.stringify(j);}
  }catch(e){m.textContent='Network error: '+e.message;}
})();
</script>`;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  // ---- /__status (public, only TTL info, no token leakage) ----
  if (u.pathname === '/__status') {
    const env = readEnv();
    const now = Math.floor(Date.now() / 1000);
    const exp = parseInt(env.EXPIRES_AT || '0', 10);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      hasToken: !!env.ACCESS_TOKEN,
      expires_at: exp || null,
      seconds_left: exp ? exp - now : null,
      expired: exp ? now >= exp : null,
    }));
  }

  // ---- /api/strategies-full/progress (poll while building) ----
  if (u.pathname === '/api/strategies-full/progress') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    return res.end(JSON.stringify({
      ready: !!fullCache.items && (Date.now() - fullCache.at) < FULL_TTL_MS,
      building: !!fullCache.building,
      loaded: fullCache.progress.loaded,
      total: fullCache.progress.total,
      built_at: fullCache.at || null,
      schedule: 'daily 11:00 Europe/Kyiv',
    }));
  }

  // ---- /api/strategies-full (full catalog; ?partial=1 returns whatever's loaded so far) ----
  // disabled strategies (IsEnabled=false) don't load on libertex.copy-trade.io and are filtered out.
  if (u.pathname === '/api/strategies-full') {
    if (req.method !== 'GET') { res.writeHead(405); return res.end(); }
    if (tooMany(req)) { res.writeHead(429, { 'Retry-After':'60' }); return res.end('rate_limited'); }
    const env = readEnv();
    if (!env.ACCESS_TOKEN) { res.writeHead(503); return res.end('no_token'); }
    const allowPartial = u.query.partial === '1';
    const onlyEnabled = arr => arr.filter(s => s.IsEnabled !== false);
    // Partial mode: prefer items if we have them (fresh or stale), fall back to partial
    // (in-flight build's pre-fill). Either way the user sees something instead of waiting.
    if (allowPartial) {
      const src = fullCache.items || fullCache.partial;
      if (src) {
        const out = onlyEnabled(src);
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Catalog-Building': fullCache.building ? '1' : '0',
          'X-Catalog-Size': String(out.length),
          'X-Catalog-Loaded': String(fullCache.progress.loaded),
        });
        res.end(JSON.stringify(out));
        // touch getFull so a stale-while-revalidate kick happens if needed
        getFull(env.ACCESS_TOKEN).catch(()=>{});
        return;
      }
    }
    getFull(env.ACCESS_TOKEN).then(items => {
      const out = onlyEnabled(items);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Catalog-Built-At': String(fullCache.at),
        'X-Catalog-Size': String(out.length),
        'X-Catalog-Total-Raw': String(items.length),
      });
      res.end(JSON.stringify(out));
    }).catch(e => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'full_failed', message: e.message }));
    });
    return;
  }

  // ---- /api/strategies-all (id+name catalog only, cached) ----
  if (u.pathname === '/api/strategies-all') {
    if (req.method !== 'GET') { res.writeHead(405); return res.end(); }
    if (tooMany(req)) { res.writeHead(429, { 'Retry-After':'60' }); return res.end('rate_limited'); }
    const env = readEnv();
    if (!env.ACCESS_TOKEN) { res.writeHead(503); return res.end('no_token'); }
    getCatalog(env.ACCESS_TOKEN).then(items => {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Catalog-Built-At': String(catalogCache.at),
        'X-Catalog-Size': String(items.length),
      });
      res.end(JSON.stringify(items));
    }).catch(e => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'catalog_failed', message: e.message }));
    });
    return;
  }

  // ---- /api/* ----
  if (u.pathname.startsWith('/api/')) {
    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'method_not_allowed' }));
    }
    if (!pathAllowed(u.pathname)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'path_forbidden', path: u.pathname }));
    }
    if (tooMany(req)) {
      res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
      return res.end(JSON.stringify({ error: 'rate_limited', limit: RATE_LIMIT + '/min' }));
    }
    const env = readEnv();
    if (!env.ACCESS_TOKEN) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'no_token', hint: 'host needs to provide token' }));
    }
    const opts = {
      method: 'GET', hostname: UPSTREAM_HOST, path: req.url,
      headers: {
        'Authorization': 'Bearer ' + env.ACCESS_TOKEN,
        'Accept': 'application/json',
        'User-Agent': 'pelican-proxy/0.2',
      },
    };
    const upstreamReq = https.request(opts, upstreamRes => {
      const headers = { ...upstreamRes.headers };
      delete headers['transfer-encoding'];
      headers['Access-Control-Allow-Origin'] = '*';
      res.writeHead(upstreamRes.statusCode, headers);
      upstreamRes.pipe(res);
    });
    upstreamReq.on('error', e => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'upstream_error', message: e.message }));
    });
    upstreamReq.end();
    return;
  }

  // ---- static files ----
  let p = u.pathname === '/' ? '/index.html' : u.pathname;
  const fp = path.join(ROOT, p.replace(/^\/+/, ''));
  if (!fp.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
  // never serve dotfiles
  if (path.basename(fp).startsWith('.')) { res.writeHead(404); return res.end('not found'); }
  if (fs.existsSync(fp) && fs.statSync(fp).isFile()) {
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'application/octet-stream' });
    return fs.createReadStream(fp).pipe(res);
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found: ' + u.pathname);
});

server.listen(PORT, () => {
  console.log(`pelican proxy: http://localhost:${PORT}`);
  console.log(`rate limit: ${RATE_LIMIT}/min/IP, allowed paths: ${ALLOWED.length}`);

  // Try loading persisted catalog
  const disk = loadCatalogFromDisk();
  if (disk) {
    fullCache = { at: disk.at, items: disk.items, partial: null, building: null, progress: { loaded: disk.items.length, total: disk.items.length } };
    const ageH = ((Date.now() - disk.at) / 3600000).toFixed(1);
    console.log(`[catalog] restored ${disk.items.length} items from disk (age ${ageH}h)`);
  }

  startDailyScheduler();

  const env = readEnv();
  if (env.ACCESS_TOKEN) {
    const left = parseInt(env.EXPIRES_AT || '0', 10) - Math.floor(Date.now() / 1000);
    console.log(`token loaded (${left}s left)`);
    if (!disk) {
      // No persisted catalog — kick off initial build
      setTimeout(() => {
        console.log('[startup] no disk cache — building catalog now…');
        getFull(env.ACCESS_TOKEN).then(items => {
          console.log(`[startup] full catalog ready: ${items.length} items`);
        }).catch(e => console.error('[startup] full build failed:', e.message));
      }, 1000);
    }
  } else {
    console.log('no token yet — POST /__ingest from localhost');
  }
});
