// Search + filter + sort. Pure functions over the deal rows (arrays); state lives in main.js.
// scoreOf: (dealRow) => number — the audit score, injected so this file stays data-free.
export function applyFilters(deals, scoreOf, { q = '', cat = -1, store = '', sig = '', sort = 'score' } = {}) {
  const needle = q.trim().toLowerCase();
  const out = deals.filter((d) => {
    if (cat >= 0 && d[2] !== cat) return false;
    if (store && d[3] !== store) return false;
    if (sig && d[6] !== sig) return false;
    if (needle && !(d[1].toLowerCase().includes(needle) || d[3].toLowerCase().includes(needle))) return false;
    return true;
  });
  const by = {
    score: (a, b) => scoreOf(b) - scoreOf(a),
    saving: (a, b) => (b[5] - b[4]) - (a[5] - a[4]),
    discount: (a, b) => (b[5] - b[4]) / b[5] - (a[5] - a[4]) / a[5],
    priceAsc: (a, b) => a[4] - b[4],
    priceDesc: (a, b) => b[4] - a[4],
    name: (a, b) => a[1].localeCompare(b[1]),
  };
  return out.sort(by[sort] || by.score);
}
