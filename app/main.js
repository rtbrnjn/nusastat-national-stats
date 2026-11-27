// Minimal hash router: lazy-loads every view & dataset via literal import() so first load stays tiny

const appEl = document.getElementById('app');
const navEl = document.getElementById('primary-nav');
const toggleBtn = document.getElementById('nav-toggle');
const searchForm = document.getElementById('quick-search');
const searchInput = document.getElementById('quick-search-input');

function setActiveNav(name) {
  document.querySelectorAll('.primary-nav a').forEach((a) => {
    const active = a.dataset.route === name;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

if (toggleBtn && navEl) {
  toggleBtn.addEventListener('click', () => {
    const open = !navEl.classList.contains('open');
    navEl.classList.toggle('open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
  });
}

if (searchForm && searchInput) {
  searchForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const q = searchInput.value.trim();
    location.hash = q ? `#/explorer?q=${encodeURIComponent(q)}` : '#/explorer';
  });
}

async function route() {
  window.__shotReady = false;
  if (navEl && toggleBtn) {
    navEl.classList.remove('open');
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  const raw = location.hash || '#/';
  const [pathPart, queryPart = ''] = raw.slice(1).split('?');
  const path = pathPart || '/';
  const params = new URLSearchParams(queryPart);

  try {
    if (path === '/' || path === '') {
      document.title = 'NusaStat · Indonesia National Statistical Almanac';
      setActiveNav('home');
      const { renderHome } = await import('./views/home.js');
      renderHome(appEl);
    } else if (path.startsWith('/economy')) {
      document.title = 'Economy & Prices · NusaStat';
      setActiveNav('economy');
      const { renderEconomy } = await import('./views/economy.js');
      renderEconomy(appEl, params);
    } else if (path.startsWith('/demographics')) {
      document.title = 'Demographics & Labor · NusaStat';
      setActiveNav('demographics');
      const { renderDemographics } = await import('./views/demographics.js');
      renderDemographics(appEl, params);
    } else if (path.startsWith('/regions')) {
      document.title = '38-Province Regional Atlas · NusaStat';
      setActiveNav('regions');
      const { renderRegions } = await import('./views/regions.js');
      renderRegions(appEl, params);
    } else if (path.startsWith('/explorer')) {
      document.title = 'Indicator Explorer · NusaStat';
      setActiveNav('explorer');
      const { renderExplorer } = await import('./views/explorer.js');
      renderExplorer(appEl, params);
    } else if (path.startsWith('/methodology')) {
      document.title = 'Methodology & Release Calendar · NusaStat';
      setActiveNav('methodology');
      const { renderMethodology } = await import('./views/methodology.js');
      renderMethodology(appEl);
    } else {
      document.title = 'Not Found · NusaStat';
      setActiveNav('');
      appEl.innerHTML = `<section class="panel"><h1>Route not found</h1><p>Return to the <a href="#/">National Overview</a>.</p></section>`;
    }
  } finally {
    window.scrollTo(0, 0);
    window.__shotReady = true;
  }
}

window.addEventListener('hashchange', route);
route();
