// Catalog patch:
//   1. Pull strategy IDs from /api/discover/{codes} → add any not on disk.
//   2. Backfill Markets (and other fields) for cached items missing them.
// Run while server.js is serving — restart server afterwards to pick up the merged cache.

'use strict';
const fs = require('fs');
const path = require('path');

(function loadEnv() {
  const p = path.join(__dirname, '.env');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
})();

const PROXY = process.env.PROXY || 'http://localhost:' + (process.env.PORT || '8787');
const CATALOG = path.join(__dirname, '.catalog.json');

const DISCOVER_CODES = [
  'Strategies', 'GlobalSignals', 'CopiersBalance',
  'CopiersProfitMonth', 'CopiersProfitYear',
  'NewSignalProviders', 'TopFreeSignals', 'TopPaidSignals',
  'PerformanceFeeMonth', 'PerformanceFeeYear',
  'AvgInstructionsPerMonth', 'WinRate',
  'ReturnLastWeek', 'ReturnLastMonth', 'ReturnLastQuarter',
  'HighRisk', 'MediumRisk', 'LowRisk',
  'MaxDrawdown', 'Spotlight',
];

async function jget(p) {
  const r = await fetch(PROXY + p);
  if (!r.ok) throw new Error(p + ' -> ' + r.status);
  return r.json();
}
async function maybeJget(p) {
  try { const r = await fetch(PROXY + p); if (r.ok) return await r.json(); } catch {}
  return null;
}

function compactStrategy(meta, stats, base) {
  const inc = stats?.Profitability?.Inception || {};
  const tr  = stats?.Trades?.Inception || {};
  const hist = inc.History || [];
  const stride = hist.length > 60 ? Math.ceil(hist.length / 60) : 1;
  const trimmed = hist.filter((_, i) => i % stride === 0 || i === hist.length - 1);
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
    History: trimmed.length ? trimmed : (base.History || []),
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

async function main() {
  const t0 = Date.now();

  // 1. Existing
  const disk = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
  const have = new Map(disk.items.map(s => [s.Id, s]));
  console.log(`[patch] disk: ${disk.items.length} items`);

  // 2. Collect IDs from discover
  const discovered = new Map();
  for (const code of DISCOVER_CODES) {
    const arr = await maybeJget('/api/discover/' + code);
    if (Array.isArray(arr)) {
      for (const it of arr) {
        if (it.Strategy?.Id) {
          const id = it.Strategy.Id;
          if (!discovered.has(id)) {
            discovered.set(id, {
              Id: id, Name: it.Strategy.Name,
              ImageUploaded: it.Strategy.ImageUploaded,
              Profile: it.Strategy.Profile,
            });
          }
        }
      }
    }
  }
  console.log(`[patch] discover unique: ${discovered.size}`);

  // 3. Determine work:
  //    - new IDs: in discover, not on disk → fetch meta+stats
  //    - existing IDs missing Markets → fetch stats only (cheap)
  const newIds = [...discovered.values()].filter(s => !have.has(s.Id));
  const needMarkets = disk.items.filter(s => s.IsEnabled !== false && (!Array.isArray(s.Markets) || s.Markets.length === 0));
  console.log(`[patch] new IDs to fetch: ${newIds.length}`);
  console.log(`[patch] cached items missing Markets: ${needMarkets.length}`);

  const concurrency = 6;

  // Phase A: enrich new IDs (full meta+stats)
  const enrichedNew = [];
  if (newIds.length) {
    let cur = 0, done = 0;
    async function worker() {
      while (cur < newIds.length) {
        const idx = cur++;
        const b = newIds[idx];
        const [meta, stats] = await Promise.all([
          maybeJget('/api/strategies/' + b.Id),
          maybeJget('/api/strategies/' + b.Id + '/stats'),
        ]);
        enrichedNew[idx] = compactStrategy(meta, stats, b);
        done++;
        if (done % 100 === 0) console.log(`[patch] new-ID enriched ${done}/${newIds.length}`);
      }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  // Phase B: backfill Markets (and other stats) for existing items
  if (needMarkets.length) {
    let cur = 0, done = 0;
    async function worker() {
      while (cur < needMarkets.length) {
        const idx = cur++;
        const b = needMarkets[idx];
        const stats = await maybeJget('/api/strategies/' + b.Id + '/stats');
        // patch in-place
        if (stats) {
          const patched = compactStrategy(null, stats, b);
          have.set(b.Id, patched);
        }
        done++;
        if (done % 100 === 0) console.log(`[patch] markets backfill ${done}/${needMarkets.length}`);
      }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
  }

  // 4. Merge
  const merged = [];
  for (const s of have.values()) merged.push(s);
  for (const s of enrichedNew) if (s) merged.push(s);

  fs.writeFileSync(CATALOG, JSON.stringify({ at: Date.now(), items: merged }));
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[patch] disk now ${merged.length} items (added ${enrichedNew.length} new, backfilled markets for ${needMarkets.length}) in ${dt}s`);
}

main().catch(e => { console.error(e); process.exit(1); });
