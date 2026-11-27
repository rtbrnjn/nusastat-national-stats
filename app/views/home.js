// Editorial overview landing page: compact masthead, 4 KPI strips, dual annotated charts, regional balance & bulletins

import { LATEST_RELEASES, MACRO_REGION_SUMMARY, NATIONAL_KPIS, QUARTERLY_MACRO, SECTOR_GDP_SHARE } from '../data/overview.js';
import { bindChartTooltips, horizontalBarsSvg, lineChartSvg, sparklineSvg } from '../components/charts.js';
import { esc, fmtNum, kpiCard, renderTable, takeawayBox } from '../components/ui.js';

export function renderHome(root) {
  const kpisHtml = NATIONAL_KPIS.map((item) => {
    const stroke = item.tone === 'signal' ? '#9e2a2b' : item.tone === 'good' ? '#0f766e' : '#16425b';
    return kpiCard(item, sparklineSvg(item.spark, stroke));
  }).join('');

  const macroChart = lineChartSvg({
    labels: QUARTERLY_MACRO.map((d) => d.period),
    series: [
      { name: 'Real GDP Growth (YoY)', values: QUARTERLY_MACRO.map((d) => d.gdpGrowth), color: '#16425b', area: true },
      { name: 'Headline CPI Inflation', values: QUARTERLY_MACRO.map((d) => d.cpi), color: '#9e2a2b', area: false },
    ],
    unit: '%',
    height: 195,
    annotations: [
      { index: 3, seriesIdx: 1, label: 'Fuel peak 5.95%', dx: 0, dy: -16 },
      { index: 11, seriesIdx: 0, label: 'Q4 GDP +5.26%', dx: -26, dy: -20 },
    ],
  });

  const sectorChart = horizontalBarsSvg({
    items: SECTOR_GDP_SHARE.map((s) => ({
      label: s.label,
      value: s.share,
      color: s.color,
      sub: `+${s.growth}% YoY`,
    })),
    valueSuffix: '%',
    maxVal: 24,
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
        <span class="code-tag">${esc(rel.code)}</span>
      </div>
      <strong><a href="${esc(rel.route)}">${esc(rel.title)}</a></strong>
      <p>${esc(rel.summary)}</p>
    </li>`,
  ).join('');

  root.innerHTML = `
    <section class="editorial-lead">
      <div>
        <span class="kicker">Republic of Indonesia · FY 2025 / Q1 2026 Statistical Almanac</span>
        <h1>Indonesia in Numbers: Growth, Prices, Labor &amp; All 38 Provinces</h1>
        <p>Verified macroeconomic accounts, 90-city consumer prices, demographic structure, and provincial disparities — cited to BPS, Bank Indonesia, and Ministry of Finance.</p>
      </div>
      <div style="display:flex;gap:7px;flex-wrap:wrap">
        <a class="btn" href="#/regions">38-Province Map</a>
        <a class="btn btn-outline" href="#/economy">Macro &amp; CPI</a>
        <a class="btn btn-outline" href="#/explorer">Explore &amp; Export</a>
      </div>
    </section>

    <section class="kpi-strip">${kpisHtml}</section>

    <section class="grid-2" style="margin-bottom:26px">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Quarterly Real GDP Growth vs. CPI Inflation (2021–2025)</h2>
            <p class="panel-sub">Year-on-year % change · Disinflation restored while output held above 5%</p>
          </div>
          <span class="code-tag">BPS · SNA &amp; CPI 2025</span>
        </div>
        ${macroChart}
        ${takeawayBox('Output stayed resilient near 5.1% through 2025 as inflation normalized from 5.95% (Q3 2022) to 2.42% (Q4 2025).')}
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Nominal GDP Share by Major Sector (FY 2025)</h2>
            <p class="panel-sub">Top 6 KBLI / ISIC Rev.4 industries accounting for 74.0% of output</p>
          </div>
          <span class="code-tag">BPS · KBLI SNA 2025</span>
        </div>
        ${sectorChart}
        ${takeawayBox('Manufacturing remains the largest pillar (19.2%), while ICT & Financial Services (+7.4% YoY) is the fastest-growing major group.')}
      </article>
    </section>

    <section class="grid-atlas">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Six Macro-Regions: Output, Population &amp; HDI (2025)</h3>
            <p class="panel-sub">Regional economic concentration vs. eastern growth acceleration</p>
          </div>
          <a class="btn btn-outline" href="#/regions">Open Choropleth Map &rarr;</a>
        </div>
        ${regionTable}
        ${takeawayBox('Eastern corridors (Sulawesi +6.12%, Maluku-Papua +6.45%) outpace national growth on mineral refining and infrastructure.')}
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Latest Statistical Releases</h3>
            <p class="panel-sub">Official 2025–2026 publications</p>
          </div>
          <a href="#/methodology">2026 Calendar &rarr;</a>
        </div>
        <ul class="release-list">${releasesHtml}</ul>
      </article>
    </section>
  `;

  bindChartTooltips(root);
}
