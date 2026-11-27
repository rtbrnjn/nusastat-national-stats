// 38-Province Regional Atlas: interactive archipelago choropleth, mini-bar province comparator, full 38-row table

import { MACRO_REGIONS, PROVINCES_38 } from '../data/regions.js';
import { compareMiniBar } from '../components/bar-chart.js';
import { bindChartTooltips } from '../components/tooltip.js';
import { renderArchipelagoMap } from '../components/map-svg.js';
import { downloadCsv } from '../components/export.js';
import { esc, fmtNum, renderTable, takeawayBox } from '../components/ui.js';

const MAP_METRICS = {
  grdpPerCapitaUsd: { label: 'GRDP / Capita ($)', format: (v) => `$${Math.round(v).toLocaleString('en-US')}`, invert: false },
  growth: { label: 'Real Growth (%)', format: (v) => `+${fmtNum(v, 2)}%`, invert: false },
  hdi: { label: 'HDI Score', format: (v) => fmtNum(v, 2), invert: false },
  poverty: { label: 'Poverty Rate (%)', format: (v) => `${fmtNum(v, 2)}%`, invert: true },
  popM: { label: 'Population (M)', format: (v) => `${fmtNum(v, 1)}M`, invert: false },
};

export function renderRegions(root, { lang, t }) {
  let selectedRegion = 'all';
  let activeMapId = 'java';
  let metricKey = 'grdpPerCapitaUsd';
  let sortKey = 'grdpPerCapitaUsd';
  let sortDir = 'desc';
  let provA = 'ID-JK';
  let provB = 'ID-KI';

  function draw() {
    document.title = lang === 'id' ? 'Atlas 38 Provinsi · NusaStat' : '38-Province Regional Atlas · NusaStat';
    const metric = MAP_METRICS[metricKey];
    const activeReg = MACRO_REGIONS.find((r) => r.id === activeMapId) || MACRO_REGIONS[0];
    const visibleProvs = PROVINCES_38.filter((p) => selectedRegion === 'all' || p.region === selectedRegion).sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    });

    const p1 = PROVINCES_38.find((p) => p.code === provA) || PROVINCES_38[10];
    const p2 = PROVINCES_38.find((p) => p.code === provB) || PROVINCES_38[19];

    const provOptions = (currentCode) =>
      PROVINCES_38.map(
        (p) => `<option value="${esc(p.code)}" ${p.code === currentCode ? 'selected' : ''}>${esc(p.name)}</option>`,
      ).join('');

    const metricPills = Object.entries(MAP_METRICS)
      .map(
        ([k, m]) =>
          `<button type="button" class="pill-btn ${metricKey === k ? 'active' : ''}" data-metric="${esc(k)}">${esc(m.label)}</button>`,
      )
      .join('');

    const tableHtml = renderTable({
      tableId: 'province-table',
      sortKey,
      sortDir,
      columns: [
        { key: 'name', label: lang === 'id' ? 'Provinsi (38)' : 'Province (38)', sortable: true },
        { key: 'region', label: lang === 'id' ? 'Wilayah' : 'Region', sortable: true, render: (v) => esc(MACRO_REGIONS.find((r) => r.id === v)?.name || v) },
        { key: 'popM', label: 'Pop. (M)', align: 'num', sortable: true, render: (v) => fmtNum(v, 2) },
        { key: 'grdpPerCapitaUsd', label: 'GRDP / Cap', align: 'num', sortable: true, render: (v) => `$${v.toLocaleString('en-US')}` },
        { key: 'growth', label: 'Growth', align: 'num', sortable: true, render: (v) => `+${fmtNum(v, 2)}%` },
        { key: 'poverty', label: 'Poverty', align: 'num', sortable: true, render: (v) => `${fmtNum(v, 2)}%` },
        { key: 'unemployment', label: 'Unemp.', align: 'num', sortable: true, render: (v) => `${fmtNum(v, 2)}%` },
        { key: 'hdi', label: 'HDI', align: 'num', sortable: true, render: (v) => fmtNum(v, 2) },
      ],
      rows: visibleProvs,
    });

    root.innerHTML = `
      <div class="editorial-lead">
        <div>
          <span class="kicker">${esc(t.regKicker)}</span>
          <h1>${esc(t.regTitle)}</h1>
          <p>${esc(t.regSub)}</p>
        </div>
        <button class="btn btn-outline" id="export-reg-csv" type="button">${esc(t.downloadCsv)} (38 Prov.)</button>
      </div>

      <section class="grid-atlas" style="margin-bottom:14px">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Indonesia Choropleth · ${esc(metric.label)}</h2>
              <p class="panel-sub">Detailed island silhouettes &amp; 38 provincial pins · BPS Regional SNA 2025</p>
            </div>
            <span class="code-tag">BPS · SNA 2025</span>
          </div>
          <div class="controls-bar">
            <div class="pill-group">${metricPills}</div>
          </div>
          ${renderArchipelagoMap({
            macroRegions: MACRO_REGIONS,
            provinces: PROVINCES_38,
            metricKey,
            metricLabel: metric.label,
            metricFormat: metric.format,
            invertScale: metric.invert,
            activeRegionId: activeMapId,
            activeProvCode: provA,
          })}
          ${takeawayBox('Java generates 57.1% of national GDP, while mineral-downstreaming provinces in Sulawesi (+6.12%) and Maluku-Papua (+6.45%) lead growth.', t.keyTakeaway)}
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">${esc(activeReg.name)} · ${activeReg.provincesCount} Provinces</h3>
              <p class="panel-sub">Macro-region benchmark · ${esc(activeReg.leadDriver)}</p>
            </div>
            <button type="button" class="btn btn-outline" id="filter-to-active">Filter Table</button>
          </div>
          <div class="compare-box" style="margin-bottom:7px">
            <div class="compare-metric"><span>GDP Share / Population</span><strong>${fmtNum(activeReg.gdpShare, 1)}% · ${fmtNum(activeReg.popM, 1)}M</strong></div>
            <div class="compare-metric"><span>Mean GRDP/Cap · Growth</span><strong>$${activeReg.grdpPerCapitaUsd.toLocaleString('en-US')} · +${fmtNum(activeReg.growth, 2)}%</strong></div>
            <div class="compare-metric"><span>HDI Average · Poverty</span><strong>${fmtNum(activeReg.hdi, 1)} · ${fmtNum(activeReg.poverty, 1)}%</strong></div>
          </div>

          <h4 class="panel-title" style="font-size:.88rem;margin-bottom:5px">Compare Any Two Provinces</h4>
          <div class="controls-bar" style="margin-bottom:5px">
            <select class="control-select" id="prov-a" aria-label="Province A" style="flex:1">${provOptions(p1.code)}</select>
            <select class="control-select" id="prov-b" aria-label="Province B" style="flex:1">${provOptions(p2.code)}</select>
          </div>
          <div class="compare-box">
            ${compareMiniBar('GRDP / Capita', p1.grdpPerCapitaUsd, p2.grdpPerCapitaUsd, 22000, (v) => `$${v.toLocaleString('en-US')}`)}
            ${compareMiniBar('HDI Score', p1.hdi, p2.hdi, 90, (v) => fmtNum(v, 2))}
            ${compareMiniBar('Poverty Rate', p1.poverty, p2.poverty, 32, (v) => `${fmtNum(v, 2)}%`)}
            ${compareMiniBar('Real Growth', p1.growth, p2.growth, 14, (v) => `+${fmtNum(v, 2)}%`)}
          </div>
        </article>
      </section>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">All 38 Indonesian Provinces (${visibleProvs.length} shown)</h3>
            <p class="panel-sub">Filter by island group or sort columns · Sources: BPS Regional SNA, SAKERNAS &amp; SUSENAS 2025</p>
          </div>
          <div class="pill-group">
            <button type="button" class="pill-btn ${selectedRegion === 'all' ? 'active' : ''}" data-reg="all">All 38</button>
            ${MACRO_REGIONS.map(
              (r) => `<button type="button" class="pill-btn ${selectedRegion === r.id ? 'active' : ''}" data-reg="${esc(r.id)}">${esc(r.name)}</button>`,
            ).join('')}
          </div>
        </div>
        ${tableHtml}
      </article>
    `;

    bindChartTooltips(root);

    root.querySelectorAll('[data-metric]').forEach((btn) => {
      btn.addEventListener('click', () => {
        metricKey = btn.dataset.metric;
        draw();
      });
    });

    root.querySelectorAll('[data-map-region]').forEach((node) => {
      const pick = () => {
        activeMapId = node.dataset.mapRegion;
        draw();
      };
      node.addEventListener('click', pick);
      node.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          pick();
        }
      });
    });

    root.querySelectorAll('[data-prov-pin]').forEach((pin) => {
      pin.addEventListener('click', (ev) => {
        ev.stopPropagation();
        provA = pin.dataset.provPin;
        const found = PROVINCES_38.find((p) => p.code === provA);
        if (found) activeMapId = found.region;
        draw();
      });
    });

    root.querySelector('#filter-to-active')?.addEventListener('click', () => {
      selectedRegion = activeReg.id;
      draw();
    });

    root.querySelector('#prov-a')?.addEventListener('change', (ev) => {
      provA = ev.target.value;
      draw();
    });

    root.querySelector('#prov-b')?.addEventListener('change', (ev) => {
      provB = ev.target.value;
      draw();
    });

    root.querySelectorAll('[data-reg]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedRegion = btn.dataset.reg;
        draw();
      });
    });

    root.querySelectorAll('#province-table .sort-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextKey = btn.dataset.sort;
        if (sortKey === nextKey) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else {
          sortKey = nextKey;
          sortDir = 'desc';
        }
        draw();
      });
    });

    root.querySelector('#export-reg-csv')?.addEventListener('click', () => {
      downloadCsv(
        'indonesia-38-provinces-2025.csv',
        ['Code', 'Province', 'Macro_Region', 'Population_M', 'GRDP_Per_Capita_USD', 'Real_Growth_Pct', 'Poverty_Pct', 'Unemployment_Pct', 'HDI'],
        visibleProvs.map((p) => [p.code, p.name, p.region, p.popM, p.grdpPerCapitaUsd, p.growth, p.poverty, p.unemployment, p.hdi]),
      );
    });
  }

  draw();
}
