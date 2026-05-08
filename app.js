'use strict';

// ---- i18n ----
// English text is the canonical source (used as both keys and values for the EN locale).
// Russian translations live in I18N_RU keyed by the English string.
const I18N_RU = {
  // Header / brand
  'Copy Trading': 'Copy Trading',
  'Search by signal name…': 'Поиск по названию сигнала…',
  'Toggle dark mode': 'Сменить тему',

  // Toolbar
  'Filters': 'Фильтры',
  'Hide filters': 'Скрыть фильтры',
  'Sort:': 'Сортировка:',
  '↻ reload': '↻ обновить',
  'Showing': 'Показано',
  'of': 'из',
  'page': 'стр.',
  'go to': 'перейти на',
  '‹ prev': '‹ назад',
  'next ›': 'вперёд ›',

  // Sidebar filters
  'Risk': 'Риск',
  'reset filters': 'сбросить фильтры',
  'Low': 'Низкий',
  'Medium': 'Средний',
  'High': 'Высокий',
  'Your Investment Amount, $': 'Ваш инвест. бюджет, $',
  'Return %': 'Доходность %',
  'Max Drawdown ≤': 'Макс. просадка ≤',
  'Balance': 'Баланс',
  'Mgmt Fee ≤': 'Комиссия ≤',
  'Copiers AUM ≥': 'Объём копиров. ≥',
  'Copiers ≥': 'Копировщиков ≥',
  'Age ≥ (days)': 'Возраст ≥ (дн.)',
  'Trades ≥': 'Сделок ≥',
  'Win Rate ≥': 'Win Rate ≥',
  'any': 'любой',

  // Table column headers
  'Name': 'Название',
  'Equity curve': 'График доходности',
  'Return %': 'Доходность %',
  'Copiers': 'Копировщики',
  'Copiers AUM': 'Объём копиров.',
  'Max Drawdown': 'Макс. просадка',
  'Age': 'Возраст',
  'Mgmt Fee %': 'Комиссия %',

  // Misc
  'reload via /api/discover': 'обновить через /api/discover',
  'Close': 'Закрыть',

  // Sort dropdown
  'Return ↓': 'Доходность ↓',
  'Return ↑': 'Доходность ↑',
  'Copiers ↓': 'Копировщики ↓',
  'Copiers ↑': 'Копировщики ↑',
  'Copiers AUM ↓': 'Объём ↓',
  'Copiers AUM ↑': 'Объём ↑',
  'Drawdown ↑': 'Просадка ↑',
  'Drawdown ↓': 'Просадка ↓',
  'Fee ↑': 'Комиссия ↑',
  'Fee ↓': 'Комиссия ↓',
  'Age ↓': 'Возраст ↓',
  'Age ↑': 'Возраст ↑',
  'Balance ↓': 'Баланс ↓',
  'Balance ↑': 'Баланс ↑',
  'Win Rate ↓': 'Win Rate ↓',
  'Win Rate ↑': 'Win Rate ↑',
  'Trades ↓': 'Сделок ↓',
  'Trades ↑': 'Сделок ↑',
  'Monthly Profit ↓': 'Прибыль/мес ↓',
  'Monthly Profit ↑': 'Прибыль/мес ↑',

  // Row CTA + state
  'Subscribe': 'Подписаться',
  'free': 'бесплатно',
  'Free': 'Бесплатно',
  'No matches.': 'Ничего не найдено.',

  // Card data labels (mobile)
  'Return': 'Доходность',
  'Max DD': 'Макс DD',
  'Fee': 'Комиссия',

  // Expanded panel
  'Monthly profit': 'Прибыль за месяц',
  'Realized P/L': 'Реализ. P/L',
  'Win Rate': 'Win Rate',
  'Loss Rate': 'Loss Rate',
  'Trades total': 'Всего сделок',
  'Yearly profit': 'Прибыль за год',
  'Currency': 'Валюта',
  'Traded markets': 'Торгуемые рынки',
  'no market data': 'нет данных по рынкам',
  'loading markets…': 'загрузка рынков…',
  'click row to load markets': 'нажмите для загрузки',

  // Trades sections
  'Open Trades': 'Открытые сделки',
  'Trade History': 'История сделок',
  'no data': 'нет данных',
  'no open positions': 'нет открытых позиций',
  'no closed signals in the last 30 days': 'нет закрытых сделок за 30 дней',
  'loading…': 'загрузка…',

  // Risk pill labels (in expanded panel)
  'Unsuitable': 'Неподходящий',

  // Loadmore strings
  'Full catalog of': 'Полный каталог из',
  'strategies loaded · rebuilt daily at 11:00 Kyiv time': 'стратегий · обновляется ежедневно в 11:00 (Киев)',
  'Building full catalog:': 'Сборка каталога:',
  'strategies': 'стратегий',
  'upstream rate-limited': 'rate-limit от upstream',
  'All': 'Все',
  'strategies are visible. Stats fill in as the build progresses; refresh of data every 20 sec.': 'стратегий видны. Статистика подгружается по мере сборки; обновление каждые 20 сек.',

  // Welcome modal
  'Start earning more by copying the trades of professionals on Libertex': 'Начните зарабатывать больше, копируя сделки профессионалов в Libertex',
  'welcome.desc': 'Зачем учиться на своих ошибках, если можно перенимать опыт лучших? Подключайтесь к успешным трейдерам, копируйте их стратегии и зарабатывайте на финансовых рынках — <b>подходит даже тем, у кого нет опыта в торговле</b>. Разумный трейдинг и быстрый рост!',
  'How it works': 'Как это работает',
  'Download the app': 'Скачайте приложение',
  'Available for iOS and Android': 'Доступно для iOS и Android',
  'Quick registration': 'Быстрая регистрация',
  'Use the e-mail from your Libertex account': 'Используйте e-mail от вашего аккаунта Libertex',
  'Link your MetaTrader account': 'Привяжите счёт MetaTrader',
  'welcome.step3.desc': 'Скопируйте данные из раздела «Ещё» в приложении Libertex и вставьте их в раздел «Счёт» в приложении Copy&nbsp;Trading',
  'Choose a top trader': 'Выберите топ-трейдера',
  'Browse profiles and pick one whose strategy fits you': 'Изучите профили и выберите того, чья стратегия вам подходит',
  'Automatic copying': 'Автоматическое копирование',
  'The system replicates the chosen trader\'s deals in real time': 'Система повторяет сделки выбранного трейдера в реальном времени',
  'Track the result': 'Следите за результатом',
  'Monitor profitability, change settings or pause at any time': 'Отслеживайте доходность, меняйте настройки или ставьте на паузу в любой момент',
  'Start now': 'Начать сейчас',
  'Let the experts\' experience work for you!': 'Пусть опыт экспертов работает на вас!',
  'Close': 'Закрыть',
};

