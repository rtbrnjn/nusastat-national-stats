// Demographics, Population Pyramid, Labor Force, and Social Progress view

import { LABOR_TRANSITION, PYRAMID_2025, PYRAMID_2035, SOCIAL_PROGRESS_INDICATORS, URBANIZATION_TREND } from '../data/demographics.js';
import { lineChartSvg } from '../components/line-chart.js';
import { horizontalBarsSvg } from '../components/bar-chart.js';
import { pyramidSvg } from '../components/pyramid-chart.js';
import { bindChartTooltips } from '../components/tooltip.js';
import { downloadCsv } from '../components/export.js';
import { esc, kpiCard, renderTable, takeawayBox } from '../components/ui.js';

export function renderDemographics(root, { lang, t }) {
  let cohortYear = '2025';

  function draw() {
    document.title = lang === 'id' ? 'Demografi & Tenaga Kerja · NusaStat' : 'Demographics & Labor · NusaStat';
    const cohorts = cohortYear === '2035' ? PYRAMID_2035 : PYRAMID_2025;

    const kpis = [
      kpiCard({ code: 'DEM-01', label: lang === 'id' ? 'Usia Median' : 'Median Age', value: '30.6 yrs', delta: '69.2% age 15-64', tone: 'good', source: 'BPS · SUPAS', year: '2025' }),
      kpiCard({ code: 'LAB-02', label: lang === 'id' ? 'Tenaga Kerja' : 'Workforce', value: '144.6M', delta: '70.6% active', tone: 'good', source: 'BPS · SAKERNAS', year: 'Aug 2025' }),
      kpiCard({ code: 'URB-01', label: lang === 'id' ? 'Rasio Urban' : 'Urban Share', value: '59.8%', delta: '+17.8 pp vs 2000', tone: 'neutral', source: 'BPS · Census', year: '2025' }),
      kpiCard({ code: 'HLT-01', label: lang === 'id' ? 'Harapan Hidup' : 'Life Expectancy', value: '74.15 y', delta: 'TFR 2.11', tone: 'good', source: 'BPS · Vital Stats', year: '2025' }),
    ].join('');

    const urbanChart = lineChartSvg({
      labels: URBANIZATION_TREND.years,
      series: [
        { name: lang === 'id' ? 'Perkotaan (%)' : 'Urban Share (%)', values: URBANIZATION_TREND.urbanPct, color: '#16425b', area: true },
        { name: lang === 'id' ? 'Perdesaan (%)' : 'Rural Share (%)', values: URBANIZATION_TREND.ruralPct, color: '#0f766e' },
      ],
      unit: '%',
      height: 185,
    });

    const socialTable = renderTable({
      columns: [
        { key: 'indicator', label: lang === 'id' ? 'Indikator Sosial' : 'Social & Demographic Indicator' },
        { key: 'value', label: lang === 'id' ? 'Capaian' : 'Latest Reading', align: 'num' },
        { key: 'change', label: lang === 'id' ? 'Tren' : 'Trend / Context' },
        { key: 'year', label: 'Period', align: 'num' },
        { key: 'source', label: 'Source' },
      ],
      rows: SOCIAL_PROGRESS_INDICATORS,
    });

    root.innerHTML = `
      <div class="editorial-lead">
        <div>
          <span class="kicker">${esc(t.demoKicker)}</span>
          <h1>${esc(t.demoTitle)}</h1>
          <p>${esc(t.demoSub)}</p>
        </div>
        <button class="btn btn-outline" id="export-demo-csv" type="button">${esc(t.downloadCsv)}</button>
      </div>

      <section class="kpi-strip">${kpis}</section>

      <section class="grid-2">
        <article class="panel" style="margin-bottom:26px">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">${lang === 'id' ? 'Piramida Penduduk (%)' : 'Population Pyramid (% Share)'}</h2>
              <p class="panel-sub">5-year cohorts · ${cohortYear === '2035' ? 'Projected 2035' : 'Baseline 2025'} · BPS SP2020/SUPAS</p>
            </div>
            <div class="pill-group">
              <button type="button" class="pill-btn ${cohortYear === '2025' ? 'active' : ''}" data-pyr="2025">2025</button>
              <button type="button" class="pill-btn ${cohortYear === '2035' ? 'active' : ''}" data-pyr="2035">2035 Proj.</button>
            </div>
          </div>
          ${pyramidSvg(cohorts)}
          ${takeawayBox('69.2% of residents sit in ages 15–64 in 2025, sustaining a prime demographic dividend window through the early 2030s.', t.keyTakeaway)}
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">Urban vs. Rural Population Transition (2000–2025)</h3>
              <p class="panel-sub">Share of resident population in urban settlements</p>
            </div>
            <span class="code-tag">BPS · Census Series 2025</span>
          </div>
          ${urbanChart}
          ${takeawayBox('Nearly 6 in 10 Indonesians now live in urban areas, accelerating formal service employment and housing demand.', t.keyTakeaway)}
        </article>
      </section>

      <article class="panel" style="margin-bottom:10px">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Employment Distribution Across Major Sectors</h3>
            <p class="panel-sub">Share of 144.6M employed workers · Source: BPS SAKERNAS August 2025</p>
          </div>
          <span class="code-tag">BPS · SAKERNAS Aug 2025</span>
        </div>
        ${horizontalBarsSvg({ items: LABOR_TRANSITION, valueSuffix: '%', maxVal: 55 })}
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">Health, Education &amp; Household Living Standards</h3>
            <p class="panel-sub">Verified social indicators with official source and reference year</p>
          </div>
          <span class="code-tag">BPS · SUSENAS 2025</span>
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
