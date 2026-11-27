// Methodology, Statistical Standards, Source Registry, and 2026 Release Calendar

import { esc, renderTable, takeawayBox } from '../components/ui.js';

const RELEASE_CALENDAR = [
  { release: 'Q1 2026 Quarterly National Accounts (GDP)', frequency: 'Quarterly', window: '05 May 2026', agency: 'BPS · National Accounts', status: 'Scheduled' },
  { release: 'Monthly Consumer Price Index (90 Cities)', frequency: 'Monthly', window: '1st Business Day', agency: 'BPS · Price Statistics', status: 'Active' },
  { release: 'External Merchandise Trade Bulletin', frequency: 'Monthly', window: '15th of Month', agency: 'BPS · Distribution & Trade', status: 'Active' },
  { release: 'SAKERNAS Labor Force Survey (Feb Wave)', frequency: 'Biannual', window: '05 May 2026', agency: 'BPS · Labor & Demography', status: 'Scheduled' },
  { release: 'SUSENAS Poverty & Gini Release (Mar Wave)', frequency: 'Biannual', window: '15 Jul 2026', agency: 'BPS · Social Resilience', status: 'Scheduled' },
  { release: 'Provincial Human Development Index (38 Prov.)', frequency: 'Annual', window: '15 Nov 2026', agency: 'BPS · Statistical Analysis', status: 'Planned' },
];

const STANDARDS = [
  { code: 'SNA 2008', title: 'System of National Accounts', detail: 'Constant-price GDP uses 2010 base-year chain-linked Laspeyres volume indices across 17 production sectors and 7 expenditure components.' },
  { code: 'COICOP 2018', title: 'Consumer Price Index Classification', detail: 'Tracks 847 representative goods and services across 90 urban centers weighted by the Household Cost of Living Survey (SBH).' },
  { code: 'ILO 19th ICLS', title: 'Labor Force Definitions', detail: 'Employed persons cover ages 15+ working at least 1 hour in the reference week; open unemployment covers active jobseekers.' },
  { code: 'KBLI / ISIC Rev.4', title: 'Standard Industrial Classification', detail: 'Aligns national industrial output and labor sector tables with international ISIC Rev.4 two-digit groupings.' },
];

export function renderMethodology(root) {
  const calendarTable = renderTable({
    columns: [
      { key: 'release', label: 'Statistical Release' },
      { key: 'frequency', label: 'Frequency' },
      { key: 'window', label: 'Publication Window' },
      { key: 'agency', label: 'Compiling Agency' },
      { key: 'status', label: 'Status', render: (v) => `<span class="code-tag">${esc(v)}</span>` },
    ],
    rows: RELEASE_CALENDAR,
  });

  const standardsHtml = STANDARDS.map(
    (s) => `<li class="release-item">
      <div class="release-top"><strong>${esc(s.title)}</strong><span class="code-tag">${esc(s.code)}</span></div>
      <p>${esc(s.detail)}</p>
    </li>`,
  ).join('');

  root.innerHTML = `
    <div class="editorial-lead">
      <div>
        <span class="kicker">Metadata, Standards &amp; Governance</span>
        <h1>Methodology, Classifications &amp; 2026 Release Calendar</h1>
        <p>International statistical standards, revision windows, and official source registry used across NusaStat.</p>
      </div>
    </div>

    <section class="grid-2">
      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">International Classifications</h2>
            <p class="panel-sub">How headline series are defined and benchmarked</p>
          </div>
          <span class="code-tag">UNSD / ILO Aligned</span>
        </div>
        <ul class="release-list">${standardsHtml}</ul>
      </article>

      <article class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">Revision Policy &amp; Source Registry</h2>
            <p class="panel-sub">Governance rules and authoritative data compilers</p>
          </div>
        </div>
        <div class="compare-box" style="margin-bottom:10px">
          <div class="compare-metric"><span>Preliminary Quarterly GDP</span><strong>t + 35 days</strong></div>
          <div class="compare-metric"><span>Revised Accounts (Tax &amp; Customs)</span><strong>t + 125 days</strong></div>
          <div class="compare-metric"><span>Annual Benchmark Reconciliation</span><strong>Every Q4 Cycle</strong></div>
          <div class="compare-metric"><span>Primary Macro &amp; Census Compiler</span><strong>BPS-Statistics Indonesia</strong></div>
          <div class="compare-metric"><span>Monetary &amp; FX Reserves</span><strong>Bank Indonesia</strong></div>
          <div class="compare-metric"><span>Fiscal Accounts (APBN)</span><strong>Ministry of Finance</strong></div>
        </div>
        ${takeawayBox('Every indicator across NusaStat carries its exact compiler code and reference year so analysts can verify vintage comparability offline.')}
      </article>
    </section>

    <article class="panel">
      <div class="panel-head">
        <div>
          <h3 class="panel-title">2026 Advance Release Calendar</h3>
          <p class="panel-sub">Scheduled publication dates for core macroeconomic, labor, and social releases</p>
        </div>
        <span class="code-tag">FY 2026 Schedule</span>
      </div>
      ${calendarTable}
    </article>
  `;
}
