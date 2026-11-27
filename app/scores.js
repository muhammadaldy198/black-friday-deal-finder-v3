// DealScore: the audit score. Published formula, computed the same way for every deal.
//   discount% × 1.25 (max 50) + dollars saved ÷ 10 (max 20) + NEW LOW bonus 20 + multi-store confirmation 10.
// Max 100. No hidden inputs: every component is shown on the deal page.
export function discountPct(d) { return (d[5] - d[4]) / d[5] * 100; }
export function savedUsd(d) { return d[5] - d[4]; }
export function hasCompare(d) { return !!d[10]; }
export function scoreParts(d) {
  const pct = Math.min(discountPct(d) * 1.25, 50);
  const usd = Math.min(savedUsd(d) / 10, 20);
  const low = d[6] === 'N' ? 20 : 0;
  const multi = hasCompare(d) ? 10 : 0;
  return { pct, usd, low, multi, total: pct + usd + low + multi };
}
export function dealScore(d) { return scoreParts(d).total; }
export function verdict(d) {
  const s = dealScore(d);
  if (s >= 80) return 'BUY NOW';
  if (s >= 55) return 'STRONG';
  if (s >= 35) return 'ROUTINE';
  return 'WEAK';
}
export function topByScore(deals, n = 10) {
  return [...deals]
    .map((d) => ({ d, s: dealScore(d) }))
    .sort((a, b) => b.s - a.s || savedUsd(b.d) - savedUsd(a.d) || discountPct(b.d) - discountPct(a.d))
    .slice(0, n)
    .map((x, i) => ({ ...x, rank: i + 1 }));
}
export function ledgerTotals(deals) {
  const stores = new Set(deals.map((d) => d[3]));
  return {
    deals: deals.length,
    stores: stores.size,
    newLow: deals.filter((d) => d[6] === 'N').length,
    strong: deals.filter((d) => d[6] === 'S').length,
    compare: deals.filter((d) => hasCompare(d)).length,
    savings: deals.reduce((s, d) => s + savedUsd(d), 0),
    cats: new Set(deals.map((d) => d[2])).size,
  };
}
