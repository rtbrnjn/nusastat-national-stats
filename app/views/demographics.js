// Demographics, Population Pyramid, Labor Force, and Social Progress view

import { LABOR_TRANSITION, PYRAMID_2025, PYRAMID_2035, SOCIAL_PROGRESS_INDICATORS, URBANIZATION_TREND } from '../data/demographics.js';
import { bindChartTooltips, horizontalBarsSvg, lineChartSvg, pyramidSvg } from '../components/charts.js';
import { downloadCsv, kpiCard, renderTable } from '../components/ui.js';

export function renderDemographics(root) {
  let cohortYear = '2025';

  function draw() {
    const cohorts = cohortYear === '2035' ? PYRAMID_2035 : PYRAMID_2025;

    const kpis = [
      kpiCard({
        code: 'DEM-2025',
        label: 'Median Age',
        value: '30.6 yrs',
        delta: '69.2% working-age',
        tone: 'good',
        source: 'Population Census Projection',
        year: '2025',
      }),
      kpiCard({
        code: 'LAB-2025',
        label: 'Employed Workforce',
        value: '144.6M',
        delta: '70.6% participation',
        tone: 'good',
        source: 'SAKERNAS Survey',
        year: 'Aug 2025',
      }),
      kpiCard({
        code: 'URB-2025',
        label: 'Urban Population Share',
        value: '59.8%',
        delta: '+17.8 pp since 2000',
        tone: 'neutral',
        source: 'Urban-Rural Classification',
        year: '2025',
      }),
    ].join('');

    const urbanChart = lineChartSvg({
      labels: URBANIZATION_TREND.years,
      series: [
        { name: 'Urban Share (%)', values: URBANIZATION_TREND.urbanPct, color: '#0f4c81', area: true },
        { name: 'Rural Share (%)', values: URBANIZATION_TREND.ruralPct, color: '#047857' },
      ],
      unit: '%',
      height: 225,
    });

    const socialTable = renderTable({
      columns: [
        { key: 'indicator', label: 'Social & Demographic Indicator' },
        { key: 'value', label: 'Latest Reading', align: 'num' },
        { key: 'change', label: 'Trend / Context' },
        { key: 'year', label: 'Ref. Period', align: 'num' },
        { key: 'source', label: 'Source' },
      ],
      rows: SOCIAL_PROGRESS_INDICATORS,
    });

    root.innerHTML = `
      <div class="section-head" style="margin-top:0">
        <div>
          <h1>Demographics, Labor &amp; Social Progress</h1>
          <p>Age-sex population structure, urbanization trajectory, employment composition, and human capital indicators.</p>
        </div>
        <button class="btn btn-outline" id="export-demo-csv" type="button">Download Social CSV</button>
      </div>

      <section class="kpi-grid" style="margin-bottom:18px">${kpis}</section>

      <section class="grid-2" style="margin-bottom:18px">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">Population Pyramid (% of Total Population)</h2>
              <p class="panel-sub">5-year age cohorts by sex (${cohortYear === '2035' ? 'Projected 2035' : 'Baseline 2025'})</p>
            </div>
            <div class="pill-group">
              <button type="button" class="pill-btn ${cohortYear === '2025' ? 'active' : ''}" data-pyr="2025">2025</button>
              <button type="button" class="pill-btn ${cohortYear === '2035' ? 'active' : ''}" data-pyr="2035">2035 Proj.</button>
            </div>
          </div>
          ${pyramidSvg(cohorts)}
          <p class="panel-sub" style="margin-top:8px">Source: Intercensal Population Survey &amp; SP2020 Cohort Projection (${cohortYear}).</p>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Urban vs. Rural Population Shift (2000–2025)</h3>
              <p class="panel-sub">Share of resident population living in urban settlements</p>
            </div>
            <span class="citation-tag">Census Series · 2025</span>
          </div>
          ${urbanChart}
        </article>
      </section>

      <article class="panel" style="margin-bottom:18px">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Employment Distribution by Broad Sector</h3>
            <p class="panel-sub">Share of 144.6 million employed workers (SAKERNAS August 2025)</p>
          </div>
          <span class="citation-tag">SAKERNAS · Aug 2025</span>
        </div>
        ${horizontalBarsSvg({ items: LABOR_TRANSITION, valueSuffix: '%', maxVal: 55 })}
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Health, Education &amp; Household Living Standards</h3>
            <p class="panel-sub">Verified social indicators with official source and reference year</p>
          </div>
          <span class="citation-tag">SUSENAS &amp; SAKERNAS · 2025</span>
        </div>
        ${socialTable}
      </article>
    `;

    bindChartTooltips(root);

    root.querySelectorAll('[data-pyr]').forEach((btn) => {
      btn.addEventListener('click', () => {
        cohortYear = btn.dataset.pyr;
        draw();
      });
    });

    root.querySelector('#export-demo-csv')?.addEventListener('click', () => {
      downloadCsv(
        'indonesia-demographics-social-2025.csv',
        ['Indicator', 'Value', 'Trend', 'Reference_Period', 'Source'],
        SOCIAL_PROGRESS_INDICATORS.map((r) => [r.indicator, r.value, r.change, r.year, r.source]),
      );
    });
  }

  draw();
}
