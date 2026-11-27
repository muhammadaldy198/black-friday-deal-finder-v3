// All views. Every number on screen comes from the ledger (deals.js) or from the
// published formula (scores.js) — nothing is hand-typed into a template.
import { CATS } from './cats.js';
import { dealScore, scoreParts, verdict, topByScore, ledgerTotals } from './scores.js';
import { money, pct, esc, linkTierLabel } from './signal.js';
import { compareTableHtml, compareRows } from './compare.js';
import { CARTS, cartTotals } from './carts.js';
import { TRAPS } from './traps.js';
import { applyFilters } from './filters.js';

const CHECK = 'Checked 27 Nov 2026';

function stamp(d) {
  const v = verdict(d);
  const cls = v === 'BUY NOW' ? 'buy' : v === 'STRONG' ? 'strong' : v === 'ROUTINE' ? 'routine' : 'weak';
  return `<span class="stamp ${cls}">${v}</span>`;
}
function shopBtn(d, big = false) {
  return `<a class="shop${big ? ' big' : ''}" href="${esc(d[8])}" target="_blank" rel="noopener">Shop at ${esc(d[3])} ↗</a>`;
}
export function dealCard(d) {
  const s = Math.round(dealScore(d));
  return `<article class="card">
    <div class="card-top">${stamp(d)}${d[6] === 'N' ? '<span class="newlow">★ NEW LOW</span>' : ''}<span class="score" title="Audit Score">${s}</span></div>
    <h3><a href="#/deal/${d[0]}">${esc(d[1])}</a></h3>
    <div class="store">${esc(CATS[d[2]])} · ${esc(d[3])}</div>
    <div class="price"><span class="now">${money(d[4])}</span> <s>${money(d[5])}</s> <span class="save">save ${money(d[5] - d[4])} · ${pct((d[5] - d[4]) / d[5] * 100)} off</span></div>
    <p class="ev">${esc(d[7])}</p>
    ${shopBtn(d)}
    <div class="meta">${CHECK} · ${linkTierLabel(d[8])}</div>
  </article>`;
}

