// Indicator Explorer: search across 28 national series, inspect metadata & trend chart, export CSV or JSON

import { INDICATOR_CATALOG } from '../data/indicators.js';
import { bindChartTooltips, lineChartSvg } from '../components/charts.js';
import { downloadCsv, downloadJson, esc, renderTable } from '../components/ui.js';

const DOMAINS = ['All', 'Economy', 'Prices', 'Demographics', 'Labor', 'Social', 'Environment'];

export function renderExplorer(root, params) {
  let query = params.get('q') || '';
  let domain = params.get('domain') || 'All';
  let activeCode = INDICATOR_CATALOG[0].code;

  function draw() {
    const qLower = query.trim().toLowerCase();
    const filtered = INDICATOR_CATALOG.filter((item) => {
      const domainOk = domain === 'All' || item.domain === domain;
      if (!domainOk) return false;
      if (!qLower) return true;
      return (
        item.name.toLowerCase().includes(qLower) ||
        item.code.toLowerCase().includes(qLower) ||
        item.domain.toLowerCase().includes(qLower) ||
        item.source.toLowerCase().includes(qLower)
      );
    });

    const selected = filtered.find((i) => i.code === activeCode) || filtered[0] || null;
    if (selected) activeCode = selected.code;

    const domainPills = DOMAINS.map(
      (d) => `<button type="button" class="pill-btn ${domain === d ? 'active' : ''}" data-domain="${esc(d)}">${esc(d)}</button>`,
    ).join('');

    const inspectorHtml = selected
      ? `<article class="panel" style="margin-bottom:18px">
          <div class="panel-head">
            <div>
              <span class="kpi-code">${esc(selected.code)} · ${esc(selected.domain)}</span>
              <h2 class="panel-title" style="margin-top:6px">${esc(selected.name)}</h2>
              <p class="panel-sub">Latest: <strong>${selected.latest} ${esc(selected.unit)}</strong> (${esc(selected.year)}) · Frequency: ${esc(selected.freq)}</p>
            </div>
            <span class="citation-tag">${esc(selected.source)}</span>
          </div>
          ${lineChartSvg({
            labels: selected.years,
            series: [{ name: `${selected.name} (${selected.unit})`, values: selected.values, color: '#0f4c81', area: true }],
            unit: selected.unit === '%' ? '%' : '',
            height: 225,
          })}
        </article>`
      : `<article class="panel" style="margin-bottom:18px"><p>No indicator matches your search filter.</p></article>`;

    const tableHtml = renderTable({
      tableId: 'explorer-table',
      columns: [
        { key: 'code', label: 'Code', render: (v) => `<span class="kpi-code">${esc(v)}</span>` },
        { key: 'domain', label: 'Domain' },
        {
          key: 'name',
          label: 'Indicator',
          render: (v, row) =>
            `<button type="button" class="sort-btn" data-pick="${esc(row.code)}" style="color:#0f4c81;font-weight:700;text-transform:none;letter-spacing:0">${esc(v)}</button>`,
        },
        { key: 'latest', label: 'Latest', align: 'num', render: (v, row) => `${v} ${esc(row.unit)}` },
        { key: 'year', label: 'Period', align: 'num' },
        { key: 'source', label: 'Source' },
      ],
      rows: filtered,
    });

    root.innerHTML = `
      <div class="section-head" style="margin-top:0">
        <div>
          <h1>Statistical Indicator Explorer</h1>
          <p>Filter 28 national series across six domains, inspect 6-year trends, and export offline datasets.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="btn btn-outline" id="dl-exp-csv">Export CSV</button>
          <button type="button" class="btn btn-outline" id="dl-exp-json">Export JSON</button>
        </div>
      </div>

      <article class="panel" style="margin-bottom:18px">
        <div class="controls-bar" style="margin-bottom:0">
          <input class="control-input" id="exp-search" type="search" value="${esc(query)}" placeholder="Filter by keyword, code, or source..." style="min-width:230px;flex:1">
          <div class="pill-group">${domainPills}</div>
        </div>
      </article>

      ${inspectorHtml}

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Matching Series (${filtered.length} of ${INDICATOR_CATALOG.length})</h3>
            <p class="panel-sub">Click any indicator name to load its chart above.</p>
          </div>
        </div>
        ${tableHtml}
      </article>
    `;

    bindChartTooltips(root);

    const searchInput = root.querySelector('#exp-search');
    searchInput?.addEventListener('input', (ev) => {
      query = ev.target.value;
      draw();
      const el = root.querySelector('#exp-search');
      if (el) {
        el.focus();
        el.setSelectionRange(query.length, query.length);
      }
    });

    root.querySelectorAll('[data-domain]').forEach((btn) => {
      btn.addEventListener('click', () => {
        domain = btn.dataset.domain;
        draw();
      });
    });

    root.querySelectorAll('[data-pick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCode = btn.dataset.pick;
        draw();
      });
    });

    root.querySelector('#dl-exp-csv')?.addEventListener('click', () => {
      downloadCsv(
        'nusastat-indicators-2025.csv',
        ['Code', 'Domain', 'Indicator', 'Unit', 'Latest', 'Period', 'Frequency', 'Source', 'Series_2020_2025'],
        filtered.map((i) => [i.code, i.domain, i.name, i.unit, i.latest, i.year, i.freq, i.source, i.values.join(';')]),
      );
    });

    root.querySelector('#dl-exp-json')?.addEventListener('click', () => {
      downloadJson('nusastat-indicators-2025.json', filtered);
    });
  }

  draw();
}
