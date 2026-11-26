// Overview landing page: national headline KPIs, macro trend chart, sectoral GDP, regional summary, latest releases

import { NATIONAL_KPIS, QUARTERLY_MACRO, SECTOR_GDP_SHARE, MACRO_REGION_SUMMARY, LATEST_RELEASES } from '../data/overview.js';
import { bindChartTooltips, horizontalBarsSvg, lineChartSvg, sparklineSvg } from '../components/charts.js';
import { esc, fmtNum, kpiCard, renderTable } from '../components/ui.js';

export function renderHome(root) {
  const kpisHtml = NATIONAL_KPIS.map((item) => {
    const stroke = item.tone === 'signal' ? '#c2410c' : item.tone === 'good' ? '#047857' : '#0f4c81';
    return kpiCard(item, sparklineSvg(item.spark, stroke));
  }).join('');

  const macroChart = lineChartSvg({
    labels: QUARTERLY_MACRO.map((d) => d.period),
    series: [
      { name: 'Real GDP Growth (YoY)', values: QUARTERLY_MACRO.map((d) => d.gdpGrowth), color: '#0f4c81', area: true },
      { name: 'CPI Inflation (YoY)', values: QUARTERLY_MACRO.map((d) => d.cpi), color: '#c2410c', area: false },
    ],
    unit: '%',
    height: 235,
  });

  const sectorChart = horizontalBarsSvg({
    items: SECTOR_GDP_SHARE.map((s) => ({
      label: s.label,
      value: s.share,
      color: s.color,
      sub: `+${s.growth}% YoY`,
    })),
    valueSuffix: '%',
    maxVal: 30,
  });

  const regionTable = renderTable({
    columns: [
      { key: 'name', label: 'Macro-Region' },
      { key: 'shareGdp', label: 'GDP Share', align: 'num', render: (v) => `${fmtNum(v, 1)}%` },
      { key: 'popMillions', label: 'Pop. (M)', align: 'num', render: (v) => fmtNum(v, 1) },
      { key: 'growth', label: 'Growth', align: 'num', render: (v) => `+${fmtNum(v, 2)}%` },
      { key: 'hdi', label: 'HDI', align: 'num', render: (v) => fmtNum(v, 1) },
    ],
    rows: MACRO_REGION_SUMMARY,
  });

  const releasesHtml = LATEST_RELEASES.map(
    (rel) => `<li class="release-item">
      <div class="release-top">
        <span>${esc(rel.date)}</span>
        <span class="kpi-code">${esc(rel.code)}</span>
      </div>
      <strong><a href="${esc(rel.route)}">${esc(rel.title)}</a></strong>
      <p>${esc(rel.summary)}</p>
    </li>`,
  ).join('');

  root.innerHTML = `
    <section class="hero-banner">
      <div>
        <span class="hero-kicker">Republic of Indonesia · FY 2025 Statistical Portrait</span>
        <h1>Trusted macroeconomic, demographic, and regional indicators in one place.</h1>
        <p>Explore quarterly national accounts, consumer price baskets, labor force trends, and provincial development across 38 provinces — built for analysts, policymakers, and citizens.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/economy">Explore Macroeconomy</a>
          <a class="btn btn-ghost" href="#/regions">Open Provincial Atlas</a>
          <a class="btn btn-ghost" href="#/explorer">Search &amp; Export CSV</a>
        </div>
      </div>
      <div class="hero-summary-box" aria-label="National Snapshot">
        <div class="hero-stat">
          <small>GDP per Capita (2025)</small>
          <strong>$5,063</strong>
          <span>IDR 80.7M · SNA 2008</span>
        </div>
        <div class="hero-stat">
          <small>Trade Balance (2025)</small>
          <strong>+$34.8B</strong>
          <span>56th straight surplus mo.</span>
        </div>
        <div class="hero-stat">
          <small>Human Dev. Index</small>
          <strong>75.02</strong>
          <span>High tier · +0.63 YoY</span>
        </div>
        <div class="hero-stat">
          <small>Clean Power Share</small>
          <strong>14.9%</strong>
          <span>Geothermal &amp; hydro mix</span>
        </div>
      </div>
    </section>

    <div class="section-head">
      <div>
        <h2>Headline National Indicators</h2>
        <p>Latest official benchmark readings with 6-year trajectory and source attribution.</p>
      </div>
      <a class="btn btn-outline" href="#/explorer">Browse all 28 indicators &rarr;</a>
    </div>
    <section class="kpi-grid">${kpisHtml}</section>

    <div class="section-head" style="margin-top:26px">
      <div>
        <h2>Macroeconomic Pulse &amp; Industrial Structure</h2>
        <p>Quarterly real GDP growth vs. headline CPI inflation and sector shares of output.</p>
      </div>
    </div>
    <section class="grid-2">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Quarterly GDP Growth &amp; CPI Inflation (2021–2025)</h3>
            <p class="panel-sub">Year-on-year percentage change (%)</p>
          </div>
          <span class="citation-tag">SNA &amp; CPI Survey · 2025</span>
        </div>
        ${macroChart}
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Nominal GDP Composition by Sector</h3>
            <p class="panel-sub">Share of national gross value added (%), FY 2025</p>
          </div>
          <span class="citation-tag">KBLI / ISIC Rev.4 · 2025</span>
        </div>
        ${sectorChart}
      </article>
    </section>

    <div class="section-head">
      <div>
        <h2>Regional Balance &amp; Latest Statistical Bulletins</h2>
        <p>Output and human development across Indonesia's six macro-regions alongside recent publications.</p>
      </div>
    </div>
    <section class="grid-sidebar">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Six Macro-Regions at a Glance</h3>
            <p class="panel-sub">Share of national GDP, population, real growth, and HDI (2025)</p>
          </div>
          <a class="btn btn-outline" href="#/regions">Interactive Map &rarr;</a>
        </div>
        ${regionTable}
      </article>
      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Latest Statistical Releases</h3>
            <p class="panel-sub">Official schedule &amp; summary notes</p>
          </div>
          <a href="#/methodology">Calendar &rarr;</a>
        </div>
        <ul class="release-list">${releasesHtml}</ul>
      </article>
    </section>
  `;

  bindChartTooltips(root);
}
