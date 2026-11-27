// Cross-store compare: every store price we found for one product, cheapest marked BEST.
// The deal row's cmp field is "Store price|Store price"; the primary store+price is always row 0.
import { money, esc } from './signal.js';
export function compareRows(d) {
  const rows = [{ store: d[3], price: d[4], best: true }];
  if (d[10]) {
    for (const part of d[10].split('|')) {
      const i = part.lastIndexOf(' ');
      rows.push({ store: part.slice(0, i), price: Number(part.slice(i + 1)), best: false });
    }
  }
  const min = Math.min(...rows.map((r) => r.price));
  rows.forEach((r) => { r.best = r.price === min; });
  return rows.sort((a, b) => a.price - b.price);
}
export function compareTableHtml(d) {
  const rows = compareRows(d);
  if (rows.length < 2) return '<p class="muted">One store price found for this product. The audit lists a second store only when a second price was actually published.</p>';
  return '<table class="cmp"><thead><tr><th>Store</th><th>Price</th><th></th></tr></thead><tbody>' +
    rows.map((r) => `<tr><td>${esc(r.store)}</td><td class="num">${money(r.price)}</td><td>${r.best ? '<span class="best">BEST</span>' : ''}</td></tr>`).join('') +
    '</tbody></table>';
}