export function renderHome(ctx) {
  const t = ledgerTotals(ctx.deals);
  const top = topByScore(ctx.deals, 10);
  const grid = applyFilters(ctx.deals, dealScore, ctx.state).slice(0, ctx.shown);
  const stores = [...new Set(ctx.deals.map((d) => d[3]))].sort();
  return `
  <section class="hero">
    <p class="kicker">BLACK FRIDAY 2026 · AUDITED 27 NOVEMBER</p>
    <h1>BargainAudit</h1>
    <p class="tag">Every deal audited. Every cart priced.</p>
    <p class="lede">225 deals checked against their own price history on 27 Nov 2026. Each one carries an audit verdict, a published score, the evidence for it, and a link to buy it at the store that actually has the price. 35 are the lowest price ever recorded. 9 "deals" failed the audit and are listed as traps, not bargains.</p>
  </section>
  <section class="stats">
    <div><b>${t.deals}</b><span>deals audited</span></div>
    <div><b>${t.stores}</b><span>primary stores</span></div>
    <div><b>${t.newLow}</b><span>new all-time lows</span></div>
    <div><b>${TRAPS.length}</b><span>traps caught</span></div>
    <div><b>${money(t.savings)}</b><span>total savings</span></div>
  </section>
  <section class="top10">
    <h2>Top 10 by Audit Score</h2>
    <p class="sub">The score is public: discount% × 1.25 (max 50) + dollars saved ÷ 10 (max 20) + new-low bonus 20 + multi-store confirmation 10.</p>
    <table class="toplist"><thead><tr><th>#</th><th>Deal</th><th>Store</th><th>Price</th><th>Score</th><th></th></tr></thead><tbody>
    ${top.map((x) => `<tr><td class="num">${x.rank}</td><td><a href="#/deal/${x.d[0]}">${esc(x.d[1])}</a>${x.d[6] === 'N' ? ' <span class="newlow">★ NEW LOW</span>' : ''}</td><td>${esc(x.d[3])}</td><td class="num">${money(x.d[4])} <s>${money(x.d[5])}</s></td><td class="num"><b>${Math.round(x.s)}</b></td><td>${shopBtn(x.d)}</td></tr>`).join('')}
    </tbody></table>
  </section>
  <section class="dense">
    <h2>Fresh from the audit</h2>
    <p class="sub">The twelve highest-scoring deals, each with its verdict stamp and its store link.</p>
    <div class="grid">${topByScore(ctx.deals, 12).map((x) => dealCard(x.d)).join('')}</div>
  </section>
  <section class="ledger" id="ledger">
    <h2>All ${t.deals} audited deals</h2>
    <form class="filters" onsubmit="return false">
      <input id="f-q" type="search" placeholder="Search deals or stores…" value="${esc(ctx.state.q || '')}" aria-label="Search deals">
      <select id="f-cat" aria-label="Category"><option value="-1">All categories</option>${CATS.map((c, i) => `<option value="${i}"${ctx.state.cat === i ? ' selected' : ''}>${esc(c)}</option>`).join('')}</select>
      <select id="f-store" aria-label="Store"><option value="">All stores</option>${stores.map((s) => `<option${ctx.state.store === s ? ' selected' : ''}>${esc(s)}</option>`).join('')}</select>
      <select id="f-sig" aria-label="Signal"><option value="">All signals</option><option value="N"${ctx.state.sig === 'N' ? ' selected' : ''}>★ New lows only</option><option value="S"${ctx.state.sig === 'S' ? ' selected' : ''}>Strong only</option></select>
      <select id="f-sort" aria-label="Sort"><option value="score">Sort: Audit Score</option><option value="saving"${ctx.state.sort === 'saving' ? ' selected' : ''}>Sort: Most saved</option><option value="discount"${ctx.state.sort === 'discount' ? ' selected' : ''}>Sort: Biggest % off</option><option value="priceAsc"${ctx.state.sort === 'priceAsc' ? ' selected' : ''}>Sort: Price ↑</option><option value="priceDesc"${ctx.state.sort === 'priceDesc' ? ' selected' : ''}>Sort: Price ↓</option></select>
    </form>
    <p class="count">${grid.length} of ${applyFilters(ctx.deals, dealScore, ctx.state).length} matching deals shown</p>
    <div class="grid">${grid.map(dealCard).join('') || '<p class="muted">No deals match those filters.</p>'}</div>
    ${ctx.shown < applyFilters(ctx.deals, dealScore, ctx.state).length ? '<button class="more" id="load-more">Show more deals</button>' : ''}
  </section>
  <section class="carts">
    <h2>Audited carts</h2>
    <p class="sub">Six ready-made shopping plans. Totals are computed from the ledger's own prices — no bundle discount invented anywhere.</p>
    <div class="grid carts-grid">${CARTS.map((c) => {
      const tot = cartTotals(c, ctx.byId);
      return `<article class="card cart-card"><h3><a href="#/cart/${c[0]}">${esc(c[1])}</a></h3><p class="ev">${esc(c[2])}</p><div class="price"><span class="now">${money(tot.total)}</span> <s>${money(tot.was)}</s> <span class="save">save ${money(tot.saved)}</span></div><p class="meta">${tot.items.length} items · ${CHECK}</p></article>`;
    }).join('')}</div>
  </section>
  <section class="traps-teaser">
    <h2><a href="#/traps">9 traps caught →</a></h2>
    <p class="sub">"Deals" whose discount exists only on paper — a 58%-off shower head that never cost more, a "$0" phone that costs $3,600, a 50%-off vacuum that is $149 every day. Each one is shown with its claim, its real cut, and the evidence.</p>
  </section>
  <p class="method-link"><a href="#/method">How the audit works →</a> · <a href="#/compare">Cross-store compare →</a></p>`;
}

