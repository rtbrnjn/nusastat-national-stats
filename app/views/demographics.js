// Demographics, Population Pyramid, Labor Force, and Social Progress view (bilingual EN/ID)

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
    const isId = lang === 'id';
    document.title = isId ? 'Demografi & Tenaga Kerja · NusaStat' : 'Demographics & Labor · NusaStat';
    const cohorts = cohortYear === '2035' ? PYRAMID_2035 : PYRAMID_2025;

    const kpis = [
      kpiCard({ code: 'DEM-01', label: isId ? 'Usia Median' : 'Median Age', value: isId ? '30.6 thn' : '30.6 yrs', delta: isId ? '69,2% usia 15-64' : '69.2% age 15-64', tone: 'good', source: 'BPS · SUPAS', year: '2025' }),
      kpiCard({ code: 'LAB-02', label: isId ? 'Tenaga Kerja' : 'Workforce', value: isId ? '144.6 jt' : '144.6M', delta: isId ? '70,6% aktif' : '70.6% active', tone: 'good', source: 'BPS · SAKERNAS', year: isId ? 'Agu 2025' : 'Aug 2025' }),
      kpiCard({ code: 'URB-01', label: isId ? 'Rasio Urban' : 'Urban Share', value: '59.8%', delta: '+17.8 pp vs 2000', tone: 'neutral', source: isId ? 'BPS · Sensus' : 'BPS · Census', year: '2025' }),
      kpiCard({ code: 'HLT-01', label: isId ? 'Harapan Hidup' : 'Life Expectancy', value: isId ? '74.15 thn' : '74.15 y', delta: 'TFR 2.11', tone: 'good', source: isId ? 'BPS · Statistik Vital' : 'BPS · Vital Stats', year: '2025' }),
    ].join('');

    const urbanChart = lineChartSvg({
      labels: URBANIZATION_TREND.years,
      series: [
        { name: isId ? 'Perkotaan (%)' : 'Urban Share (%)', values: URBANIZATION_TREND.urbanPct, color: '#16425b', area: true },
        { name: isId ? 'Perdesaan (%)' : 'Rural Share (%)', values: URBANIZATION_TREND.ruralPct, color: '#0f766e' },
      ],
      unit: '%',
      height: 185,
    });

    const socialRows = SOCIAL_PROGRESS_INDICATORS.map((r) => ({
      ...r,
      indicator: isId ? r.indicatorId : r.indicator,
    }));

    const socialTable = renderTable({
      columns: [
        { key: 'indicator', label: isId ? 'Indikator Sosial & Demografi' : 'Social & Demographic Indicator' },
        { key: 'value', label: isId ? 'Capaian' : 'Latest Reading', align: 'num' },
        { key: 'change', label: isId ? 'Tren / Konteks' : 'Trend / Context' },
        { key: 'year', label: isId ? 'Periode' : 'Period', align: 'num' },
        { key: 'source', label: isId ? 'Sumber Resmi' : 'Source' },
      ],
      rows: socialRows,
    });

    const pyrTake = isId
      ? 'Sebanyak 69,2% penduduk berada pada usia produktif (15–64) pada 2025, menopang jendela bonus demografi hingga awal 2030-an.'
      : '69.2% of residents sit in ages 15–64 in 2025, sustaining a prime demographic dividend window through the early 2030s.';
    const urbTake = isId
      ? 'Hampir 6 dari 10 penduduk Indonesia kini tinggal di wilayah perkotaan, mendorong serapan kerja jasa formal dan kebutuhan hunian.'
      : 'Nearly 6 in 10 Indonesians now live in urban areas, accelerating formal service employment and housing demand.';

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
              <h2 class="panel-title">${isId ? 'Piramida Penduduk (% Pangsa)' : 'Population Pyramid (% Share)'}</h2>
              <p class="panel-sub">${isId ? `Kelompok usia 5-tahunan · ${cohortYear === '2035' ? 'Proyeksi 2035' : 'Baseline 2025'} · BPS SP2020/SUPAS` : `5-year cohorts · ${cohortYear === '2035' ? 'Projected 2035' : 'Baseline 2025'} · BPS SP2020/SUPAS`}</p>
            </div>
            <div class="pill-group">
              <button type="button" class="pill-btn ${cohortYear === '2025' ? 'active' : ''}" data-pyr="2025">2025</button>
              <button type="button" class="pill-btn ${cohortYear === '2035' ? 'active' : ''}" data-pyr="2035">${isId ? 'Proy. 2035' : '2035 Proj.'}</button>
            </div>
          </div>
          ${pyramidSvg(cohorts, lang)}
          ${takeawayBox(pyrTake, t.keyTakeaway)}
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">${isId ? 'Transisi Penduduk Kota vs. Desa (2000–2025)' : 'Urban vs. Rural Population Transition (2000–2025)'}</h3>
              <p class="panel-sub">${isId ? 'Proporsi penduduk pada wilayah perkotaan dan perdesaan' : 'Share of resident population in urban settlements'}</p>
            </div>
            <span class="code-tag">${isId ? 'BPS · Seri Sensus 2025' : 'BPS · Census Series 2025'}</span>
          </div>
          ${urbanChart}
          ${takeawayBox(urbTake, t.keyTakeaway)}
        </article>
      </section>

      <article class="panel" style="margin-bottom:10px">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">${isId ? 'Distribusi Pekerja Menurut Sektor Utama' : 'Employment Distribution Across Major Sectors'}</h3>
            <p class="panel-sub">${isId ? 'Pangsa dari 144,6 juta pekerja · Sumber: BPS SAKERNAS Agustus 2025' : 'Share of 144.6M employed workers · Source: BPS SAKERNAS August 2025'}</p>
          </div>
          <span class="code-tag">${isId ? 'BPS · SAKERNAS Agu 2025' : 'BPS · SAKERNAS Aug 2025'}</span>
        </div>
        ${horizontalBarsSvg({ items: LABOR_TRANSITION.map((x) => ({ ...x, label: isId ? x.labelId : x.label, sub: isId ? x.subId : x.sub })), valueSuffix: '%', maxVal: 55 })}
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">${isId ? 'Kesehatan, Pendidikan &amp; Standar Hidup Rumah Tangga' : 'Health, Education &amp; Household Living Standards'}</h3>
            <p class="panel-sub">${isId ? 'Indikator sosial resmi beserta sumber dan tahun referensi' : 'Verified social indicators with official source and reference year'}</p>
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

export const render = renderDemographics;
