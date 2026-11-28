// Indicator Explorer: live EN/ID search, domain filter, sort, 2-indicator comparison, CSV/JSON export

import { INDICATOR_CATALOG } from '../data/indicators.js';
import { lineChartSvg } from '../components/line-chart.js';
import { bindChartTooltips } from '../components/tooltip.js';
import { downloadCsv, downloadJson } from '../components/export.js';
import { esc, renderTable, takeawayBox } from '../components/ui.js';

const DOMAINS = [
  { key: 'All', en: 'All', id: 'Semua' },
  { key: 'Economy', en: 'Economy', id: 'Ekonomi' },
  { key: 'Prices', en: 'Prices', id: 'Harga' },
  { key: 'Demographics', en: 'Demographics', id: 'Demografi' },
  { key: 'Labor', en: 'Labor', id: 'Tenaga Kerja' },
  { key: 'Social', en: 'Social', id: 'Sosial' },
  { key: 'Regional', en: 'Regional', id: 'Regional' },
  { key: 'Environment', en: 'Environment', id: 'Lingkungan' },
];

export function renderExplorer(root, { lang, t, params }) {
  let query = params.get('q') || '';
  let domain = params.get('domain') || 'All';
  let activeCode = INDICATOR_CATALOG[0].code;
  let compareCode = 'PRC-01';
  let compareOn = true;
  let sortKey = 'code';
  let sortDir = 'asc';

  function draw() {
    const isId = lang === 'id';
    document.title = isId ? 'Penjelajah Indikator · NusaStat' : 'Indicator Explorer · NusaStat';
    const qLower = query.trim().toLowerCase();
    const filtered = INDICATOR_CATALOG.filter((item) => {
      const domainOk = domain === 'All' || item.domain === domain;
      if (!domainOk) return false;
      if (!qLower) return true;
      return (
        item.name.toLowerCase().includes(qLower) ||
        (item.nameId || '').toLowerCase().includes(qLower) ||
        item.code.toLowerCase().includes(qLower) ||
        item.domain.toLowerCase().includes(qLower) ||
        (item.domainId || '').toLowerCase().includes(qLower) ||
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
      (d) => `<button type="button" class="pill-btn ${domain === d.key ? 'active' : ''}" data-domain="${esc(d.key)}">${esc(isId ? d.id : d.en)}</button>`,
    ).join('');

    const pName = isId ? primary.nameId : primary.name;
    const sName = secondary ? (isId ? secondary.nameId : secondary.name) : '';

    const seriesList = [{ name: `${pName} (${primary.unit})`, values: primary.values, color: '#16425b', area: true }];
    if (compareOn && secondary && secondary.code !== primary.code) {
      seriesList.push({ name: `${sName} (${secondary.unit})`, values: secondary.values, color: '#9e2a2b', area: false });
    }

    const compareOptions = INDICATOR_CATALOG.map(
      (i) => `<option value="${esc(i.code)}" ${i.code === compareCode ? 'selected' : ''}>${esc(i.code)} · ${esc(isId ? i.nameId : i.name)} (${esc(i.unit)})</option>`,
    ).join('');

    const deltaPrimary = (primary.values[primary.values.length - 1] - primary.values[0]).toFixed(2);
    const tableHtml = renderTable({
      tableId: 'explorer-table',
      sortKey,
      sortDir,
      columns: [
        { key: 'code', label: isId ? 'Kode' : 'Code', sortable: true, render: (v) => `<span class="code-tag">${esc(v)}</span>` },
        { key: 'domain', label: 'Domain', sortable: true, render: (v, r) => esc(isId ? r.domainId : v) },
        {
          key: 'name',
          label: isId ? 'Indikator' : 'Indicator',
          sortable: true,
          render: (v, row) =>
            `<button type="button" class="sort-btn" data-pick="${esc(row.code)}" style="color:#16425b;font-weight:700">${esc(isId ? row.nameId : v)}</button>`,
        },
        { key: 'latest', label: isId ? 'Terkini' : 'Latest', align: 'num', sortable: true, render: (v, row) => `${v} ${esc(row.unit)}` },
        { key: 'year', label: isId ? 'Periode' : 'Period', align: 'num', sortable: true },
        { key: 'source', label: isId ? 'Sumber Resmi' : 'Official Source', sortable: true },
      ],
      rows: filtered,
    });

    const expTake = isId
      ? `Utama ${primary.code} (${primary.source}, ${primary.year})${compareOn && secondary ? ` dibandingkan dengan ${secondary.code} (${sName}: ${secondary.latest} ${secondary.unit})` : ''}.`
      : `Primary ${primary.code} (${primary.source}, ${primary.year})${compareOn && secondary ? ` compared with ${secondary.code} (${sName}: ${secondary.latest} ${secondary.unit})` : ''}.`;

    root.innerHTML = `
      <div class="editorial-lead">
        <div>
          <span class="kicker">${esc(t.expKicker)}</span>
          <h1>${esc(t.expTitle)}</h1>
          <p>${esc(t.expSub)}</p>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <a class="btn btn-outline" href="#/methodology?tab=calendar">${esc(t.calendarLink)}</a>
          <button type="button" class="btn btn-outline" id="dl-exp-csv">CSV</button>
          <button type="button" class="btn btn-outline" id="dl-exp-json">JSON</button>
        </div>
      </div>

      <article class="panel" style="margin-bottom:9px">
        <div class="controls-bar" style="margin-bottom:6px">
          <input class="control-input" id="exp-search" type="search" value="${esc(query)}" placeholder="${isId ? 'Cari kata kunci, kode (ECO-01), inflasi, Papua, atau sumber…' : 'Search keyword, code (ECO-01), inflation, Papua, or source…'}" style="min-width:220px;flex:1">
          <div class="pill-group">${domainPills}</div>
        </div>
        <div class="controls-bar" style="margin-bottom:0">
          <label style="font-size:.78rem;font-weight:600;display:inline-flex;align-items:center;gap:5px">
            <input type="checkbox" id="toggle-compare" ${compareOn ? 'checked' : ''}> ${isId ? 'Bandingkan dengan:' : 'Compare with:'}
          </label>
          <select class="control-select" id="compare-select" aria-label="${isId ? 'Indikator pembanding' : 'Secondary indicator'}" ${compareOn ? '' : 'disabled'} style="max-width:420px;flex:1">
            ${compareOptions}
          </select>
        </div>
      </article>

      <article class="panel" style="margin-bottom:9px">
        <div class="panel-head">
          <div>
            <span class="code-tag">${esc(primary.code)} · ${esc(isId ? primary.domainId : primary.domain)}</span>
            <h2 class="panel-title" style="margin-top:4px">${esc(pName)}</h2>
            <p class="panel-sub">${isId ? 'Terkini' : 'Latest'}: <strong>${primary.latest} ${esc(primary.unit)}</strong> (${esc(primary.year)}) · ${isId ? 'Perubahan 2020–2025' : '2020–2025 change'}: ${Number(deltaPrimary) >= 0 ? '+' : ''}${deltaPrimary} ${esc(primary.unit)}</p>
          </div>
          <span class="code-tag">${esc(primary.source)} · ${esc(primary.year)}</span>
        </div>
        ${lineChartSvg({
          labels: primary.years,
          series: seriesList,
          unit: primary.unit === '%' && (!compareOn || secondary.unit === '%') ? '%' : '',
          height: 185,
        })}
        ${takeawayBox(expTake, t.keyTakeaway)}
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">${isId ? `Seri Cocok (${filtered.length} dari ${INDICATOR_CATALOG.length})` : `Matching Series (${filtered.length} of ${INDICATOR_CATALOG.length})`}</h3>
            <p class="panel-sub">${isId ? 'Klik judul indikator untuk memuat grafik di atas, atau klik tajuk kolom untuk mengurutkan.' : 'Click any indicator title to load it above, or click column headers to sort.'}</p>
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

export const render = renderExplorer;
