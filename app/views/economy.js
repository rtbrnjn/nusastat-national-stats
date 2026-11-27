// Economy & Prices view: interactive series switcher, annotated trend chart, CPI basket, trade partners, sortable table & CSV

import { CPI_BASKET_2025, ECONOMY_SERIES, MACRO_ANNUAL_TABLE, TRADE_PARTNERS_2025 } from '../data/economy.js';
import { bindChartTooltips, horizontalBarsSvg, lineChartSvg } from '../components/charts.js';
import { downloadCsv, esc, fmtNum, kpiCard, renderTable, takeawayBox } from '../components/ui.js';

const ANNOTATIONS = {
  gdp: [
    { index: 1, seriesIdx: 2, label: '2020 trough -4.96%', dx: 24, dy: -16 },
    { index: 6, seriesIdx: 0, label: '2025 GDP +5.11%', dx: -24, dy: -18 },
  ],
  prices: [
    { index: 3, seriesIdx: 0, label: '2022 peak 5.51%', dx: 0, dy: -16 },
    { index: 6, seriesIdx: 0, label: '2025 CPI 2.42%', dx: -24, dy: -16 },
  ],
  trade: [
    { index: 3, seriesIdx: 0, label: '2022 high $291.9B', dx: 0, dy: -14 },
    { index: 6, seriesIdx: 2, label: 'Surplus +$34.8B', dx: -28, dy: -16 },
  ],
  fiscal: [
    { index: 1, seriesIdx: 0, label: 'COVID stimulus 16.8%', dx: 20, dy: -14 },
    { index: 6, seriesIdx: 1, label: 'Deficit 2.30%', dx: -22, dy: 18 },
  ],
};

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
    const chartNotes = (ANNOTATIONS[activeKey] || [])
      .filter((a) => a.index >= startIdx)
      .map((a) => ({ ...a, index: a.index - startIdx }));

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
        source: 'BPS · National Accounts',
        year: '2025',
      }),
      kpiCard({
        code: 'BI-RATE',
        label: 'BI-Rate Policy Benchmark',
        value: '5.50%',
        delta: '-50 bps vs 2024',
        tone: 'neutral',
        source: 'Bank Indonesia',
        year: 'Dec 2025',
      }),
      kpiCard({
        code: 'APBN-2025',
        label: 'Fiscal Deficit / GDP',
        value: '2.30%',
        delta: 'Below 3.0% ceiling',
        tone: 'good',
        source: 'Ministry of Finance',
        year: 'FY 2025',
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
        { key: 'policyRate', label: 'BI-Rate', align: 'num', sortable: true, render: (v) => `${fmtNum(v, 2)}%` },
      ],
      rows: sortedRows,
    });

    root.innerHTML = `
      <div class="editorial-lead">
        <div>
          <span class="kicker">Macroeconomy, Prices &amp; External Accounts · 2019–2025</span>
          <h1>National Accounts, CPI Basket &amp; Merchandise Trade</h1>
          <p>Constant-price expenditure growth, 90-city COICOP consumer inflation, external surplus, and APBN fiscal ratios.</p>
        </div>
        <button class="btn btn-outline" id="export-econ-csv" type="button">Download CSV (2019–2025)</button>
      </div>

      <section class="kpi-grid-3">${econKpis}</section>

      <article class="panel" style="margin-bottom:12px">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">${esc(ds.title)}</h2>
            <p class="panel-sub">${esc(ds.subtitle)}</p>
          </div>
          <span class="code-tag">${esc(ds.source)}</span>
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

        ${lineChartSvg({ labels: years, series, unit: ds.unit, height: 150, annotations: chartNotes })}
        ${takeawayBox('Domestic consumption (+4.94%) and fixed capital formation (+4.72%) anchored 2025 expansion while fiscal deficit remained well below the 3.0% statutory cap.')}
      </article>

      <section class="grid-2">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">CPI Inflation by COICOP Group (2025)</h3>
              <p class="panel-sub">Annual price change (%) and basket weight</p>
            </div>
            <span class="code-tag">BPS · COICOP 2025</span>
          </div>
          ${horizontalBarsSvg({ items: CPI_BASKET_2025, valueSuffix: '%', maxVal: 5 })}
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Top Non-Oil &amp; Gas Export Partners (2025)</h3>
              <p class="panel-sub">Share of $276.4B merchandise exports</p>
            </div>
            <span class="code-tag">BPS · Customs 2025</span>
          </div>
          ${horizontalBarsSvg({ items: TRADE_PARTNERS_2025, valueSuffix: '%', maxVal: 28 })}
        </article>
      </section>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Annual Macroeconomic Time Series (2019–2025)</h3>
            <p class="panel-sub">Click any column header to sort · Sources: BPS National Accounts, Bank Indonesia, Ministry of Finance</p>
          </div>
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
        ['Year', 'Nominal_GDP_USD_B', 'Real_GDP_Growth_Pct', 'CPI_YoY_Pct', 'Exports_USD_B', 'Imports_USD_B', 'Trade_Balance_USD_B', 'BI_Rate_Pct'],
        sortedRows.map((r) => [r.year, r.nominalUsdB, r.realGrowth, r.cpiPct, r.exportsB, r.importsB, r.balanceB, r.policyRate]),
      );
    });
  }

  draw();
}
