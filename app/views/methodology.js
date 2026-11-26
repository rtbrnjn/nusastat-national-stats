// Methodology, Release Calendar, Statistical Classifications, and Official Source Registry

import { esc, renderTable } from '../components/ui.js';

const RELEASE_CALENDAR = [
  { release: 'Q1 2026 Quarterly National Accounts (GDP)', frequency: 'Quarterly', window: '05 May 2026', agency: 'National Accounts Directorate', status: 'Scheduled' },
  { release: 'Monthly Consumer Price Index (90 Cities)', frequency: 'Monthly', window: '1st Business Day', agency: 'Price Statistics Division', status: 'Active' },
  { release: 'External Merchandise Trade Bulletin', frequency: 'Monthly', window: '15th of Month', agency: 'Distribution & Trade Statistics', status: 'Active' },
  { release: 'SAKERNAS Labor Force Survey (Feb Wave)', frequency: 'Biannual', window: '05 May 2026', agency: 'Population & Labor Directorate', status: 'Scheduled' },
  { release: 'SUSENAS Poverty & Gini Release (Mar Wave)', frequency: 'Biannual', window: '15 Jul 2026', agency: 'Social Resilience Directorate', status: 'Scheduled' },
  { release: 'Provincial Human Development Index (HDI)', frequency: 'Annual', window: '15 Nov 2026', agency: 'Statistical Analysis Unit', status: 'Planned' },
];

const STANDARDS = [
  { code: 'SNA 2008', title: 'System of National Accounts', detail: 'Constant-price GDP uses 2010 base-year chain-linked Laspeyres volume indices across 17 production sectors and 7 expenditure components.' },
  { code: 'COICOP 2018', title: 'Consumer Price Index Classification', detail: 'Tracks 847 representative goods and services across 90 urban centers weighted by the Household Cost of Living Survey (SBH).' },
  { code: 'ILO / 19th ICLS', title: 'Labor Force Definitions', detail: 'Employed persons cover ages 15+ working at least 1 hour in the reference week; open unemployment covers active jobseekers and new business starters.' },
  { code: 'KBLI / ISIC Rev.4', title: 'Standard Industrial Classification', detail: 'Aligns national industrial output and labor sector tables with international ISIC Rev.4 two-digit groupings.' },
];

export function renderMethodology(root) {
  const calendarTable = renderTable({
    columns: [
      { key: 'release', label: 'Statistical Release' },
      { key: 'frequency', label: 'Frequency' },
      { key: 'window', label: 'Target Publication' },
      { key: 'agency', label: 'Compiling Unit' },
      { key: 'status', label: 'Cycle Status', render: (v) => `<span class="kpi-code">${esc(v)}</span>` },
    ],
    rows: RELEASE_CALENDAR,
  });

  const standardsHtml = STANDARDS.map(
    (s) => `<li class="release-item">
      <div class="release-top"><strong>${esc(s.title)}</strong><span class="kpi-code">${esc(s.code)}</span></div>
      <p>${esc(s.detail)}</p>
    </li>`,
  ).join('');

  root.innerHTML = `
    <div class="section-head" style="margin-top:0">
      <div>
        <h1>Methodology, Standards &amp; Release Calendar</h1>
        <p>Statistical definitions, international classifications, revision policies, and publication schedules.</p>
      </div>
    </div>

    <section class="grid-2" style="margin-bottom:18px">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">International Classifications &amp; Frameworks</h2>
            <p class="panel-sub">How headline series are compiled and benchmarked</p>
          </div>
          <span class="citation-tag">Metadata Standard</span>
        </div>
        <ul class="release-list">${standardsHtml}</ul>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Data Quality &amp; Revision Policy</h2>
            <p class="panel-sub">Governance principles for national statistical releases</p>
          </div>
        </div>
        <div class="compare-box" style="margin-bottom:12px">
          <div class="compare-metric"><span>Preliminary Estimates (t+35 days)</span><strong>First Qtr Release</strong></div>
          <div class="compare-metric"><span>Revised Estimates (t+125 days)</span><strong>Updated Trade &amp; Tax</strong></div>
          <div class="compare-metric"><span>Annual Benchmark Reconciliation</span><strong>Every Q4 Publication</strong></div>
          <div class="compare-metric"><span>Confidentiality Threshold</span><strong>Cell Suppression &ge;3</strong></div>
        </div>
        <p class="panel-sub">All figures in this offline edition include explicit source attribution and reference year so analysts can audit comparability across macroeconomic, demographic, and provincial tables.</p>
      </article>
    </section>

    <article class="panel">
      <div class="panel-head">
        <div>
          <h3 class="panel-title">2026 Statistical Release Calendar</h3>
          <p class="panel-sub">Planned publication windows for flagship national surveys and accounts</p>
        </div>
        <span class="citation-tag">Advance Release Calendar</span>
      </div>
      ${calendarTable}
    </article>
  `;
}