let LANG = (function () {
  let saved = null;
  try { saved = localStorage.getItem('pelican-lang'); } catch (e) {}
  if (saved === 'ru' || saved === 'en') return saved;
  const nav = (navigator.language || '').toLowerCase();
  return nav.startsWith('ru') || nav.startsWith('uk') || nav.startsWith('be') ? 'ru' : 'en';
})();
function t(s) { return LANG === 'ru' ? (I18N_RU[s] || s) : s; }
function setLang(lang) {
  if (lang !== 'ru' && lang !== 'en') return;
  LANG = lang;
  try { localStorage.setItem('pelican-lang', lang); } catch (e) {}
  document.documentElement.lang = lang;
  applyI18n();
  if (typeof scheduleRender === 'function') scheduleRender();
}
function applyI18n() {
  // Cache original on-page content the first time we see each element so we
  // can restore it when switching back to English (works even when the
  // data-i18n key is an abstract id like 'welcome.desc' that is not a
  // natural-English string).
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (!key) return;
    if (el.dataset.i18nOrig == null) el.dataset.i18nOrig = el.textContent;
    el.textContent = (LANG === 'ru' && I18N_RU[key]) ? I18N_RU[key] : el.dataset.i18nOrig;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (!key) return;
    if (el.dataset.i18nOrigHtml == null) el.dataset.i18nOrigHtml = el.innerHTML;
    el.innerHTML = (LANG === 'ru' && I18N_RU[key]) ? I18N_RU[key] : el.dataset.i18nOrigHtml;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (!key) return;
    if (el.dataset.i18nOrigPh == null) el.dataset.i18nOrigPh = el.placeholder || '';
    el.placeholder = (LANG === 'ru' && I18N_RU[key]) ? I18N_RU[key] : el.dataset.i18nOrigPh;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.dataset.i18nAria;
    if (!key) return;
    if (el.dataset.i18nOrigAria == null) el.dataset.i18nOrigAria = el.getAttribute('aria-label') || '';
    el.setAttribute('aria-label', (LANG === 'ru' && I18N_RU[key]) ? I18N_RU[key] : el.dataset.i18nOrigAria);
  });
  // Reflect on the toggle button
  const tg = document.getElementById('lang-toggle');
  if (tg) tg.textContent = LANG === 'ru' ? 'EN' : 'RU';
}
document.documentElement.lang = LANG;
document.addEventListener('DOMContentLoaded', applyI18n);

// ---- Welcome modal ----
// Shown on every visit unless dismissed within the last 30 minutes.
// The inline <head> script in index.html already adds .welcome-suppressed
// to <html> when the timestamp is fresh, so the modal never flashes
// for returning visitors. This block wires up the close handlers.
(function () {
  const modal = document.getElementById('welcome-modal');
  if (!modal) return;
  const isSuppressed = document.documentElement.classList.contains('welcome-suppressed');
  if (isSuppressed) return; // nothing to do — modal is already display:none
  const LS_KEY = 'pelican-welcome-dismissed-at';
  document.body.classList.add('welcome-open');
  function dismiss() {
    try { localStorage.setItem(LS_KEY, String(Date.now())); } catch (e) {}
    modal.style.display = 'none';
    document.body.classList.remove('welcome-open');
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') dismiss(); }
  document.getElementById('welcome-close').addEventListener('click', dismiss);
  document.getElementById('welcome-cta').addEventListener('click', dismiss);
  document.addEventListener('keydown', onKey);
})();

const PAGE_SIZE = 20;

const STATE = {
  byId: new Map(),
  expanded: new Set(),
  page: 1,
  total: 0,
  ready: false,
  filters: {
    risk: new Set(),
    retMin: null, retMax: null,
    ddMax: null,
    aumMin: null,
    copiersMin: null,
    ageMin: null,
    tradesMin: null,
    winrateMin: null,
    feeMax: null,
    balanceMin: null,
    balanceMax: null,
    search: '',
  },
  sort: 'return-desc',
};

const $ = sel => document.querySelector(sel);
const list = $('#list');
const counts = $('#counts');
const pagerEl = $('#pager');
const loadmore = $('#loadmore');

// ---- formatters ----
function fmtPct(v, d=2) {
  if (v == null || isNaN(v)) return '—';
  const n = Number(v);
  return `<span class="${n >= 0 ? 'green' : 'red'}">${n.toFixed(d)}%</span>`;
}
function fmtMoney(v) {
  if (v == null || isNaN(v)) return '—';
  const n = Number(v);
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  let s;
  if (abs >= 1e6) s = (abs / 1e6).toFixed(2) + 'M';
  else if (abs >= 1e3) s = Math.round(abs).toLocaleString('en-US');
  else s = abs.toFixed(2);
  return `${sign}$${s}`;
}
function fmtMoneyFull(v) {
  if (v == null || isNaN(v)) return '—';
  const n = Number(v);
  return `${n < 0 ? '-' : ''}$${Math.round(Math.abs(n)).toLocaleString('en-US')}`;
}
function fmtNum(v) { return v == null ? '—' : Number(v).toLocaleString('en-US'); }
function fmtFee(s) {
  if (s.Fee != null) return (Number(s.Fee) * 100).toFixed(0) + '%';
  if (s._meta) return '<span class="free-cell">' + t('Free') + '</span>';
  return '<span class="dim">—</span>';
}
function fmtTradeTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso); if (isNaN(d.getTime())) return '—';
  const pad = n => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fmtTradePrice(v) { return v == null ? '—' : Number(v).toFixed(5); }
function fmtTradePnl(v, ccy='USD') {
  if (v == null) return '<span class="dim">—</span>';
  const n = Number(v), sign = n >= 0 ? '+' : '';
  return `<span class="${n >= 0 ? 'green' : 'red'}">${ccy} ${sign}${n.toFixed(2)}</span>`;
}
function ageDays(iso) {
  if (!iso) return null;
  const t = Date.parse(iso); if (isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86400000);
}
function fmtAge(d) {
  if (d == null) return '—';
  if (d < 60) return d + 'd';
  const m = Math.round(d / 30);
  if (m < 24) return m + 'mo';
  return (d / 365).toFixed(1) + 'y';
}
function initials(name) {
  if (!name) return '?';
  return [...(name + '').trim()].filter(c => /[\p{L}\p{N}]/u.test(c)).slice(0, 2).join('').toUpperCase() || '?';
}
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

// Donut chart: takes [{n, c}, ...] sorted by c desc; returns SVG with leader-line labels.
const DONUT_PALETTE = ['#7c5cd1','#ef7c46','#3ec2a6','#e85a8b','#5da944','#dcb946','#5a99e0','#b97cd1','#d65c5c','#9a8dd1','#c0a14b','#6fb88b'];
function donutChart(items, w=520, h=280) {
  if (!items.length) return '<span class="dim">no market data</span>';
  const sorted = items.slice().sort((a, b) => (b.c || 0) - (a.c || 0));
  const total = sorted.reduce((a, m) => a + (m.c || 0), 0) || 1;
  const cx = w / 2, cy = h / 2;
  const R = 90;            // outer radius
  const r = 52;            // inner radius (donut hole)
  const labelR = R + 10;   // label leader anchor
  const labelText = R + 30;// label text x-offset

  // build slice arc paths
  let angle = -Math.PI / 2; // start at top
  const slices = [];
  for (let i = 0; i < sorted.length; i++) {
    const m = sorted[i];
    const frac = (m.c || 0) / total;
    const sweep = frac * Math.PI * 2;
    const a0 = angle, a1 = angle + sweep;
    angle = a1;
    const aMid = (a0 + a1) / 2;
    const large = sweep > Math.PI ? 1 : 0;
    // outer edge points
    const x0 = cx + R * Math.cos(a0), y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
    // inner edge points
    const xi0 = cx + r * Math.cos(a0), yi0 = cy + r * Math.sin(a0);
    const xi1 = cx + r * Math.cos(a1), yi1 = cy + r * Math.sin(a1);
    // donut slice path
    const d = `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L ${xi1.toFixed(2)} ${yi1.toFixed(2)} A ${r} ${r} 0 ${large} 0 ${xi0.toFixed(2)} ${yi0.toFixed(2)} Z`;
    const color = DONUT_PALETTE[i % DONUT_PALETTE.length];
    slices.push({ m, frac, aMid, color, d });
  }

  // skip labels for very thin slices (< 1.5%)
  const labels = [];
  for (const s of slices) {
    if (s.frac < 0.015) continue;
    const isLeft = Math.cos(s.aMid) < 0;
    const x1 = cx + R * Math.cos(s.aMid), y1 = cy + R * Math.sin(s.aMid);
    const x2 = cx + labelR * Math.cos(s.aMid), y2 = cy + labelR * Math.sin(s.aMid);
    const tx = isLeft ? x2 - 6 : x2 + 6;
    const ty = y2 + 4;
    const anchor = isLeft ? 'end' : 'start';
    labels.push({
      line: `<polyline points="${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} ${(isLeft?x2-4:x2+4).toFixed(1)},${y2.toFixed(1)}" stroke="${s.color}" stroke-width="1" fill="none"/>`,
      text: `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="${anchor}" font-size="11" fill="var(--text)" font-weight="500">${escapeHtml(s.m.n)} <tspan fill="var(--muted)" font-weight="400">${s.m.c}</tspan></text>`,
    });
  }

  return `<svg class="donut" viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="xMidYMid meet">
    <g>${slices.map(s => `<path d="${s.d}" fill="${s.color}" stroke="var(--card)" stroke-width="1.5"/>`).join('')}</g>
    <g>${labels.map(l => l.line).join('')}</g>
    <g>${labels.map(l => l.text).join('')}</g>
  </svg>`;
}

