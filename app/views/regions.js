// Regional Atlas & Provincial Comparison view

import { MACRO_REGIONS, PROVINCES } from '../data/regions.js';
import { bindChartTooltips } from '../components/charts.js';
import { downloadCsv, esc, fmtNum, renderTable } from '../components/ui.js';

export function renderRegions(root) {
  let selectedRegion = 'all';
  let activeMapId = 'java';
  let sortKey = 'grdpPerCapitaUsd';
  let sortDir = 'desc';
  let provA = 'ID-JK';
  let provB = 'ID-KI';

  function archipelagoMapSvg() {
    const nodes = MACRO_REGIONS.map((reg) => {
      const { x, y, w, h } = reg.box;
      const isSelected = activeMapId === reg.id;
      const fill =
        reg.growth >= 6.0 ? '#0f4c81' : reg.growth >= 5.2 ? '#2563eb' : '#3b82f6';
      return `<g class="map-region-node ${isSelected ? 'selected' : ''}" tabindex="0" role="button" aria-label="Select ${esc(reg.name)} region" data-map-region="${esc(reg.id)}" data-tip="${esc(reg.name)}: ${reg.gdpShare}% GDP share · +${reg.growth}% growth">
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" opacity="${isSelected ? '0.96' : '0.78'}" stroke="#ffffff" stroke-width="1.5" />
        <text x="${x + 10}" y="${y + 22}" font-size="11.5" font-weight="700" fill="#ffffff">${esc(reg.name)}</text>
        <text x="${x + 10}" y="${y + 38}" font-size="10.5" fill="#dbeafe">${reg.gdpShare}% GDP · +${reg.growth}%</text>
      </g>`;
    }).join('');

    return `<div class="chart-wrap">
      <div class="chart-tooltip"></div>
      <svg class="chart-svg" viewBox="0 0 645 228" role="img" aria-label="Interactive Archipelago Macro-Region Map">
        <rect x="0" y="0" width="645" height="228" rx="10" fill="#eef4fa" />
        <path d="M10 148 Q160 135 310 152 T635 144" fill="none" stroke="#cbd5e1" stroke-dasharray="4 4" />
        ${nodes}
      </svg>
    </div>`;
  }

  function draw() {
    const activeReg = MACRO_REGIONS.find((r) => r.id === activeMapId) || MACRO_REGIONS[0];
    const visibleProvs = PROVINCES.filter((p) => selectedRegion === 'all' || p.region === selectedRegion).sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === 'asc' ? va - vb : vb - va;
    });

    const p1 = PROVINCES.find((p) => p.code === provA) || PROVINCES[0];
    const p2 = PROVINCES.find((p) => p.code === provB) || PROVINCES[9];

    const provOptions = (currentCode) =>
      PROVINCES.map(
        (p) => `<option value="${esc(p.code)}" ${p.code === currentCode ? 'selected' : ''}>${esc(p.name)}</option>`,
      ).join('');

    const tableHtml = renderTable({
      tableId: 'province-table',
      sortKey,
      sortDir,
      columns: [
        { key: 'name', label: 'Province', sortable: true },
        { key: 'region', label: 'Macro-Region', sortable: true, render: (v) => esc(MACRO_REGIONS.find((r) => r.id === v)?.name || v) },
        { key: 'popM', label: 'Pop. (M)', align: 'num', sortable: true, render: (v) => fmtNum(v, 1) },
        { key: 'grdpPerCapitaUsd', label: 'GRDP / Cap ($)', align: 'num', sortable: true, render: (v) => `$${v.toLocaleString('en-US')}` },
        { key: 'growth', label: 'Growth', align: 'num', sortable: true, render: (v) => `+${fmtNum(v, 2)}%` },
        { key: 'poverty', label: 'Poverty', align: 'num', sortable: true, render: (v) => `${fmtNum(v, 2)}%` },
        { key: 'unemployment', label: 'Unemp.', align: 'num', sortable: true, render: (v) => `${fmtNum(v, 2)}%` },
        { key: 'hdi', label: 'HDI', align: 'num', sortable: true, render: (v) => fmtNum(v, 2) },
      ],
      rows: visibleProvs,
    });

    root.innerHTML = `
      <div class="section-head" style="margin-top:0">
        <div>
          <h1>Regional Atlas &amp; Provincial Benchmarks</h1>
          <p>Click any archipelago macro-region to inspect economic structure, compare provinces side by side, or filter the table.</p>
        </div>
        <button class="btn btn-outline" id="export-reg-csv" type="button">Download Provincial CSV</button>
      </div>

      <section class="grid-sidebar" style="margin-bottom:18px">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Archipelago Macro-Region Cartogram</h2>
              <p class="panel-sub">Click a region block to inspect its 2025 output, demographics, and growth drivers</p>
            </div>
            <span class="citation-tag">Regional Accounts · 2025</span>
          </div>
          ${archipelagoMapSvg()}
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">${esc(activeReg.name)} Region Profile</h3>
              <p class="panel-sub">${activeReg.provincesCount} provinces · Reference year 2025</p>
            </div>
            <button type="button" class="btn btn-outline" id="filter-to-active">Filter Table</button>
          </div>
          <div class="compare-box">
            <div class="compare-metric"><span>Share of National GDP</span><strong>${fmtNum(activeReg.gdpShare, 1)}%</strong></div>
            <div class="compare-metric"><span>Resident Population</span><strong>${fmtNum(activeReg.popM, 1)}M</strong></div>
            <div class="compare-metric"><span>Real GRDP Growth</span><strong>+${fmtNum(activeReg.growth, 2)}%</strong></div>
            <div class="compare-metric"><span>Human Dev. Index (Avg)</span><strong>${fmtNum(activeReg.hdi, 1)}</strong></div>
            <div class="compare-metric"><span>Poverty Rate</span><strong>${fmtNum(activeReg.poverty, 1)}%</strong></div>
          </div>
          <p class="panel-sub" style="margin-top:10px"><strong>Key drivers:</strong> ${esc(activeReg.leadDriver)}</p>
        </article>
      </section>

      <article class="panel" style="margin-bottom:18px">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Side-by-Side Province Comparison</h3>
            <p class="panel-sub">Compare economic output, living standards, and labor indicators across two provinces</p>
          </div>
          <span class="citation-tag">SUSENAS &amp; Regional SNA · 2025</span>
        </div>
        <div class="controls-bar">
          <label>Province A:
            <select class="control-select" id="prov-a">${provOptions(p1.code)}</select>
          </label>
          <label>Province B:
            <select class="control-select" id="prov-b">${provOptions(p2.code)}</select>
          </label>
        </div>
        <div class="compare-grid">
          <div class="compare-box">
            <strong style="display:block;margin-bottom:6px">${esc(p1.name)} (${esc(p1.code)})</strong>
            <div class="compare-metric"><span>Population</span><strong>${fmtNum(p1.popM, 1)}M</strong></div>
            <div class="compare-metric"><span>GRDP per Capita</span><strong>$${p1.grdpPerCapitaUsd.toLocaleString('en-US')}</strong></div>
            <div class="compare-metric"><span>Real Growth (2025)</span><strong>+${fmtNum(p1.growth, 2)}%</strong></div>
            <div class="compare-metric"><span>Poverty Rate</span><strong>${fmtNum(p1.poverty, 2)}%</strong></div>
            <div class="compare-metric"><span>Human Dev. Index</span><strong>${fmtNum(p1.hdi, 2)}</strong></div>
          </div>
          <div class="compare-box">
            <strong style="display:block;margin-bottom:6px">${esc(p2.name)} (${esc(p2.code)})</strong>
            <div class="compare-metric"><span>Population</span><strong>${fmtNum(p2.popM, 1)}M</strong></div>
            <div class="compare-metric"><span>GRDP per Capita</span><strong>$${p2.grdpPerCapitaUsd.toLocaleString('en-US')}</strong></div>
            <div class="compare-metric"><span>Real Growth (2025)</span><strong>+${fmtNum(p2.growth, 2)}%</strong></div>
            <div class="compare-metric"><span>Poverty Rate</span><strong>${fmtNum(p2.poverty, 2)}%</strong></div>
            <div class="compare-metric"><span>Human Dev. Index</span><strong>${fmtNum(p2.hdi, 2)}</strong></div>
          </div>
        </div>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Provincial Indicators Registry (${visibleProvs.length} shown)</h3>
            <p class="panel-sub">Filter by macro-region or sort by any column</p>
          </div>
        </div>
        <div class="controls-bar">
          <div class="pill-group">
            <button type="button" class="pill-btn ${selectedRegion === 'all' ? 'active' : ''}" data-reg="all">All Regions</button>
            ${MACRO_REGIONS.map(
              (r) => `<button type="button" class="pill-btn ${selectedRegion === r.id ? 'active' : ''}" data-reg="${esc(r.id)}">${esc(r.name)}</button>`,
            ).join('')}
          </div>
        </div>
        ${tableHtml}
      </article>
    `;

    bindChartTooltips(root);

    root.querySelectorAll('[data-map-region]').forEach((node) => {
      const selectNode = () => {
        activeMapId = node.dataset.mapRegion;
        draw();
      };
      node.addEventListener('click', selectNode);
      node.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          selectNode();
        }
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
        'indonesia-provinces-2025.csv',
        ['Code', 'Province', 'Macro_Region', 'Population_M', 'GRDP_Per_Capita_USD', 'Real_Growth_Pct', 'Poverty_Pct', 'Unemployment_Pct', 'HDI'],
        visibleProvs.map((p) => [p.code, p.name, p.region, p.popM, p.grdpPerCapitaUsd, p.growth, p.poverty, p.unemployment, p.hdi]),
      );
    });
  }

  draw();
}
