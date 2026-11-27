// Minimal hash router with awaited secondary CSS and literal dynamic import() per route
const app = document.getElementById('app');
const ROUTES = {
  economy: [() => import('./views/economy.js'), 'renderEconomy'],
  demographics: [() => import('./views/demographics.js'), 'renderDemographics'],
  regions: [() => import('./views/regions.js'), 'renderRegions'],
  explorer: [() => import('./views/explorer.js'), 'renderExplorer'],
  methodology: [() => import('./views/methodology.js'), 'renderMethodology'],
};
let lang = 'en', wired = false, extraCss;

const loadCss = () => (extraCss ??= new Promise((r) => {
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = 'styles-extra.css'; l.onload = l.onerror = r;
  document.head.appendChild(l);
}));

async function route() {
  window.__shotReady = false;
  const [pPart, qPart = ''] = (location.hash || '#/').slice(1).split('?');
  const seg = (pPart.replace(/^\/+/, '').split('/')[0] || 'home');
  const params = new URLSearchParams(qPart);
  if (params.get('lang') === 'id') lang = 'id'; else if (params.get('lang') === 'en') lang = 'en';

  try {
    const [, i18n] = await Promise.all([loadCss(), import('./data/i18n.js')]);
    if (!wired) { wired = true; i18n.wireChromeControls({ getLang: () => lang, toggleLang: () => { lang = lang === 'en' ? 'id' : 'en'; route(); } }); }
    i18n.closeMobileNav();
    i18n.applyChromeLabels(lang);
    document.querySelectorAll('.primary-nav a').forEach((a) => a.classList.toggle('active', a.dataset.route === seg));
    const ctx = { lang, t: i18n.getStrings(lang), params };
    if (seg === 'home') (await import('./views/home.js')).renderHome(app, ctx);
    else if (ROUTES[seg]) (await ROUTES[seg][0]())[ROUTES[seg][1]](app, ctx);
    else app.innerHTML = '<section class="panel"><h1>404</h1><p><a href="#/">Overview</a></p></section>';
  } finally {
    window.scrollTo(0, 0);
    window.__shotReady = true;
  }
}

window.addEventListener('hashchange', route);
route();
