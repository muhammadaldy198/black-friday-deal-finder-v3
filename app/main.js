// BargainAudit boot + router. The deal ledger is loaded with a dynamic import so the
// 225-row data file is NOT part of the first load.
import { renderHome, renderDeal, renderCart, renderTraps, renderCompare, renderMethod } from './views.js';

const state = { q: '', cat: -1, store: '', sig: '', sort: 'score' };
let ctx = null;

async function boot() {
  const { DEALS } = await import('./deals.js');
  ctx = { deals: DEALS, byId: new Map(DEALS.map((d) => [d[0], d])), state, shown: 24 };
  window.addEventListener('hashchange', () => render());
  document.getElementById('view').addEventListener('input', onFilter);
  document.getElementById('view').addEventListener('change', onFilter);
  document.getElementById('view').addEventListener('click', (e) => {
    if (e.target && e.target.id === 'load-more') {
      ctx.shown += 24;
      render();
      document.getElementById('ledger')?.scrollIntoView();
    }
  });
  render();
}

function onFilter(e) {
  if (!ctx) return;
  const id = e.target.id;
  if (id === 'f-q') state.q = e.target.value;
  else if (id === 'f-cat') state.cat = Number(e.target.value);
  else if (id === 'f-store') state.store = e.target.value;
  else if (id === 'f-sig') state.sig = e.target.value;
  else if (id === 'f-sort') state.sort = e.target.value;
  else return;
  ctx.shown = 24;
  render();
  const el = document.getElementById(id);
  if (el) {
    el.focus();
    if (id === 'f-q') el.setSelectionRange(el.value.length, el.value.length);
  }
}

function render() {
  if (!ctx) return;
  const view = document.getElementById('view');
  const parts = (location.hash || '#/').split('/');
  const route = parts[1] || '';
  const arg = parts[2] || '';
  document.title = route === 'deal' ? 'BargainAudit — Deal' : 'BargainAudit — Every deal audited. Every cart priced.';
  if (route === 'deal') view.innerHTML = renderDeal(ctx, arg);
  else if (route === 'cart') view.innerHTML = renderCart(ctx, arg);
  else if (route === 'traps') view.innerHTML = renderTraps(ctx);
  else if (route === 'compare') view.innerHTML = renderCompare(ctx);
  else if (route === 'method') view.innerHTML = renderMethod(ctx);
  else view.innerHTML = renderHome(ctx);
  window.scrollTo(0, 0);
}

boot();