function sparkline(history, w=140, h=34) {
  if (!history || history.length < 2) {
    return `<svg width="${w}" height="${h}"><text x="2" y="20" font-size="11" fill="var(--spark-no-data)">no data</text></svg>`;
  }
  // x is positioned by actual timestamp (not by index) so unevenly spaced data renders correctly
  const times = history.map(p => Date.parse(p.Timestamp));
  const tMin = times[0], tMax = times[times.length - 1];
  const tSpan = tMax - tMin || 1;
  const ys = history.map(p => p.AccountReturn);
  const yMin = Math.min(0, ...ys), yMax = Math.max(0, ...ys);
  const yRange = yMax - yMin || 1;
  const px = t => ((t - tMin) / tSpan) * (w - 2) + 1;
  const py = v => h - 2 - ((v - yMin) / yRange) * (h - 4);
  const pts = history.map((p, i) => `${px(times[i]).toFixed(1)},${py(p.AccountReturn).toFixed(1)}`);
  const last = ys[ys.length - 1];
  const stroke = last >= 0 ? 'var(--green)' : 'var(--red)';
  const fill = last >= 0 ? 'var(--area-green)' : 'var(--area-red)';
  const zeroY = py(0);
  const area = `M ${pts[0]} ` + pts.slice(1).map(p => `L ${p}`).join(' ') + ` L ${px(tMax).toFixed(1)},${zeroY.toFixed(1)} L ${px(tMin).toFixed(1)},${zeroY.toFixed(1)} Z`;
  const line = `M ${pts.join(' L ')}`;
  // preserveAspectRatio="none" lets the SVG stretch horizontally when CSS sets width:100%
  // (mobile stretches the curve across the full card width; on desktop the explicit width
  // attribute matches the viewBox so this is a no-op).
  // vector-effect="non-scaling-stroke" stays on the actual stroked elements only, not the
  // <svg> root (some Safari versions parse the root-level attribute oddly).
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <line x1="0" x2="${w}" y1="${zeroY}" y2="${zeroY}" stroke="var(--grid-line)" stroke-dasharray="2 3" stroke-width="1" vector-effect="non-scaling-stroke"/>
    <path d="${area}" fill="${fill}" stroke="none"/>
    <path d="${line}" fill="none" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
  </svg>`;
}

// ---- network ----
async function api(path) {
  const r = await fetch(path);
  if (r.status === 401 || r.status === 503) throw new Error('no_token');
  if (!r.ok) { const t = await r.text(); throw new Error(`${r.status}: ${t.slice(0,120)}`); }
  return r.json();
}

// ---- filters/sort ----
function passes(s) {
  const f = STATE.filters;
  if (f.search) {
    const q = f.search.toLowerCase();
    if (!(s.Name || '').toLowerCase().includes(q) && !(s.Profile?.Name || '').toLowerCase().includes(q)) return false;
  }
  if (f.risk.size && s.RiskProfile && !f.risk.has(s.RiskProfile)) return false;
  // hard filter: hide simulations and strategies without trades (no UI option).
  // For items still being enriched (no _stats yet) keep them visible.
  if (s.IsSimulated) return false;
  if (s._stats && !s.TradesTotal) return false;
  if (f.copiersMin != null && (s.NumCopiers ?? 0) < f.copiersMin) return false;
  if (f.aumMin != null && (s.CopiersAUM ?? 0) < f.aumMin) return false;
  if (f.balanceMin != null && (s.AccountBalance ?? 0) < f.balanceMin) return false;
  if (f.balanceMax != null && (s.AccountBalance ?? Infinity) > f.balanceMax) return false;
  if (f.feeMax != null && s.Fee != null && s.Fee * 100 > f.feeMax) return false;
  if (f.tradesMin != null && (s.TradesTotal ?? 0) < f.tradesMin) return false;
  const wr = winrate(s);
  if (f.winrateMin != null && (wr < 0 || wr < f.winrateMin)) return false;
  const age = ageDays(s.Inception);
  if (f.ageMin != null && (age == null || age < f.ageMin)) return false;
  if (f.retMin != null && (s.Return == null || s.Return < f.retMin)) return false;
  if (f.retMax != null && (s.Return == null || s.Return > f.retMax)) return false;
  if (f.ddMax != null && s.MaxDD != null && Math.abs(s.MaxDD) > f.ddMax) return false;
  return true;
}

function sortBy(arr) {
  const key = STATE.sort;
  const cmp = ({
    'return-desc':  (a,b) => (b.Return ?? -1e18) - (a.Return ?? -1e18),
    'return-asc':   (a,b) => (a.Return ??  1e18) - (b.Return ??  1e18),
    'dd-asc':       (a,b) => Math.abs(a.MaxDD ??  1e9) - Math.abs(b.MaxDD ??  1e9),
    'dd-desc':      (a,b) => Math.abs(b.MaxDD ?? -1e9) - Math.abs(a.MaxDD ?? -1e9),
    'aum-desc':     (a,b) => (b.CopiersAUM ?? -1) - (a.CopiersAUM ?? -1),
    'aum-asc':      (a,b) => (a.CopiersAUM ?? Infinity) - (b.CopiersAUM ?? Infinity),
    'copiers-desc': (a,b) => (b.NumCopiers ?? -1) - (a.NumCopiers ?? -1),
    'copiers-asc':  (a,b) => (a.NumCopiers ?? Infinity) - (b.NumCopiers ?? Infinity),
    'fee-asc':      (a,b) => (a.Fee ?? Infinity) - (b.Fee ?? Infinity),
    'fee-desc':     (a,b) => (b.Fee ?? -1) - (a.Fee ?? -1),
    'age-desc':     (a,b) => (ageDays(b.Inception) ?? -1) - (ageDays(a.Inception) ?? -1),
    'age-asc':      (a,b) => (ageDays(a.Inception) ?? Infinity) - (ageDays(b.Inception) ?? Infinity),
    'balance-desc': (a,b) => (b.AccountBalance ?? -1) - (a.AccountBalance ?? -1),
    'balance-asc':  (a,b) => (a.AccountBalance ?? Infinity) - (b.AccountBalance ?? Infinity),
    'winrate-desc': (a,b) => winrate(b) - winrate(a),
    'winrate-asc':  (a,b) => winrate(a) - winrate(b),
    'trades-desc':  (a,b) => (b.TradesTotal ?? -1) - (a.TradesTotal ?? -1),
    'trades-asc':   (a,b) => (a.TradesTotal ?? Infinity) - (b.TradesTotal ?? Infinity),
    'monthly-desc': (a,b) => (b.MonthlyProfit ?? -1e18) - (a.MonthlyProfit ?? -1e18),
    'monthly-asc':  (a,b) => (a.MonthlyProfit ??  1e18) - (b.MonthlyProfit ??  1e18),
  })[key] || (() => 0);
  return arr.slice().sort(cmp);
}
function winrate(s) {
  const t = (s.Wins ?? 0) + (s.Losses ?? 0);
  return t ? (s.Wins / t * 100) : -1;
}

// ---- render ----
function render() {
  const all = [...STATE.byId.values()];
  const filtered = all.filter(passes);
  const ordered = sortBy(filtered);

  const totalPages = Math.max(1, Math.ceil(ordered.length / PAGE_SIZE));
  if (STATE.page > totalPages) STATE.page = totalPages;
  if (STATE.page < 1) STATE.page = 1;

  const startIdx = (STATE.page - 1) * PAGE_SIZE;
  const pageItems = ordered.slice(startIdx, startIdx + PAGE_SIZE);

  counts.innerHTML = `${t('Showing')} <b>${ordered.length}</b> ${t('of')} <b>${STATE.total || all.length}</b>
    · ${t('page')} <b>${STATE.page}</b> / ${totalPages}`;

  const html = pageItems.map(rowHtml).join('') || `<div style="padding:60px 20px;text-align:center;color:var(--muted)">${t('No matches.')}</div>`;
  list.innerHTML = html;

  // Background-fill: catalog rows that came back from the daily build with empty meta/stats
  // (upstream had a transient blip during the rebuild). Try once per session per row — the
  // _enrichAttempted flag set by enrichOne stops us from looping forever on permanently-404 rows.
  for (const s of pageItems) {
    if ((!s._meta || !s._stats) && !s._enrichAttempted) enrichOne(s.Id);
  }

  renderPager(totalPages);
  syncSortIndicators();
}

let renderScheduled = false;
function scheduleRender() {
  if (renderScheduled) return;
  renderScheduled = true;
  requestAnimationFrame(() => { renderScheduled = false; render(); });
}

function rowHtml(s) {
  const wr = winrate(s);
  const lr = wr >= 0 ? 100 - wr : -1;
  const isOpen = STATE.expanded.has(s.Id);
  const link = `https://libertex.copy-trade.io/strategy/${s.Id}`;
  const profileName = s.Profile?.Name || (s.Profile ? '#' + s.Profile.Id : '');
  const risk = s.RiskProfile || 'Unsuitable';
  const age = ageDays(s.Inception);

  const headRow = `<div class="row${isOpen ? ' open' : ''}" data-id="${s.Id}">
    <div class="name">
      <div class="avatar">
        <span class="avatar-fallback">${escapeHtml(initials(s.Name))}</span>
        ${s.ImageUploaded ? `<img class="avatar-img" src="https://assets.copy-trade.io/images/strategies/thumbnails/${s.Id}" alt="" loading="lazy" decoding="async" onerror="this.remove()">` : ''}
      </div>
      <div class="nm">
        <div class="title">${escapeHtml(s.Name || ('#' + s.Id))}${s._meta && s.Fee == null ? '<span class="free-badge">free</span>' : ''}</div>
        <div class="by">${escapeHtml(profileName)}</div>
      </div>
    </div>
    <div class="c-spark" data-label="Equity curve">${sparkline(s.History)}</div>
    <div class="c-num" data-label="${t('Return')}">${fmtPct(s.Return, 1)}</div>
    <div class="c-num" data-label="${t('Copiers')}">${fmtNum(s.NumCopiers)}</div>
    <div class="c-num" data-label="${t('Copiers AUM')}">${fmtMoney(s.CopiersAUM)}</div>
    <div class="c-num" data-label="${t('Max DD')}">${s.MaxDD != null ? fmtPct(s.MaxDD, 2) : '—'}</div>
    <div class="c-num" data-label="${t('Age')}">${fmtAge(age)}</div>
    <div class="c-num" data-label="${t('Balance')}">${fmtMoney(s.AccountBalance)}</div>
    <div class="c-num" data-label="${t('Fee')}">${fmtFee(s)}</div>
    <div class="c-link"><a class="signal-link" data-link href="${link}" target="_blank" rel="noopener">${t('Subscribe')}</a></div>
  </div>`;

  let marketsHtml;
  if (Array.isArray(s.Markets) && s.Markets.length) {
    const totalC = s.Markets.reduce((a, m) => a + (m.c || 0), 0) || 1;
    marketsHtml = s.Markets.map(m => {
      const pct = ((m.c / totalC) * 100).toFixed(0);
      return `<span class="market-tag" title="${m.c} trades · ${pct}%">${escapeHtml(m.n)} <span class="market-count">${m.c}</span></span>`;
    }).join('');
  } else if (s._marketsLoading) {
    marketsHtml = `<span class="dim"><span class="spinner"></span>${t('loading markets…')}</span>`;
  } else if (Array.isArray(s.Markets)) {
    marketsHtml = `<span class="dim">${t('no market data')}</span>`;
  } else {
    marketsHtml = `<span class="dim">${t('click row to load markets')}</span>`;
  }

  const det = `<div class="details">
    <div class="field"><div class="label">${t('Monthly profit')}</div><div class="value">${fmtMoneyFull(s.MonthlyProfit)}</div></div>
    <div class="field"><div class="label">${t('Balance')}</div><div class="value">${fmtMoneyFull(s.AccountBalance)}</div></div>
    <div class="field"><div class="label">${t('Realized P/L')}</div><div class="value">${fmtMoneyFull(s.RealisedPnl)}</div></div>
    <div class="field"><div class="label">${t('Risk')}</div><div class="value"><span class="pill ${risk}">${t(risk)}</span></div></div>
    <div class="field"><div class="label">${t('Win Rate')}</div><div class="value">${wr >= 0 ? wr.toFixed(0) + '%' : '—'}</div></div>
    <div class="field"><div class="label">${t('Loss Rate')}</div><div class="value">${lr >= 0 ? lr.toFixed(0) + '%' : '—'}</div></div>
    <div class="field"><div class="label">${t('Age')}</div><div class="value">${fmtAge(age)}</div></div>
    <div class="field"><div class="label">${t('Trades total')}</div><div class="value">${fmtNum(s.TradesTotal)}</div></div>
    <div class="field"><div class="label">${t('Yearly profit')}</div><div class="value">${fmtMoneyFull(s.YearlyProfit)}</div></div>
    <div class="field"><div class="label">${t('Currency')}</div><div class="value">${escapeHtml(s.Currency || '—')}</div></div>
    <div class="trades-buttons">
      ${tradesButton(s, 'open')}
      ${tradesButton(s, 'closed')}
    </div>
    <div class="field markets"><div class="label">${t('Traded markets')}</div><div class="value markets-list">${marketsHtml}</div></div>
    ${tradesList(s, 'open')}
    ${tradesList(s, 'closed')}
  </div>`;

  return headRow + det;
}