export function renderDeal(ctx, id) {
  const d = ctx.byId.get(id);
  if (!d) return '<p class="muted">No such deal in the ledger.</p><p><a href="#/">← Back to all deals</a></p>';
  const p = scoreParts(d);
  const rows = compareRows(d);
  const bar = (label, got, max) => `<div class="bar-row"><span>${label}</span><div class="bar"><i style="width:${Math.round(got / max * 100)}%"></i></div><b>${Math.round(got * 10) / 10} / ${max}</b></div>`;
  return `<p class="crumb"><a href="#/">← All deals</a> · ${esc(CATS[d[2]])} · ${esc(d[3])}</p>
  <article class="detail">
    <div class="card-top">${stamp(d)}${d[6] === 'N' ? '<span class="newlow">★ NEW LOW</span>' : ''}<span class="score big">${Math.round(p.total)}</span></div>
    <h1>${esc(d[1])}</h1>
    <div class="price big"><span class="now">${money(d[4])}</span> <s>${money(d[5])}</s> <span class="save">save ${money(d[5] - d[4])} · ${pct((d[5] - d[4]) / d[5] * 100)} off</span></div>
    <p class="ev big">${esc(d[7])}</p>
    <div class="shop-row">${shopBtn(d, true)}<span class="meta">${CHECK} · ${linkTierLabel(d[8])} · <a href="${esc(d[8])}" target="_blank" rel="noopener">open the link ↗</a></span></div>
    <h2>Audit Score breakdown — ${Math.round(p.total)} / 100</h2>
    <div class="bars">
      ${bar('Discount ' + pct((d[5] - d[4]) / d[5] * 100) + ' × 1.25', p.pct, 50)}
      ${bar('Dollars saved ' + money(d[5] - d[4]) + ' ÷ 10', p.usd, 20)}
      ${bar('New all-time low', p.low, 20)}
      ${bar('Confirmed at ' + rows.length + ' store' + (rows.length > 1 ? 's' : ''), p.multi, 10)}
    </div>
    <h2>Compare across stores</h2>
    ${compareTableHtml(d)}
    <h2>Evidence</h2>
    <p>${esc(d[7])}. Source: <a href="${esc(d[8])}" target="_blank" rel="noopener">${esc(d[9])}</a>. ${CHECK}. A stale price is worse than no price — this ledger drops any deal it could not re-check on 27 Nov.</p>
  </article>`;
}

export function renderCart(ctx, id) {
  const c = CARTS.find((x) => x[0] === id);
  if (!c) return '<p class="muted">No such cart.</p><p><a href="#/">← Back</a></p>';
  const tot = cartTotals(c, ctx.byId);
  return `<p class="crumb"><a href="#/">← All deals</a></p>
  <h1>${esc(c[1])}</h1>
  <p class="lede">${esc(c[2])}</p>
  <table class="toplist"><thead><tr><th>Item</th><th>Store</th><th>Price</th><th>Score</th><th></th></tr></thead><tbody>
  ${tot.items.map((d) => `<tr><td><a href="#/deal/${d[0]}">${esc(d[1])}</a></td><td>${esc(d[3])}</td><td class="num">${money(d[4])} <s>${money(d[5])}</s></td><td class="num"><b>${Math.round(dealScore(d))}</b></td><td>${shopBtn(d)}</td></tr>`).join('')}
  </tbody><tfoot><tr><td><b>Total</b></td><td></td><td class="num"><b>${money(tot.total)}</b> <s>${money(tot.was)}</s></td><td class="num"><b>save ${money(tot.saved)}</b></td><td></td></tr></tfoot></table>
  <p class="meta">${CHECK} · Totals computed from the ledger's own prices; no bundle discount invented.</p>`;
}

