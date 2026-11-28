// Cover Overview view: editorial lead, 4 KPI strips, interactive chart switcher, macro-region links & bulletins

import { MACRO_REGION_SUMMARY, NATIONAL_KPIS, QUARTERLY_MACRO, SECTOR_GDP_SHARE } from '../data/overview.js';
import { LATEST_RELEASES } from '../data/releases.js';
import { sparklineSvg } from '../components/sparkline.js';
import { lineChartSvg } from '../components/line-chart.js';
import { horizontalBarsSvg } from '../components/bar-chart.js';
import { bindChartTooltips } from '../components/tooltip.js';
import { esc, fmtNum, kpiCard, renderTable, takeawayBox } from '../components/ui.js';

export function renderHome(root, { lang, t }) {
  let chartTab = 'macro';

  function draw() {
    const isId = lang === 'id';
    document.title = isId
      ? 'NusaStat · Almanak Statistik Nasional Indonesia'
      : 'NusaStat · Indonesia National Statistical Almanac';

    const kpisHtml = NATIONAL_KPIS.map((item) => {
      const stroke = item.tone === 'signal' ? '#9e2a2b' : item.tone === 'good' ? '#0f766e' : '#16425b';
      const localized = {
        ...item,
        label: item.label[lang] || item.label.en,
        delta: typeof item.delta === 'string' ? item.delta : (item.delta[lang] || item.delta.en),
        source: typeof item.source === 'string' ? item.source : (item.source[lang] || item.source.en),
        year: typeof item.year === 'string' ? item.year : (item.year[lang] || item.year.en),
      };
      return kpiCard(localized, sparklineSvg(item.spark, stroke));
    }).join('');

    const macroChart = chartTab === 'rates'
      ? lineChartSvg({
          labels: QUARTERLY_MACRO.map((d) => d.period),
          series: [
            { name: isId ? 'Suku Bunga BI-Rate (%)' : 'BI-Rate Benchmark (%)', values: QUARTERLY_MACRO.map((d) => d.biRate), color: '#16425b', area: true },
            { name: isId ? 'Kurs USD/IDR (rb Rp)' : 'USD/IDR Rate (IDR k)', values: QUARTERLY_MACRO.map((d) => d.fxIdrK), color: '#b45309', area: false },
          ],
          unit: '',
          height: 132,
          annotations: [
            { index: 6, seriesIdx: 0, label: isId ? 'Puncak BI 6.00%' : 'BI peak 6.00%', dx: 0, dy: -14 },
            { index: 11, seriesIdx: 1, label: 'Rp 15.7k/USD', dx: -28, dy: -16 },
          ],
        })
      : lineChartSvg({
          labels: QUARTERLY_MACRO.map((d) => d.period),
          series: [
            { name: isId ? 'Pertumbuhan PDB Riil (YoY)' : 'Real GDP Growth (YoY)', values: QUARTERLY_MACRO.map((d) => d.gdpGrowth), color: '#16425b', area: true },
            { name: isId ? 'Inflasi IHK Umum' : 'Headline CPI Inflation', values: QUARTERLY_MACRO.map((d) => d.cpi), color: '#9e2a2b', area: false },
          ],
          unit: '%',
          height: 132,
          annotations: [
            { index: 3, seriesIdx: 1, label: isId ? 'Puncak BBM 5.95%' : 'Fuel peak 5.95%', dx: 0, dy: -15 },
            { index: 11, seriesIdx: 0, label: isId ? 'TW4 PDB +5.26%' : 'Q4 GDP +5.26%', dx: -26, dy: -18 },
          ],
        });

    const sectorChart = horizontalBarsSvg({
      items: SECTOR_GDP_SHARE.map((s) => ({
        label: isId ? s.labelId : s.label,
        value: s.share,
        color: s.color,
        sub: `+${s.growth}% YoY`,
      })),
      valueSuffix: '%',
      maxVal: 24,
    });

    const regionTable = renderTable({
      columns: [
        {
          key: 'name',
          label: isId ? 'Wilayah Makro' : 'Macro-Region',
          render: (v, r) => `<button type="button" class="sort-btn" data-jump-reg="${esc(r.id)}" style="color:#16425b;font-weight:700">${esc(isId ? r.nameId : v)}</button>`,
        },
        { key: 'shareGdp', label: isId ? 'PDB %' : 'GDP %', align: 'num', render: (v) => `${fmtNum(v, 1)}%` },
        { key: 'popMillions', label: isId ? 'Pdk (Jt)' : 'Pop. (M)', align: 'num', render: (v) => fmtNum(v, 1) },
        { key: 'growth', label: isId ? 'Tumbuh' : 'Growth', align: 'num', render: (v) => `+${fmtNum(v, 2)}%` },
        { key: 'hdi', label: isId ? 'IPM' : 'HDI', align: 'num', render: (v) => fmtNum(v, 1) },
      ],
      rows: MACRO_REGION_SUMMARY.slice(0, 4),
    });

    const releasesHtml = LATEST_RELEASES.slice(0, 2)
      .map(
        (rel) => `<li class="release-item">
          <div class="release-top">
            <span>${esc(isId ? rel.dateId : rel.date)}</span>
            <span class="code-tag">${esc(rel.code)}</span>
          </div>
          <strong><a href="${esc(rel.route)}">${esc(isId ? rel.titleId : rel.title)}</a></strong>
          <p>${esc(isId ? rel.summaryId : rel.summary)}</p>
        </li>`,
      )
      .join('');

    const leftTitle = chartTab === 'rates' ? t.homeRateTitle : t.homeMacroTitle;
    const leftSub = chartTab === 'rates' ? t.homeRateSub : t.homeMacroSub;
    const leftTake = chartTab === 'rates' ? t.homeRateTake : t.homeMacroTake;

    root.innerHTML = `
      <section class="editorial-lead">
        <div>
          <span class="kicker">${esc(t.homeKicker)}</span>
          <h1>${esc(t.homeTitle)}</h1>
          <p>${t.homeSub}</p>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <a class="btn" href="#/regions">${esc(t.btnMap)}</a>
          <a class="btn btn-outline" href="#/economy">${t.btnEcon}</a>
          <a class="btn btn-outline" href="#/explorer">${t.btnExplore}</a>
        </div>
      </section>

      <section class="kpi-strip">${kpisHtml}</section>

      <section class="grid-2">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">${esc(leftTitle)}</h2>
              <p class="panel-sub">${leftSub}</p>
            </div>
            <div class="pill-group" role="tablist" aria-label="Overview chart mode">
              <button type="button" class="pill-btn ${chartTab === 'macro' ? 'active' : ''}" data-home-chart="macro">${isId ? 'PDB & IHK' : 'GDP & CPI'}</button>
              <button type="button" class="pill-btn ${chartTab === 'rates' ? 'active' : ''}" data-home-chart="rates">${isId ? 'BI-Rate & Kurs' : 'BI-Rate & FX'}</button>
            </div>
          </div>
          ${macroChart}
          ${takeawayBox(leftTake, t.keyTakeaway)}
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">${esc(t.homeSectorTitle)}</h2>
              <p class="panel-sub">${esc(t.homeSectorSub)}</p>
            </div>
            <span class="code-tag">BPS · KBLI SNA 2025</span>
          </div>
          ${sectorChart}
          ${takeawayBox(t.homeSectorTake, t.keyTakeaway)}
        </article>
      </section>

      <section class="grid-atlas" style="margin-bottom:0">
        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">${esc(t.homeRegionsTitle)}</h3>
              <p class="panel-sub">${esc(t.homeRegionsSub)}</p>
            </div>
            <a class="btn btn-outline" href="#/regions">${esc(t.openMap)}</a>
          </div>
          ${regionTable}
        </article>

        <article class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">${esc(t.homeReleasesTitle)}</h3>
              <p class="panel-sub">${esc(t.homeReleasesSub)}</p>
            </div>
            <a href="#/methodology?tab=calendar">${esc(t.calendarLink)}</a>
          </div>
          <ul class="release-list">${releasesHtml}</ul>
        </article>
      </section>
    `;

    bindChartTooltips(root);
    root.querySelectorAll('[data-home-chart]').forEach((btn) => {
      btn.addEventListener('click', () => {
        chartTab = btn.dataset.homeChart;
        draw();
      });
    });
    root.querySelectorAll('[data-jump-reg]').forEach((btn) => {
      btn.addEventListener('click', () => {
        location.hash = `#/regions?reg=${encodeURIComponent(btn.dataset.jumpReg)}`;
      });
    });
  }

  draw();
}

export const render = renderHome;
