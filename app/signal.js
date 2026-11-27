// Formatting + link-tier helpers. No network, no images, no external anything.
export function money(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
}
export function pct(n) { return Math.round(n) + '%'; }
// Link tier, derived from the URL itself:
//   1 = product page (amazon.com/dp/…) · 2 = deal page (slickdeals.net/f/…) · 3 = source article (links to the product)
export function linkTier(url) {
  if (/amazon\.com\/dp\//.test(url)) return 1;
  if (/slickdeals\.net\/f\//.test(url)) return 2;
  return 3;
}
export function linkTierLabel(url) {
  return ['', 'Product page', 'Deal page', 'Source article'][linkTier(url)];
}
export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
