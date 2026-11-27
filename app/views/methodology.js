// Methodology, Statistical Standards, Source Registry, and 2026 Advance Release Calendar

import { RELEASE_CALENDAR_2026, STATISTICAL_STANDARDS } from '../data/releases.js';
import { esc, renderTable, takeawayBox } from '../components/ui.js';

export function renderMethodology(root, { lang, t }) {
  document.title = lang === 'id' ? 'Metodologi & Kalender · NusaStat' : 'Methodology & Release Calendar · NusaStat';

  const calendarTable = renderTable({
    columns: [
      { key: 'release', label: lang === 'id' ? 'Rilis Statistik' : 'Statistical Release' },
      { key: 'frequency', label: 'Frequency' },
      { key: 'window', label: 'Publication Window' },
      { key: 'agency', label: 'Compiling Agency' },
      { key: 'status', label: 'Status', render: (v) => `<span class="code-tag">${esc(v)}</span>` },
    ],
    rows: RELEASE_CALENDAR_2026,
  });

  const standardsHtml = STATISTICAL_STANDARDS.map(
    (s) => `<li class="release-item">
      <div class="release-top"><strong>${esc(s.title)}</strong><span class="code-tag">${esc(s.code)}</span></div>
      <p>${esc(s.detail)}</p>
    </li>`,
  ).join('');

  root.innerHTML = `
    <div class="editorial-lead">
      <div>
        <span class="kicker">${esc(t.methKicker)}</span>
        <h1>${esc(t.methTitle)}</h1>
        <p>${esc(t.methSub)}</p>
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
        <div class="compare-box" style="margin-bottom:8px">
          <div class="compare-metric"><span>Preliminary Quarterly GDP</span><strong>t + 35 days</strong></div>
          <div class="compare-metric"><span>Revised Accounts (Tax &amp; Customs)</span><strong>t + 125 days</strong></div>
          <div class="compare-metric"><span>Annual Benchmark Reconciliation</span><strong>Every Q4 Cycle</strong></div>
          <div class="compare-metric"><span>Primary Macro &amp; Census Compiler</span><strong>BPS-Statistics Indonesia</strong></div>
          <div class="compare-metric"><span>Monetary &amp; FX Reserves</span><strong>Bank Indonesia</strong></div>
          <div class="compare-metric"><span>Fiscal Accounts (APBN)</span><strong>Ministry of Finance</strong></div>
        </div>
        ${takeawayBox('Every indicator across NusaStat carries its exact compiler code and reference year so analysts can verify vintage comparability offline.', t.keyTakeaway)}
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
