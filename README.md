# BargainAudit

[![Black Friday Deal Finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/muhammadaldy198/black-friday-deal-finder-v3/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/muhammadaldy198/black-friday-deal-finder-v3/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard)

**Every deal audited. Every cart priced.**

BargainAudit is a Black Friday deal finder that audits instead of listing. 225 deals checked against their own price history on 27 Nov 2026, across 71 primary stores and 14 categories. Each deal carries an audit verdict (BUY NOW / STRONG / ROUTINE / WEAK), a published DealScore out of 100, the evidence for it, and a link to buy it at the store that actually has the price.

- **35 new all-time lows** — each verified against a 27 Nov source and a second source.
- **67 products compared across stores** — cheapest marked BEST; one product is one deal, however many stores list it.
- **9 traps caught** — "deals" whose discount exists only on paper (a 58%-off shower head that never cost more, a "$0" phone that costs $3,600, a 50%-off vacuum that is $149 every day), each with its claim, its real cut, and its evidence.
- **6 audited carts** — ready-made shopping plans whose totals are computed from the ledger's own prices. No bundle discount invented anywhere.
- **$34,147.77 total savings** across the ledger.

## The score

DealScore = discount% × 1.25 (max 50) + dollars saved ÷ 10 (max 20) + new-low bonus 20 + multi-store confirmation 10. The formula is printed on the site and on every deal page with its own four numbers, so anyone can re-compute it.

## Method

Prices checked 27 Nov 2026 from CNN Underscored (main, headphones, TV, laptop pages), Slickdeals frontpage, 9to5Toys, Tom's Guide, DealNews, and ProductBible. A stale price is worse than no price: deals that could not be re-checked on 27 Nov were dropped, and INFLATED deals are labelled, not hidden. See the Method page in the app for the full standard.

## Run it

```sh
node serve.ts   # http://localhost:8080
```

Static files only — no build step, no network loads, no images. Open `app/index.html` in a browser.