// Upstream returns the full set in one shot (Skip/Take are ignored), so we just fetch once
// and let the user scroll within the trades-list (scrollable area capped via CSS).

function tradeRowHtml(tr, kind) {
  const dir = String(tr.Direction || '').toUpperCase();
  const dirCls = dir === 'BUY' ? 'dir-buy' : 'dir-sell';
  const closeOrCurrent = kind === 'closed' ? tr.ClosePrice : tr.CurrentPrice;
  const pnl = kind === 'closed' ? tr.RealisedProfit : tr.UnrealisedProfit;
  const closeTime = kind === 'closed' ? tr.CloseTimestamp : null;
  return `<div class="trade">
    <div class="trade-main">
      <span class="trade-dir ${dirCls}">${dir}</span>
      <span class="trade-qty">${tr.Quantity}</span>
      <span class="trade-inst">${escapeHtml(tr.Instrument || '')}</span>
      <span class="trade-prices">@ ${fmtTradePrice(tr.OpenPrice)} → ${fmtTradePrice(closeOrCurrent)}</span>
    </div>
    <div class="trade-pnl">${fmtTradePnl(pnl, tr.CurrencyCode)}</div>
    <div class="trade-meta">
      <span class="trade-time">${fmtTradeTime(tr.OpenTimestamp)}${closeTime ? ' → ' + fmtTradeTime(closeTime) : ''}</span>
      <span class="trade-id">#${escapeHtml(String(tr.TradeId || ''))}</span>
    </div>
  </div>`;
}

