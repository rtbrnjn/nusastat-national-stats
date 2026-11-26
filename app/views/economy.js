// Economy & Prices view: interactive domain switcher, timeframe filter, CPI basket, trade partners, sortable table & CSV export

import { CPI_BASKET_2025, ECONOMY_SERIES, MACRO_ANNUAL_TABLE, TRADE_PARTNERS_2025 } from '../data/economy.js';
import { bindChartTooltips, horizontalBarsSvg, lineChartSvg } from '../components/charts.js';
import { downloadCsv, esc, fmtNum, kpiCard, renderTable } from '../components/ui.js';

export function renderEconomy(root) {
  let activeKey = 'gdp';
  let span = 'all';
  let sortKey = 'year';
  let sortDir = 'desc';

  function draw() {
    const ds = ECONOMY_SERIES[activeKey];
    const sliceCount = span === '3y' ? 3 : span === '5y' ? 5 : ds.years.length;
    const startIdx = Math.max(0, ds.years.length - sliceCount);
    const years = ds.years.slice(startIdx);
    const series = ds.series.map((s) => ({ ...s, values: s.values.slice(startIdx) }));

    const sortedRows = [...MACRO_ANNUAL_TABLE].sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return sortDir === 'asc' ? diff : -diff;
    });

    const econKpis = [
      kpiCard({
        code: 'SNA-2025',
        label: 'Nominal GDP (FY 2025)',
        value: '$1.44T',
        delta: '+5.11% real',
        tone: 'good',
        source: 'System of National Accounts',
        year: '2025',
      }),
      kpiCard({
        code: 'MON-2025',
        label: 'Central Bank Policy Rate',
        value: '5.50%',
        delta: '-50 bps vs 2024',
        tone: 'neutral',
        source: 'Monetary Policy Board',
        year: 'Dec 2025',
      }),
      kpiCard({
        code: 'FIS-2025',
        label: 'Fiscal Deficit / GDP',
        value: '2.30%',
        delta: 'Below 3.0% ceiling',
        tone: 'good',
        source: 'Ministry of Finance APBN',
        year: '2025',
      }),
    ].join('');

    const tableHtml = renderTable({
      tableId: 'econ-annual-table',
      sortKey,
      sortDir,
      columns: [
        { key: 'year', label: 'Year', sortable: true },
        { key: 'nominalUsdB', label: 'GDP ($B)', align: 'num', sortable: true, render: (v) => fmtNum(v, 1) },
        { key: 'realGrowth', label: 'Real Growth', align: 'num', sortable: true, render: (v) => `${v >= 0 ? '+' : ''}${fmtNum(v, 2)}%` },
        { key: 'cpiPct', label: 'CPI YoY', align: 'num', sortable: true, render: (v) => `${fmtNum(v, 2)}%` },
        { key: 'exportsB', label: 'Exports ($B)', align: 'num', sortable: true, render: (v) => fmtNum(v, 1) },
        { key: 'importsB', label: 'Imports ($B)', align: 'num', sortable: true, render: (v) => fmtNum(v, 1) },
        { key: 'balanceB', label: 'Trade Bal. ($B)', align: 'num', sortable: true, render: (v) => `${v >= 0 ? '+' : ''}${fmtNum(v, 1)}` },
        { key: 'policyRate', label: 'Policy Rate', align: 'num', sortable: true, render: (v) => `${fmtNum(v, 2)}%` },
      ],
      rows: sortedRows,
    });

    root.innerHTML = `
      <div class="section-head" style="margin-top:0">
        <div>
          <h1>Macroeconomy, Prices &amp; External Trade</h1>
          <p>Constant-price output, 90-city CPI inflation components, external balance, and fiscal discipline (2019–2025).</p>
        </div>
        <button class="btn btn-outline" id="export-econ-csv" type="button">Download CSV (2019–2025)</button>
      </div>

      <section class="kpi-grid" style="margin-bottom:18px">${econKpis}</section>

      <article class="panel" style="margin-bottom:18px">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">${esc(ds.title)}</h2>
            <p class="panel-sub">${esc(ds.subtitle)}</p>
          </div>
          <span class="citation-tag">${esc(ds.source)}</span>
        </div>

        <div class="controls-bar">
          <div class="pill-group" role="tablist" aria-label="Economic indicator view">
            <button type="button" class="pill-btn ${activeKey === 'gdp' ? 'active' : ''}" data-econ="gdp">GDP &amp; Demand</button>
            <button type="button" class="pill-btn ${activeKey === 'prices' ? 'active' : ''}" data-econ="prices">CPI Inflation</button>
            <button type="button" class="pill-btn ${activeKey === 'trade' ? 'active' : ''}" data-econ="trade">Merchandise Trade</button>
            <button type="button" class="pill-btn ${activeKey === 'fiscal' ? 'active' : ''}" data-econ="fiscal">Fiscal Accounts</button>
          </div>
          <div class="pill-group" aria-label="Timeframe window">
            <button type="button" class="pill-btn ${span === '3y' ? 'active' : ''}" data-span="3y">3Y</button>
            <button type="button" class="pill-btn ${span === '5y' ? 'active' : ''}" data-span="5y">5Y</button>
            <button type="button" class="pill-btn ${span === 'all' ? 'active' : ''}" data-span="all">2019–2025</button>
          </div>
        </div>

        ${lineChartSvg({ labels: years, series, unit: ds.unit, height: 175 })}
      </article>

      <section class="grid-2" style="margin-bottom:18px">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">CPI Basket Inflation by COICOP Group (2025)</h3>
              <p class="panel-sub">Annual price change (%) and expenditure weight</p>
            </div>
            <span class="citation-tag">COICOP 2018 · 2025</span>
          </div>
          ${horizontalBarsSvg({ items: CPI_BASKET_2025, valueSuffix: '%', maxVal: 5 })}
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Top Non-Oil &amp; Gas Export Destinations</h3>
              <p class="panel-sub">Share of FY 2025 merchandise exports ($276.4B total)</p>
            </div>
            <span class="citation-tag">Customs Registry · 2025</span>
          </div>
          ${horizontalBarsSvg({ items: TRADE_PARTNERS_2025, valueSuffix: '%', maxVal: 28 })}
        </article>
      </section>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Annual Macroeconomic Reference Table</h3>
            <p class="panel-sub">Click column headers to sort across years 2019–2025.</p>
          </div>
          <span class="citation-tag">SNA &amp; Central Bank · 2025</span>
        </div>
        ${tableHtml}
      </article>
    `;

    bindChartTooltips(root);

    root.querySelectorAll('[data-econ]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeKey = btn.dataset.econ;
        draw();
      });
    });
    root.querySelectorAll('[data-span]').forEach((btn) => {
      btn.addEventListener('click', () => {
        span = btn.dataset.span;
        draw();
      });
    });
    root.querySelectorAll('#econ-annual-table .sort-btn').forEach((btn) => {
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
    root.querySelector('#export-econ-csv')?.addEventListener('click', () => {
      downloadCsv(
        'indonesia-macro-2019-2025.csv',
        ['Year', 'Nominal_GDP_USD_B', 'Real_GDP_Growth_Pct', 'CPI_YoY_Pct', 'Exports_USD_B', 'Imports_USD_B', 'Trade_Balance_USD_B', 'Policy_Rate_Pct'],
        sortedRows.map((r) => [r.year, r.nominalUsdB, r.realGrowth, r.cpiPct, r.exportsB, r.importsB, r.balanceB, r.policyRate]),
      );
    });
  }

  draw();
}
