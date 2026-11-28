// Economy & Prices view: 4 symmetric KPIs, annotated chart + Personal CPI & UMP Calculator, COICOP & Trade bars, table

import { CPI_BASKET_2025, ECONOMY_SERIES, MACRO_ANNUAL_TABLE, TRADE_PARTNERS_2025 } from '../data/economy.js';
import { lineChartSvg } from '../components/line-chart.js';
import { horizontalBarsSvg } from '../components/bar-chart.js';
import { bindChartTooltips } from '../components/tooltip.js';
import { bindCpiCalculator, createCpiCalculatorState, renderCpiCalculator } from '../components/cpi-calculator.js';
import { downloadCsv } from '../components/export.js';
import { esc, fmtNum, kpiCard, renderTable, takeawayBox } from '../components/ui.js';

const ANNOTATIONS = {
  gdp: [
    { index: 1, seriesIdx: 2, label: '2020 trough -4.96%', labelId: 'Palung 2020 -4,96%', dx: 24, dy: -15 },
    { index: 6, seriesIdx: 0, label: '2025 GDP +5.11%', labelId: 'PDB 2025 +5,11%', dx: -24, dy: -16 },
  ],
  prices: [
    { index: 3, seriesIdx: 0, label: '2022 peak 5.51%', labelId: 'Puncak 2022 5,51%', dx: 0, dy: -15 },
    { index: 6, seriesIdx: 0, label: '2025 CPI 2.42%', labelId: 'IHK 2025 2,42%', dx: -24, dy: -15 },
  ],
  trade: [
    { index: 3, seriesIdx: 0, label: '2022 high $291.9B', labelId: 'Puncak 2022 $291,9M', dx: 0, dy: -14 },
    { index: 6, seriesIdx: 2, label: 'Surplus +$34.8B', labelId: 'Surplus +$34,8M', dx: -26, dy: -15 },
  ],
  fiscal: [
    { index: 1, seriesIdx: 0, label: 'Stimulus 16.8%', labelId: 'Stimulus 16,8%', dx: 20, dy: -14 },
    { index: 6, seriesIdx: 1, label: 'Deficit 2.30%', labelId: 'Defisit 2,30%', dx: -22, dy: 16 },
  ],
};