function tradesButton(s, kind) {
  const title       = t(kind === 'open' ? 'Open Trades' : 'Trade History');
  const dataKey     = kind === 'open' ? '_openTrades'   : '_closedTrades';
  const expandedKey = kind === 'open' ? '_openExpanded' : '_closedExpanded';
  const items = s[dataKey];
  const isExpanded = !!s[expandedKey];
  const count = Array.isArray(items) ? items.length : null;
  return `<button class="trades-toggle${isExpanded ? ' open' : ''}" data-trades-toggle="${kind}" type="button" aria-expanded="${isExpanded}">
    <span class="trades-chev" aria-hidden="true">${isExpanded ? '▾' : '▸'}</span>
    <span class="trades-title">${title}</span>${count != null ? `<span class="trades-count">${count}</span>` : ''}
  </button>`;
}

function tradesList(s, kind) {
  const expandedKey = kind === 'open' ? '_openExpanded' : '_closedExpanded';
  if (!s[expandedKey]) return '';
  const dataKey    = kind === 'open' ? '_openTrades'  : '_closedTrades';
  const loadingKey = kind === 'open' ? '_openLoading' : '_closedLoading';
  const title      = t(kind === 'open' ? 'Open Trades' : 'Trade History');
  const items = s[dataKey];
  let body;
  if (s[loadingKey]) {
    body = `<div class="dim trades-empty"><span class="spinner"></span>${t('loading…')}</div>`;
  } else if (!Array.isArray(items)) {
    body = `<div class="dim trades-empty">${t('no data')}</div>`;
  } else if (items.length === 0) {
    body = `<div class="dim trades-empty">${t(kind === 'open' ? 'no open positions' : 'no closed signals in the last 30 days')}</div>`;
  } else {
    body = items.map(tr => tradeRowHtml(tr, kind)).join('');
  }
  return `<div class="trades-list-block trades-list-block--${kind}">
    <div class="trades-list-title">${title}</div>
    <div class="trades-list">${body}</div>
  </div>`;
}

async function loadTrades(s, kind) {
  const dataKey    = kind === 'open' ? '_openTrades'  : '_closedTrades';
  const loadingKey = kind === 'open' ? '_openLoading' : '_closedLoading';
  if (s[loadingKey] || Array.isArray(s[dataKey])) return;
  s[loadingKey] = true; scheduleRender();

  let qs = '';
  if (kind === 'closed') {
    // Upstream only honors the date window (Skip/Take are ignored) and caps it at ~30 days.
    const end = new Date();
    const start = new Date(Date.now() - 30 * 86400000);
    const fmt = d => d.toISOString().replace(/\.\d+Z$/, 'Z');
    qs = `?startDate=${encodeURIComponent(fmt(start))}&endDate=${encodeURIComponent(fmt(end))}`;
  }
  try {
    const r = await fetch(`/api/strategies/${s.Id}/signals/${kind}${qs}`);
    if (!r.ok) throw new Error(r.status);
    s[dataKey] = await r.json();
  } catch {
    s[dataKey] = [];
  } finally {
    s[loadingKey] = false; scheduleRender();
  }
}

function renderPager(total) {
  if (total <= 1) { pagerEl.innerHTML = ''; return; }
  const cur = STATE.page;
  const pages = pageRange(cur, total);
  let html = '';
  html += `<button data-go="prev" ${cur <= 1 ? 'disabled' : ''}>${t('‹ prev')}</button>`;
  for (const p of pages) {
    if (p === '…') html += `<span class="gap">…</span>`;
    else html += `<button class="page${p === cur ? ' cur' : ''}" data-go="${p}">${p}</button>`;
  }
  html += `<button data-go="next" ${cur >= total ? 'disabled' : ''}>${t('next ›')}</button>`;
  html += `<span class="info">${t('go to')} <input id="goto" type="number" min="1" max="${total}" value="${cur}" style="width:64px;padding:6px"></span>`;
  pagerEl.innerHTML = html;
}
function pageRange(cur, total) {
  const set = new Set([1, total, cur, cur-1, cur+1, cur-2, cur+2, 2, total-1]);
  const arr = [...set].filter(n => n >= 1 && n <= total).sort((a,b) => a-b);
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    if (i && arr[i] - arr[i-1] > 1) out.push('…');
    out.push(arr[i]);
  }
  return out;
}

// each column-header click toggles between primary ↔ secondary direction.
// primary is the "natural" direction (Return desc = top earners; DD asc = least drawdown).
const SORT_TOGGLE = {
  'return':  ['return-desc',  'return-asc'],
  'copiers': ['copiers-desc', 'copiers-asc'],
  'aum':     ['aum-desc',     'aum-asc'],
  'dd':      ['dd-asc',       'dd-desc'],
  'fee':     ['fee-asc',      'fee-desc'],
  'age':     ['age-desc',     'age-asc'],
  'balance': ['balance-desc', 'balance-asc'],
};
function syncSortIndicators() {
  document.querySelectorAll('.row.head .c-num.sortable').forEach(el => {
    el.classList.remove('active-asc','active-desc');
    const k = el.dataset.sort;
    if (!k) return;
    if (STATE.sort.startsWith(k + '-')) {
      el.classList.add(STATE.sort.endsWith('-asc') ? 'active-asc' : 'active-desc');
    }
  });
}

