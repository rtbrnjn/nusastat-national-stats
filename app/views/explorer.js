// Indicator Explorer: live search, domain filter, column sort, 2-indicator comparison mode, and CSV/JSON export

import { INDICATOR_CATALOG } from '../data/indicators.js';
import { bindChartTooltips, lineChartSvg } from '../components/charts.js';
import { downloadCsv, downloadJson, esc, renderTable, takeawayBox } from '../components/ui.js';

const DOMAINS = ['All', 'Economy', 'Prices', 'Demographics', 'Labor', 'Social', 'Environment'];

export function renderExplorer(root, params) {
  let query = params.get('q') || '';
  let domain = params.get('domain') || 'All';
  let activeCode = INDICATOR_CATALOG[0].code;
  let compareCode = 'PRC-01';
  let compareOn = true;
  let sortKey = 'code';
  let sortDir = 'asc';

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
    }).sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });

    const primary = filtered.find((i) => i.code === activeCode) || filtered[0] || INDICATOR_CATALOG[0];
    if (primary) activeCode = primary.code;
    const secondary = INDICATOR_CATALOG.find((i) => i.code === compareCode) || INDICATOR_CATALOG[10];

    const domainPills = DOMAINS.map(
      (d) => `<button type="button" class="pill-btn ${domain === d ? 'active' : ''}" data-domain="${esc(d)}">${esc(d)}</button>`,
    ).join('');

    const seriesList = [
      { name: `${primary.name} (${primary.unit})`, values: primary.values, color: '#16425b', area: true },
    ];
    if (compareOn && secondary && secondary.code !== primary.code) {
      seriesList.push({ name: `${secondary.name} (${secondary.unit})`, values: secondary.values, color: '#9e2a2b', area: false });
    }

    const compareOptions = INDICATOR_CATALOG.map(
      (i) => `<option value="${esc(i.code)}" ${i.code === compareCode ? 'selected' : ''}>${esc(i.code)} · ${esc(i.name)} (${esc(i.unit)})</option>`,
    ).join('');

    const deltaPrimary = (primary.values[primary.values.length - 1] - primary.values[0]).toFixed(2);
    const tableHtml = renderTable({
      tableId: 'explorer-table',
      sortKey,
      sortDir,
      columns: [
        { key: 'code', label: 'Code', sortable: true, render: (v) => `<span class="code-tag">${esc(v)}</span>` },
        { key: 'domain', label: 'Domain', sortable: true },
        {
          key: 'name',
          label: 'Indicator',
          sortable: true,
          render: (v, row) =>
            `<button type="button" class="sort-btn" data-pick="${esc(row.code)}" style="color:#16425b;font-weight:700">${esc(v)}</button>`,
        },
        { key: 'latest', label: 'Latest', align: 'num', sortable: true, render: (v, row) => `${v} ${esc(row.unit)}` },
        { key: 'year', label: 'Period', align: 'num', sortable: true },
        { key: 'source', label: 'Official Source', sortable: true },
      ],
      rows: filtered,
    });

    root.innerHTML = `
      <div class="editorial-lead">
        <div>
          <span class="kicker">Open Statistical Catalog · 28 National Series</span>
          <h1>Indicator Explorer &amp; Two-Series Comparator</h1>
          <p>Search across domains, sort series metadata, compare any two indicators over 2020–2025, and export filtered CSV or JSON.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button type="button" class="btn btn-outline" id="dl-exp-csv">Export Filtered CSV</button>
          <button type="button" class="btn btn-outline" id="dl-exp-json">Export JSON</button>
        </div>
      </div>

      <article class="panel" style="margin-bottom:12px">
        <div class="controls-bar" style="margin-bottom:8px">
          <input class="control-input" id="exp-search" type="search" value="${esc(query)}" placeholder="Search keyword, code (ECO-01), or source..." style="min-width:220px;flex:1">
          <div class="pill-group">${domainPills}</div>
        </div>
        <div class="controls-bar" style="margin-bottom:0">
          <label style="font-size:0.8rem;font-weight:600;display:inline-flex;align-items:center;gap:6px">
            <input type="checkbox" id="toggle-compare" ${compareOn ? 'checked' : ''}> Compare with:
          </label>
          <select class="control-select" id="compare-select" aria-label="Secondary indicator" ${compareOn ? '' : 'disabled'} style="max-width:420px;flex:1">
            ${compareOptions}
          </select>
        </div>
      </article>

      <article class="panel" style="margin-bottom:12px">
        <div class="panel-head">
          <div>
            <span class="code-tag">${esc(primary.code)} · ${esc(primary.domain)}</span>
            <h2 class="panel-title" style="margin-top:5px">${esc(primary.name)}</h2>
            <p class="panel-sub">Latest: <strong>${primary.latest} ${esc(primary.unit)}</strong> (${esc(primary.year)}) · 2020–2025 net change: ${Number(deltaPrimary) >= 0 ? '+' : ''}${deltaPrimary} ${esc(primary.unit)}</p>
          </div>
          <span class="code-tag">${esc(primary.source)} · ${esc(primary.year)}</span>
        </div>
        ${lineChartSvg({
          labels: primary.years,
          series: seriesList,
          unit: primary.unit === '%' && (!compareOn || secondary.unit === '%') ? '%' : '',
          height: 205,
        })}
        ${takeawayBox(`Primary series ${primary.code} (${primary.source}, ${primary.year}) ${compareOn && secondary ? `plotted alongside ${secondary.code} (${secondary.name}: ${secondary.latest} ${secondary.unit})` : 'over 2020–2025'}.`)}
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Matching Series (${filtered.length} of ${INDICATOR_CATALOG.length})</h3>
            <p class="panel-sub">Click any indicator title to load it as the primary series, or click headers to sort.</p>
          </div>
        </div>
        ${tableHtml}
      </article>
    `;

    bindChartTooltips(root);

    root.querySelector('#exp-search')?.addEventListener('input', (ev) => {
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

    root.querySelector('#toggle-compare')?.addEventListener('change', (ev) => {
      compareOn = ev.target.checked;
      draw();
    });

    root.querySelector('#compare-select')?.addEventListener('change', (ev) => {
      compareCode = ev.target.value;
      draw();
    });

    root.querySelectorAll('[data-pick]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeCode = btn.dataset.pick;
        draw();
      });
    });

    root.querySelectorAll('#explorer-table .sort-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextKey = btn.dataset.sort;
        if (sortKey === nextKey) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else {
          sortKey = nextKey;
          sortDir = 'asc';
        }
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
