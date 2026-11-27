// Six audited carts ("missions"): complete shopping plans whose totals are computed
// from the ledger's own prices — no bundle discount invented anywhere.
// [id, name, blurb, dealIds[]]
export const CARTS = [
  ['living-room', 'The Living Room, Done', 'A 65-inch OLED, a soundbar, and the two things that make the room feel finished. One cart, one checkout list.', ['lg-b6-65', 'sonos-beam-2', 'govee-string-lights-2', 'lego-santa-minifig']],
  ['work-from-home', 'Work From Home, Upgraded', 'A laptop that is actually fast, a 27-inch monitor, and the three desk items reviewers keep recommending.', ['dell-xps-13-2026', 'dell-s2725dsm', 'logitech-mx-master-3s', 'anker-nano-45w', 'peak-design-cubes']],
  ['audio-arsenal', 'The Audio Arsenal', 'The flagship noise-canceller at its all-time low, the best earbuds of the year, and two more pairs that cover travel and the gym.', ['sony-xm6', 'airpods-pro-3', 'soundcore-liberty-5', 'jbl-tour-one-m3']],
  ['creator-kit', 'Creator Starter Kit', 'A Pro laptop at its all-time low, a camera reviewers love, and the macro lens that makes product photos look expensive.', ['macbook-pro-m6-14', 'fujifilm-xt5-kit', 'moment-macro-75mm']],
  ['kitchen-reset', 'Kitchen Reset', 'The oven, the mixer, and the three pans that show up in every "best kitchen" list — all at verified lows.', ['breville-smart-oven', 'kitchenaid-artisan-5qt', 'hexclad-frypan-10', 'hexclad-saucier-3qt', 'lodge-skillet-set-3']],
  ['stocking-100', 'The $100 Stocking', 'Seven small gifts that add up to exactly one hundred dollars — and save almost as much again.', ['vanilla-bean-kings-50', 'rubbermaid-26pc', 'astroai-windshield', 'lego-roses', 'kasa-kl110-bulb', 'amazon-smart-plug', 'cocolab-cocofloss']],
];
export function cartTotals(cart, byId) {
  const items = cart[3].map((id) => byId.get(id)).filter(Boolean);
  const total = items.reduce((s, d) => s + d[4], 0);
  const was = items.reduce((s, d) => s + d[5], 0);
  return { items, total, was, saved: was - total };
}
