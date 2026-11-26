// Client-side hash router with lazy-loaded views for secondary routes

import { renderHome } from './views/home.js';

const appEl = document.getElementById('app');
const navEl = document.getElementById('primary-nav');
const toggleBtn = document.getElementById('nav-toggle');
const searchForm = document.getElementById('quick-search');
const searchInput = document.getElementById('quick-search-input');

function updateActiveNav(routeName) {
  document.querySelectorAll('.primary-nav a').forEach((link) => {
    const active = link.dataset.route === routeName;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function closeMobileNav() {
  if (!navEl || !toggleBtn) return;
  navEl.classList.remove('open');
  toggleBtn.setAttribute('aria-expanded', 'false');
}

if (toggleBtn && navEl) {
  toggleBtn.addEventListener('click', () => {
    const next = !navEl.classList.contains('open');
    navEl.classList.toggle('open', next);
    toggleBtn.setAttribute('aria-expanded', String(next));
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
  closeMobileNav();

  const rawHash = location.hash || '#/';
  const [pathPart, queryPart = ''] = rawHash.slice(1).split('?');
  const path = pathPart || '/';
  const params = new URLSearchParams(queryPart);

  try {
    if (path === '/' || path === '') {
      document.title = 'NusaStat · Republic of Indonesia National Statistical Portal';
      updateActiveNav('home');
      renderHome(appEl);
    } else if (path.startsWith('/economy')) {
      document.title = 'Economy & Prices · NusaStat';
      updateActiveNav('economy');
      const mod = await import('./views/economy.js');
      mod.renderEconomy(appEl, params);
    } else if (path.startsWith('/demographics')) {
      document.title = 'Demographics & Labor · NusaStat';
      updateActiveNav('demographics');
      const mod = await import('./views/demographics.js');
      mod.renderDemographics(appEl, params);
    } else if (path.startsWith('/regions')) {
      document.title = 'Regional Atlas & Provinces · NusaStat';
      updateActiveNav('regions');
      const mod = await import('./views/regions.js');
      mod.renderRegions(appEl, path, params);
    } else if (path.startsWith('/explorer')) {
      document.title = 'Indicator Explorer · NusaStat';
      updateActiveNav('explorer');
      const mod = await import('./views/explorer.js');
      mod.renderExplorer(appEl, params);
    } else if (path.startsWith('/methodology')) {
      document.title = 'Methodology & Release Calendar · NusaStat';
      updateActiveNav('methodology');
      const mod = await import('./views/methodology.js');
      mod.renderMethodology(appEl);
    } else {
      document.title = 'Not Found · NusaStat';
      updateActiveNav('');
      appEl.innerHTML = `<section class="panel">
        <h1>Page not found</h1>
        <p>No statistical view matches <code>${path.replace(/[&<>]/g, '')}</code>.</p>
        <a class="btn btn-outline" href="#/">Return to Overview</a>
      </section>`;
    }
  } finally {
    window.scrollTo(0, 0);
    window.__shotReady = true;
  }
}

window.addEventListener('hashchange', route);
route();