export function renderEconomy(root, { lang, t }) {
  let activeKey = 'gdp';
  let span = 'all';
  let sortKey = 'year';
  let sortDir = 'desc';
  const calcState = createCpiCalculatorState();

  function draw() {
    const isId = lang === 'id';
    document.title = isId ? 'Ekonomi & IHK · NusaStat' : 'Economy & Prices · NusaStat';
    const ds = ECONOMY_SERIES[activeKey];
    const sliceCount = span === '3y' ? 3 : span === '5y' ? 5 : ds.years.length;
    const startIdx = Math.max(0, ds.years.length - sliceCount);
    const years = ds.years.slice(startIdx);
    const series = ds.series.map((s) => ({ ...s, name: isId ? s.nameId : s.name, values: s.values.slice(startIdx) }));
    const chartNotes = (ANNOTATIONS[activeKey] || [])
      .filter((a) => a.index >= startIdx)
      .map((a) => ({ ...a, label: isId ? a.labelId : a.label, index: a.index - startIdx }));

    const sortedRows = [...MACRO_ANNUAL_TABLE].sort((a, b) =>
      sortDir === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey],
    );

    const econKpis = [
      kpiCard({ code: 'SNA-2025', label: isId ? 'PDB Nominal' : 'Nominal GDP', value: '$1.44T', delta: isId ? '+5,11% riil' : '+5.11% real', tone: 'good', source: isId ? 'BPS · Neraca' : 'BPS · SNA', year: '2025' }),
      kpiCard({ code: 'BI-RATE', label: isId ? 'Suku Bunga BI-Rate' : 'BI-Rate Benchmark', value: '5.50%', delta: '-50 bps YoY', tone: 'neutral', source: 'Bank Indonesia', year: isId ? 'Des 2025' : 'Dec 2025' }),
      kpiCard({ code: 'APBN-25', label: isId ? 'Defisit Fiskal' : 'Fiscal Deficit', value: '2.30%', delta: isId ? '< batas 3,0%' : '< 3.0% cap', tone: 'good', source: isId ? 'Kemenkeu APBN' : 'MoF APBN', year: isId ? 'TA 2025' : 'FY 2025' }),
      kpiCard({ code: 'TRD-25', label: isId ? 'Neraca Dagang' : 'Trade Balance', value: '+$34.8B', delta: isId ? 'Surplus 56 bln' : '56-mo surplus', tone: 'good', source: isId ? 'BPS · Bea Cukai' : 'BPS · Customs', year: isId ? 'TA 2025' : 'FY 2025' }),
    ].join('');

    const tableHtml = renderTable({
      tableId: 'econ-annual-table',
      sortKey,
      sortDir,
      columns: [
        { key: 'year', label: isId ? 'Tahun' : 'Year', sortable: true },
        { key: 'nominalUsdB', label: isId ? 'PDB ($M)' : 'GDP ($B)', align: 'num', sortable: true, render: (v) => fmtNum(v, 1) },
        { key: 'realGrowth', label: isId ? 'PDB Riil' : 'Real Growth', align: 'num', sortable: true, render: (v) => `${v >= 0 ? '+' : ''}${fmtNum(v, 2)}%` },
        { key: 'cpiPct', label: isId ? 'IHK YoY' : 'CPI YoY', align: 'num', sortable: true, render: (v) => `${fmtNum(v, 2)}%` },
        { key: 'exportsB', label: isId ? 'Ekspor ($M)' : 'Exports ($B)', align: 'num', sortable: true, render: (v) => fmtNum(v, 1) },
        { key: 'importsB', label: isId ? 'Impor ($M)' : 'Imports ($B)', align: 'num', sortable: true, render: (v) => fmtNum(v, 1) },
        { key: 'balanceB', label: isId ? 'Neraca ($M)' : 'Trade Bal. ($B)', align: 'num', sortable: true, render: (v) => `${v >= 0 ? '+' : ''}${fmtNum(v, 1)}` },
        { key: 'policyRate', label: 'BI-Rate', align: 'num', sortable: true, render: (v) => `${fmtNum(v, 2)}%` },
      ],
      rows: sortedRows,
    });

    const econTake = isId
      ? 'Konsumsi rumah tangga (+4,94%) dan investasi fisik (+4,72%) menopang pertumbuhan 2025 dengan surplus dagang +US$34,8M.'
      : 'Household consumption (+4.94%) and fixed capital (+4.72%) anchored 2025 growth while the trade surplus held +$34.8B.';

    root.innerHTML = `
      <div class="editorial-lead">
        <div>
          <span class="kicker">${esc(t.econKicker)}</span>
          <h1>${esc(t.econTitle)}</h1>
          <p>${esc(t.econSub)}</p>
        </div>
        <button class="btn btn-outline" id="export-econ-csv" type="button">${esc(t.downloadCsv)} (2019–2025)</button>
      </div>

      <section class="kpi-strip">${econKpis}</section>

      <section class="grid-atlas">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">${esc(isId ? ds.titleId : ds.title)}</h2>
              <p class="panel-sub">${esc(isId ? ds.subtitleId : ds.subtitle)}</p>
            </div>
            <span class="code-tag">${esc(isId ? ds.sourceId : ds.source)}</span>
          </div>

          <div class="controls-bar">
            <div class="pill-group" role="tablist" aria-label="${isId ? 'Pilihan indikator ekonomi' : 'Economic indicator view'}">
              <button type="button" class="pill-btn ${activeKey === 'gdp' ? 'active' : ''}" data-econ="gdp">${isId ? 'PDB &amp; Permintaan' : 'GDP &amp; Demand'}</button>
              <button type="button" class="pill-btn ${activeKey === 'prices' ? 'active' : ''}" data-econ="prices">${isId ? 'Inflasi IHK' : 'CPI Inflation'}</button>
              <button type="button" class="pill-btn ${activeKey === 'trade' ? 'active' : ''}" data-econ="trade">${isId ? 'Perdagangan' : 'Trade'}</button>
              <button type="button" class="pill-btn ${activeKey === 'fiscal' ? 'active' : ''}" data-econ="fiscal">${isId ? 'Fiskal APBN' : 'Fiscal'}</button>
            </div>
            <div class="pill-group" aria-label="${isId ? 'Rentang waktu' : 'Timeframe window'}">
              <button type="button" class="pill-btn ${span === '3y' ? 'active' : ''}" data-span="3y">${isId ? '3 Thn' : '3Y'}</button>
              <button type="button" class="pill-btn ${span === '5y' ? 'active' : ''}" data-span="5y">${isId ? '5 Thn' : '5Y'}</button>
              <button type="button" class="pill-btn ${span === 'all' ? 'active' : ''}" data-span="all">2019–2025</button>
            </div>
          </div>

          ${lineChartSvg({ labels: years, series, unit: ds.unit, height: 185, annotations: chartNotes })}
          ${takeawayBox(econTake, t.keyTakeaway)}
        </article>

        ${renderCpiCalculator(calcState, lang)}
      </section>

      <section class="grid-2">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">${isId ? 'Inflasi IHK Menurut Kelompok COICOP (2025)' : 'CPI Inflation by COICOP Group (2025)'}</h3>
              <p class="panel-sub">${isId ? 'Perubahan harga tahunan (%) dan bobot keranjang' : 'Annual price change (%) and basket weight'}</p>
            </div>
            <span class="code-tag">BPS · COICOP 2025</span>
          </div>
          ${horizontalBarsSvg({ items: CPI_BASKET_2025.map((x) => ({ ...x, label: isId ? x.labelId : x.label, sub: isId ? x.subId : x.sub })), valueSuffix: '%', maxVal: 5 })}
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">${isId ? 'Mitra Utama Ekspor Nonmigas (2025)' : 'Top Non-Oil &amp; Gas Export Partners (2025)'}</h3>
              <p class="panel-sub">${isId ? 'Pangsa dari total ekspor barang US$276,4 miliar' : 'Share of $276.4B merchandise exports'}</p>
            </div>
            <span class="code-tag">${isId ? 'BPS · Kepabeanan 2025' : 'BPS · Customs 2025'}</span>
          </div>
          ${horizontalBarsSvg({ items: TRADE_PARTNERS_2025.map((x) => ({ ...x, label: isId ? x.labelId : x.label })), valueSuffix: '%', maxVal: 28 })}
        </article>
      </section>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">${isId ? 'Seri Waktu Makroekonomi Tahunan (2019–2025)' : 'Annual Macroeconomic Time Series (2019–2025)'}</h3>
            <p class="panel-sub">${isId ? 'Klik judul kolom untuk mengurutkan · Sumber: BPS, Bank Indonesia &amp; Kemenkeu' : 'Click headers to sort · Sources: BPS National Accounts, Bank Indonesia &amp; MoF'}</p>
          </div>
        </div>
        ${tableHtml}
      </article>
    `;

    bindChartTooltips(root);
    bindCpiCalculator(root, calcState, draw);

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

export const render = renderEconomy;