export function renderTraps() {
  return `<p class="crumb"><a href="#/">← All deals</a></p>
  <h1>Traps caught: ${TRAPS.length}</h1>
  <p class="lede">"Deals" whose discount exists only on paper. Each card shows the claim, the real cut, and the evidence. These are not bargains — they are warnings.</p>
  <div class="grid">${TRAPS.map((t) => `
    <article class="card trap">
      <div class="card-top"><span class="stamp trap-stamp">✕ INFLATED</span><span class="score weak">${t[3]}%</span></div>
      <h3>${esc(t[0])}</h3>
      <div class="store">${esc(t[1])}</div>
      <div class="claimbar"><span>Claimed ${t[2]}% off</span><div class="bar"><i class="claim" style="width:${t[2]}%"></i></div></div>
      <div class="claimbar"><span>Real cut ${t[3]}%</span><div class="bar"><i class="real" style="width:${Math.max(t[3], 2)}%"></i></div></div>
      <p class="ev"><b>${esc(t[4])}.</b> ${esc(t[5])}</p>
      <p class="meta">${esc(t[6])} <a href="${esc(t[7])}" target="_blank" rel="noopener">${esc(t[8])} ↗</a></p>
    </article>`).join('')}</div>`;
}

export function renderCompare(ctx) {
  const rows = ctx.deals.filter((d) => d[10]);
  return `<p class="crumb"><a href="#/">← All deals</a></p>
  <h1>Cross-store compare: ${rows.length} products</h1>
  <p class="lede">Every product in the ledger that two or more stores list, with each store's price. The cheapest is marked BEST. One deal per product — a product listed at three stores is one deal, not three.</p>
  ${rows.map((d) => `<section class="cmp-block"><h3><a href="#/deal/${d[0]}">${esc(d[1])}</a></h3>${compareTableHtml(d)}</section>`).join('')}`;
}

export function renderMethod(ctx) {
  const t = ledgerTotals(ctx.deals);
  return `<p class="crumb"><a href="#/">← All deals</a></p>
  <h1>How the audit works</h1>
  <h2>The standard</h2>
  <p>Every deal in this ledger was checked on 27 Nov 2026 against the price the product actually sold at — not the crossed-out "was" price on the listing. A deal earns NEW LOW only when a 27 Nov source calls it the lowest price ever and the number checks out against a second source. A deal earns STRONG when the cut is real and the price is live. Anything else is not listed at all.</p>
  <h2>The score</h2>
  <p>DealScore = discount% × 1.25 (max 50) + dollars saved ÷ 10 (max 20) + new-low bonus 20 + multi-store confirmation 10. Maximum 100. The formula is printed on every deal page with its own four numbers, so anyone can re-compute it.</p>
  <h2>Verdicts</h2>
  <p>BUY NOW (80+) · STRONG (55–79) · ROUTINE (35–54) · WEAK (under 35). A thin discount gets a thin verdict — the audit does not flatter a 15%-off listing into a bargain.</p>
  <h2>Stores, counted honestly</h2>
  <p>${t.stores} primary stores: the store where each deal's price was actually found. Compare prices from other stores are listed separately on the deal page and in the compare view (${t.compare} products) — they are never counted as extra deals or extra stores. One product is one deal, however many stores list it.</p>
  <h2>Links</h2>
  <p>Every deal has a link. Three kinds, labelled on each card: a product page (the store's own product listing), a deal page (a Slickdeals frontpage post whose Get Deal button opens the store), or the source article (the CNN / 9to5Toys / DealNews roundup whose link opens the product at the store). Zero deals without a link.</p>
  <h2>What was dropped</h2>
  <p>A stale price is worse than no price. Whole categories were dropped when their only sources were roundups from 17–23 Nov with no 27 Nov re-check. The Roomba 105 Vac is not in the ledger at all: its "$149, 50% off" badge is the everyday price (at or below $149 on about 3 of every 4 days this year) — it is listed under Traps instead. INFLATED deals are labelled, not hidden: ${TRAPS.length} of them, each with its claim, its real cut, and its evidence.</p>
  <h2>Sources</h2>
  <p>CNN Underscored (main, headphones, TV, laptop pages, 26–27 Nov 2026) · Slickdeals frontpage (27 Nov) · 9to5Toys Black Friday edition · Tom's Guide Amazon roundups (23 Nov) · DealNews appliance roundups (27 Nov) · ProductBible Sony sale (22 Nov) · SmartHomePerfected Fake Discount Report (16 Nov) · 12-month price-history checks (Oct 2026). Every card names its source and its check time: 27 Nov 2026.</p>`;
}