// ---- catalog: progressive load — show partial, refresh as it builds ----
async function loadFull() {
  let ready = false;
  let lastPaint = 0;

  // Initial: request partial immediately so we have something to show
  await fetchAndMerge(true);
  scheduleRender();

  // Poll until fully built
  while (!ready) {
    let p = null;
    try { p = await (await fetch('/api/strategies-full/progress')).json(); }
    catch { await new Promise(r => setTimeout(r, 1500)); continue; }
    ready = p.ready;
    const pct = p.total ? Math.min(100, (p.loaded / p.total) * 100) : 0;
    if (!ready) {
      loadmore.innerHTML = `<div class="progress-bar"><span style="width:${pct.toFixed(1)}%"></span></div>
        ${t('Building full catalog:')} <b>${p.loaded.toLocaleString('en-US')}</b> / ${p.total.toLocaleString('en-US')} ${t('strategies')} (${pct.toFixed(0)}%) · <i>${t('upstream rate-limited')}</i>
        <div class="dim" style="margin-top:8px">${t('All')} ${p.total.toLocaleString('en-US')} ${t('strategies are visible. Stats fill in as the build progresses; refresh of data every 20 sec.')}</div>`;
      // Re-fetch partial periodically to update displayed data
      if (Date.now() - lastPaint > 20000) {
        await fetchAndMerge(true);
        lastPaint = Date.now();
      }
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  // final fetch
  await fetchAndMerge(false);
  STATE.ready = true;
  loadmore.innerHTML = `<div class="dim">${t('Full catalog of')} <b>${STATE.total.toLocaleString('en-US')}</b> ${t('strategies loaded · rebuilt daily at 11:00 Kyiv time')}</div>`;
  scheduleRender();
}

async function fetchAndMerge(partial) {
  try {
    const url = partial ? '/api/strategies-full?partial=1' : '/api/strategies-full';
    const items = await api(url);
    STATE.total = items.length;
    for (const it of items) STATE.byId.set(it.Id, it);
    scheduleRender();
  } catch (e) { console.warn('catalog fetch failed:', e.message); }
}

async function searchExtra(filter) {
  if (!filter || !STATE.ready) return;
  // user may have typed a name not covered by our scan (rare emoji/CJK)
  try {
    const items = await api('/api/strategies?filter=' + encodeURIComponent(filter));
    let added = 0;
    const newIds = [];
    for (const it of items) {
      if (!STATE.byId.has(it.Id)) {
        STATE.byId.set(it.Id, { ...it, _stats: false, _meta: false });
        newIds.push(it.Id);
        added++;
      }
    }
    if (added) { STATE.total += added; scheduleRender(); }
    // enrich each newly-discovered strategy in parallel (capped) so columns aren't empty
    for (const id of newIds) enrichOne(id);
  } catch {}
}

const enrichInflight = new Set();
async function enrichOne(id) {
  if (enrichInflight.has(id)) return;
  const existing = STATE.byId.get(id);
  if (existing && existing._enrichAttempted && existing._meta && existing._stats) return; // already fully enriched
  enrichInflight.add(id);
  try {
    const [meta, stats] = await Promise.all([
      fetch('/api/strategies/' + id).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/strategies/' + id + '/stats').then(r => r.ok ? r.json() : null).catch(() => null),
    ]);
    const cur = STATE.byId.get(id) || { Id: id };
    if (meta) Object.assign(cur, {
      Name: meta.Name ?? cur.Name,
      NumCopiers: meta.NumCopiers ?? null,
      Fee: meta.Fee ?? null,
      RiskProfile: meta.RiskProfile ?? null,
      IsSimulated: meta.IsSimulated ?? false,
      IsEnabled: meta.IsEnabled,
      ImageUploaded: meta.ImageUploaded ?? cur.ImageUploaded,
      Profile: meta.Profile ?? cur.Profile,
      _meta: true,
    });
    if (stats) {
      const inc = stats.Profitability?.Inception || {};
      const tr  = stats.Trades?.Inception || {};
      const hist = inc.History || [];
      const stride = hist.length > 60 ? Math.ceil(hist.length / 60) : 1;
      const trimmed = hist.filter((_, i) => i % stride === 0 || i === hist.length - 1)
                          .map(p => ({ Timestamp: p.Timestamp, AccountReturn: p.AccountReturn }));
      Object.assign(cur, {
        Inception: stats.Inception,
        Currency: stats.CurrencyCode || 'USD',
        Return: inc.UnrealisedReturn != null ? inc.UnrealisedReturn * 100 : (inc.RealisedReturn != null ? inc.RealisedReturn * 100 : null),
        MaxDD: inc.MaxDrawdown != null ? inc.MaxDrawdown * 100 : null,
        RealisedPnl: inc.RealisedPnl, UnrealisedPnl: inc.UnrealisedPnl,
        History: trimmed,
        TradesTotal: tr.Total || 0, Wins: tr.Wins || 0, Losses: tr.Losses || 0,
        Markets: Array.isArray(tr.Markets) ? tr.Markets.slice(0, 12).map(m => ({ n: m.MarketName, c: m.Count })) : [],
        AccountBalance: stats.Status?.Balance,
        CopiersAUM: stats.CopiersBalance?.Balance,
        MonthlyProfit: stats.CopiersProfit?.Month,
        YearlyProfit: stats.CopiersProfit?.Year,
        _stats: true,
      });
    }
    // drop disabled (don't load on libertex anyway)
    if (cur.IsEnabled === false) STATE.byId.delete(id);
    else { cur._enrichAttempted = true; STATE.byId.set(id, cur); }
    scheduleRender();
  } finally { enrichInflight.delete(id); }
}


// ---- UI bindings ----
function bindUI() {
  const f = STATE.filters;
  document.querySelectorAll('#risk-chips .chip').forEach(c => {
    c.addEventListener('click', () => {
      const r = c.dataset.risk;
      if (f.risk.has(r)) f.risk.delete(r); else f.risk.add(r);
      c.classList.toggle('on');
      STATE.page = 1; scheduleRender();
    });
  });
  // ---- slider filters ----
  const fmtAUM = v => v >= 1e6 ? '$' + (v/1e6).toFixed(2) + 'M' : (v >= 1e3 ? '$' + Math.round(v/1e3) + 'K' : '$' + Math.round(v));
  // Balance uses a log-scale slider: raw 1..100 → $10..$10M; raw 0 = "any" (no filter).
  const balanceFromRaw = v => v <= 0 ? 0 : Math.round(Math.pow(10, 1 + (v - 1) / 99 * 6));
  // Inverse: $X → slider raw position (1..100). Used by Investment Amount input.
  const rawFromBalance = b => b <= 0 ? 0 : Math.max(1, Math.min(100, Math.round(1 + (Math.log10(b) - 1) * 99 / 6)));
  // Return % uses a log-scale slider: raw 1..100 → 1%..50000%; raw 0 = "any" (no min); raw 100 = "any" (no max).
  const returnFromRaw = v => v <= 0 ? 0 : Math.round(Math.pow(10, (v - 1) / 99 * 4.7));
  const fmtRetMag = v => v >= 1000 ? (v/1000).toFixed(1).replace(/\.0$/,'') + 'K%' : Math.round(v) + '%';
  const SLIDERS = {
    'dd-max':       { key:'ddMax',      parse: v => v >= 100 ? null : v,
                                          fmt: v => '≤ ' + v + '%',
                                          bubble: v => v + '%',
                                          scale: ['0%','50%','100%'] },
    'aum-min':      { key:'aumMin',     parse: v => v <= 0 ? null : v,
                                          fmt: v => '≥ ' + fmtAUM(v),
                                          bubble: v => fmtAUM(v),
                                          scale: ['$0', '$2.5M', '$5M'] },
    'copiers-min':  { key:'copiersMin', parse: v => v <= 0 ? null : v,
                                          fmt: v => '≥ ' + v.toLocaleString('en-US'),
                                          bubble: v => v.toLocaleString('en-US'),
                                          scale: ['0','1500','3000'] },
    'age-min':      { key:'ageMin',     parse: v => v <= 0 ? null : v,
                                          fmt: v => '≥ ' + v + 'd',
                                          bubble: v => v + 'd',
                                          scale: ['0d','1500d','3000d'] },
    'trades-min':   { key:'tradesMin',  parse: v => v <= 0 ? null : v,
                                          fmt: v => '≥ ' + v.toLocaleString('en-US'),
                                          bubble: v => v.toLocaleString('en-US'),
                                          scale: ['0','5000','10000'] },
    'winrate-min':  { key:'winrateMin', parse: v => v <= 0 ? null : v,
                                          fmt: v => '≥ ' + v + '%',
                                          bubble: v => v + '%',
                                          scale: ['0%','50%','100%'] },
    'fee-max':      { key:'feeMax',     parse: v => v >= 100 ? null : v,
                                          fmt: v => '≤ ' + v + '%',
                                          bubble: v => v + '%',
                                          scale: ['0%','50%','100%'] },
  };
  function wrapSlider(input) {
    const wrap = document.createElement('div');
    wrap.className = 'slider-wrap';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    wrap.appendChild(bubble);
    const setActive = on => wrap.classList.toggle('active', on);
    input.addEventListener('pointerdown', () => setActive(true));
    input.addEventListener('focus', () => setActive(true));
    document.addEventListener('pointerup', () => setActive(false));
    input.addEventListener('blur', () => setActive(false));
    return { wrap, bubble, setActive };
  }
  function updateFill(input) {
    const min = +input.min, max = +input.max;
    const pct = ((+input.value - min) / (max - min)) * 100;
    input.style.setProperty('--fill', pct + '%');
    return pct;
  }
  function appendScale(wrap, labels) {
    const sc = document.createElement('div');
    sc.className = 'scale';
    sc.innerHTML = labels.map(l => `<span>${l}</span>`).join('');
    wrap.parentNode.insertBefore(sc, wrap.nextSibling);
  }

  for (const [id, cfg] of Object.entries(SLIDERS)) {
    const el = $('#' + id);
    const valEl = $('#' + id + '-val');
    const { wrap, bubble } = wrapSlider(el);
    appendScale(wrap, cfg.scale);
    const update = () => {
      const raw = Number(el.value);
      const v = cfg.parse(raw);
      f[cfg.key] = v;
      if (v == null) { valEl.textContent = t('any'); valEl.classList.add('dim'); }
      else { valEl.textContent = cfg.fmt(v); valEl.classList.remove('dim'); }
      const pct = updateFill(el);
      bubble.style.setProperty('--p', pct);
      bubble.textContent = cfg.bubble(raw);
      STATE.page = 1; scheduleRender();
    };
    el.addEventListener('input', update);
    update();
  }

  // Return % — dual-handle slider sharing one track
  const retMinEl = $('#ret-min'), retMaxEl = $('#ret-max');
  const retTrack = $('#ret-track');
  const retLoBubble = $('#ret-min-bubble');
  const retHiBubble = $('#ret-max-bubble');
  function updateReturn() {
    let lo = Number(retMinEl.value);
    let hi = Number(retMaxEl.value);
    // prevent thumbs from crossing — clamp to keep at least step distance
    const step = Number(retMinEl.step) || 1;
    if (lo > hi - step) { // crossed: snap whichever was just moved
      if (document.activeElement === retMinEl) { lo = hi - step; retMinEl.value = lo; }
      else { hi = lo + step; retMaxEl.value = hi; }
    }
    f.retMin = lo <= 0   ? null : returnFromRaw(lo);
    f.retMax = hi >= 100 ? null : returnFromRaw(hi);
    const valEl = $('#ret-val');
    if (f.retMin == null && f.retMax == null) { valEl.textContent = t('any'); valEl.classList.add('dim'); }
    else {
      const a = f.retMin == null ? '0%'     : fmtRetMag(returnFromRaw(lo));
      const b = f.retMax == null ? '50K%+'  : fmtRetMag(returnFromRaw(hi));
      valEl.textContent = a + ' … ' + b;
      valEl.classList.remove('dim');
    }
    const min = Number(retMinEl.min), max = Number(retMinEl.max);
    const pLo = ((lo - min) / (max - min)) * 100;
    const pHi = ((hi - min) / (max - min)) * 100;
    retTrack.style.setProperty('--lo', pLo + '%');
    retTrack.style.setProperty('--hi', pHi + '%');
    retLoBubble.style.left = pLo + '%';
    retHiBubble.style.left = pHi + '%';
    retLoBubble.textContent = lo <= 0   ? '0%'    : fmtRetMag(returnFromRaw(lo));
    retHiBubble.textContent = hi >= 100 ? '50K%+' : fmtRetMag(returnFromRaw(hi));
    STATE.page = 1; scheduleRender();
  }
  function setActive(which, on) {
    retTrack.classList.toggle('active-' + which, on);
  }
  retMinEl.addEventListener('input', updateReturn);
  retMaxEl.addEventListener('input', updateReturn);
  retMinEl.addEventListener('pointerdown', () => setActive('lo', true));
  retMinEl.addEventListener('focus', () => setActive('lo', true));
  retMaxEl.addEventListener('pointerdown', () => setActive('hi', true));
  retMaxEl.addEventListener('focus', () => setActive('hi', true));
  document.addEventListener('pointerup', () => { setActive('lo', false); setActive('hi', false); });
  retMinEl.addEventListener('blur', () => setActive('lo', false));
  retMaxEl.addEventListener('blur', () => setActive('hi', false));
  updateReturn();

  // Balance — dual-handle slider on a log scale (raw 0..100 → $0..$10M+)
  const balMinEl = $('#balance-min'), balMaxEl = $('#balance-max');
  const balTrack = $('#balance-track');
  const balLoBubble = $('#balance-min-bubble');
  const balHiBubble = $('#balance-max-bubble');
  const balValEl = $('#balance-val');
  function updateBalance() {
    let lo = Number(balMinEl.value);
    let hi = Number(balMaxEl.value);
    const step = Number(balMinEl.step) || 1;
    if (lo > hi - step) {
      if (document.activeElement === balMinEl) { lo = hi - step; balMinEl.value = lo; }
      else { hi = lo + step; balMaxEl.value = hi; }
    }
    f.balanceMin = lo <= 0   ? null : balanceFromRaw(lo);
    f.balanceMax = hi >= 100 ? null : balanceFromRaw(hi);
    if (f.balanceMin == null && f.balanceMax == null) {
      balValEl.textContent = t('any'); balValEl.classList.add('dim');
    } else {
      const a = f.balanceMin == null ? '$0' : fmtAUM(balanceFromRaw(lo));
      const b = f.balanceMax == null ? '$10M+' : fmtAUM(balanceFromRaw(hi));
      balValEl.textContent = a + ' … ' + b;
      balValEl.classList.remove('dim');
    }
    balTrack.style.setProperty('--lo', lo + '%');
    balTrack.style.setProperty('--hi', hi + '%');
    balLoBubble.style.left = lo + '%';
    balHiBubble.style.left = hi + '%';
    balLoBubble.textContent = lo <= 0   ? '$0'    : fmtAUM(balanceFromRaw(lo));
    balHiBubble.textContent = hi >= 100 ? '$10M+' : fmtAUM(balanceFromRaw(hi));
    STATE.page = 1; scheduleRender();
  }
  function setActiveBal(which, on) { balTrack.classList.toggle('active-' + which, on); }
  balMinEl.addEventListener('input', updateBalance);
  balMaxEl.addEventListener('input', updateBalance);
  balMinEl.addEventListener('pointerdown', () => setActiveBal('lo', true));
  balMinEl.addEventListener('focus', () => setActiveBal('lo', true));
  balMaxEl.addEventListener('pointerdown', () => setActiveBal('hi', true));
  balMaxEl.addEventListener('focus', () => setActiveBal('hi', true));
  document.addEventListener('pointerup', () => { setActiveBal('lo', false); setActiveBal('hi', false); });
  balMinEl.addEventListener('blur', () => setActiveBal('lo', false));
  balMaxEl.addEventListener('blur', () => setActiveBal('hi', false));
  updateBalance();

  // Investment Amount: drives Balance sliders to [$50, $amount] automatically
  const investEl = $('#invest-amount');
  const investValEl = $('#invest-val');
  investEl.addEventListener('input', () => {
    const raw = investEl.value.trim();
    if (!raw) {
      // empty → release Balance to "any"
      balMinEl.value = 0;
      balMaxEl.value = 100;
      investValEl.textContent = t('any'); investValEl.classList.add('dim');
    } else {
      const amount = parseFloat(raw);
      if (!Number.isFinite(amount) || amount < 50) return;  // ignore < $50 per spec
      balMinEl.value = rawFromBalance(50);
      balMaxEl.value = rawFromBalance(amount);
      investValEl.textContent = '$' + Math.round(amount).toLocaleString('en-US');
      investValEl.classList.remove('dim');
    }
    balMaxEl.dispatchEvent(new Event('input', { bubbles: true }));
  });

  $('#sort').addEventListener('change', e => { STATE.sort = e.target.value; STATE.page = 1; scheduleRender(); });

  const filtersToggle = $('#filters-toggle');
  if (filtersToggle) {
    filtersToggle.addEventListener('click', () => {
      const aside = $('aside#filters');
      const open = aside.classList.toggle('open');
      filtersToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      filtersToggle.textContent = open ? t('Hide filters') : t('Filters');
    });
  }
  $('#refresh').addEventListener('click', () => { STATE.byId.clear(); STATE.page = 1; STATE.ready = false; loadFull(); });

  document.querySelectorAll('.row.head .c-num.sortable').forEach(el => {
    el.addEventListener('click', () => {
      const k = el.dataset.sort;
      const opts = SORT_TOGGLE[k];
      if (!opts) return;
      const next = (STATE.sort === opts[0] && opts[1]) ? opts[1] : opts[0];
      STATE.sort = next; $('#sort').value = next; STATE.page = 1; scheduleRender();
    });
  });

  list.addEventListener('click', e => {
    if (e.target.closest('[data-link]')) return; // let the Signal link <a> open normally
    if (e.target.closest('.trades-list')) return; // don't collapse the row when scrolling/clicking trades
    // Trades section toggle button (Open Trades / Trade History) — fetches lazily on first open
    const toggleBtn = e.target.closest('[data-trades-toggle]');
    if (toggleBtn) {
      e.stopPropagation();
      const kind = toggleBtn.dataset.tradesToggle;
      const row = toggleBtn.closest('.details')?.previousElementSibling;
      const id = Number(row?.dataset.id);
      const s = STATE.byId.get(id);
      if (!s) return;
      const expandedKey = kind === 'open' ? '_openExpanded' : '_closedExpanded';
      s[expandedKey] = !s[expandedKey];
      if (s[expandedKey] && !Array.isArray(s[kind === 'open' ? '_openTrades' : '_closedTrades'])) {
        loadTrades(s, kind);
      }
      scheduleRender();
      return;
    }
    const row = e.target.closest('.row[data-id]');
    if (!row) return;
    const id = Number(row.dataset.id);
    if (STATE.expanded.has(id)) STATE.expanded.delete(id);
    else {
      STATE.expanded.add(id);
      const s = STATE.byId.get(id);
      if (s && !Array.isArray(s.Markets) && !s._marketsLoading) {
        s._marketsLoading = true;
        fetch('/api/strategies/' + id + '/stats').then(r => r.json()).then(j => {
          const arr = j.Trades?.Inception?.Markets || [];
          s.Markets = arr.slice(0, 12).map(m => ({ n: m.MarketName, c: m.Count }));
        }).catch(() => { s.Markets = []; })
          .finally(() => { s._marketsLoading = false; scheduleRender(); });
      }
    }
    scheduleRender();
  });

  pagerEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-go]');
    if (!btn || btn.disabled) return;
    const action = btn.dataset.go;
    const total = Math.max(1, Math.ceil([...STATE.byId.values()].filter(passes).length / PAGE_SIZE));
    if (action === 'prev') STATE.page = Math.max(1, STATE.page - 1);
    else if (action === 'next') STATE.page = Math.min(total, STATE.page + 1);
    else STATE.page = Math.max(1, Math.min(total, parseInt(action, 10)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    scheduleRender();
  });
  pagerEl.addEventListener('change', e => {
    if (e.target.id !== 'goto') return;
    const total = Math.max(1, Math.ceil([...STATE.byId.values()].filter(passes).length / PAGE_SIZE));
    STATE.page = Math.max(1, Math.min(total, parseInt(e.target.value, 10) || 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    scheduleRender();
  });

  let to;
  $('#search').addEventListener('input', e => {
    f.search = e.target.value.trim();
    STATE.page = 1;
    scheduleRender();
    clearTimeout(to);
    to = setTimeout(() => searchExtra(f.search), 350);
  });

  $('#reset').addEventListener('click', () => {
    f.risk.clear(); document.querySelectorAll('#risk-chips .chip').forEach(c=>c.classList.remove('on'));
    // reset sliders to their "off" positions and re-trigger their handlers via 'input' event
    const defaults = {
      'ret-min': '0', 'ret-max': '100',
      'balance-min': '0', 'balance-max': '100',
      'dd-max': '100', 'aum-min': '0', 'copiers-min': '0',
      'age-min': '0', 'trades-min': '0', 'winrate-min': '0', 'fee-max': '100',
    };
    for (const [id, v] of Object.entries(defaults)) {
      const el = $('#' + id);
      if (!el) continue;
      el.value = v;
      el.dispatchEvent(new Event('input', { bubbles:true }));
    }
    if ($('#invest-amount')) {
      $('#invest-amount').value = '';
      $('#invest-amount').dispatchEvent(new Event('input', { bubbles:true }));
    }
    f.search = ''; $('#search').value = '';
    STATE.page = 1; scheduleRender();
  });
}

// ---- theme ----
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  const icon = document.querySelector('#theme-toggle .theme-icon');
  if (icon) icon.textContent = t === 'dark' ? '☀️' : '🌙';
}
(function initTheme() {
  // default: dark; first-visit users see dark, can opt out via toggle (persisted)
  let t = localStorage.getItem('pelican-theme') || 'dark';
  applyTheme(t);
})();
document.getElementById('theme-toggle').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('pelican-theme', next);
  scheduleRender(); // re-render rows so sparkline picks up new var values
});

// ---- language toggle ----
(function initLangToggle() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;
  btn.textContent = LANG === 'ru' ? 'EN' : 'RU';
  btn.addEventListener('click', () => {
    setLang(LANG === 'ru' ? 'en' : 'ru');
  });
})();

bindUI();
loadFull();
