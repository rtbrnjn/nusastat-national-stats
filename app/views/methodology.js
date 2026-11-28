// Methodology, Statistical Standards, Source Registry, and 2026 Advance Release Calendar (bilingual EN/ID)

import { RELEASE_CALENDAR_2026, STATISTICAL_STANDARDS } from '../data/releases.js';
import { esc, renderTable, takeawayBox } from '../components/ui.js';

export function renderMethodology(root, { lang, t, params }) {
  const isId = lang === 'id';
  document.title = isId ? 'Metodologi & Kalender · NusaStat' : 'Methodology & Release Calendar · NusaStat';
  const focusCal = params?.get('tab') === 'calendar';

  const calRows = RELEASE_CALENDAR_2026.map((r) => ({
    release: isId ? r.releaseId : r.release,
    frequency: isId ? r.frequencyId : r.frequency,
    window: isId ? r.windowId : r.window,
    agency: r.agency,
    status: isId ? r.statusId : r.status,
  }));

  const calendarTable = renderTable({
    columns: [
      { key: 'release', label: isId ? 'Rilis Statistik' : 'Statistical Release' },
      { key: 'frequency', label: isId ? 'Frekuensi' : 'Frequency' },
      { key: 'window', label: isId ? 'Jadwal Rilis' : 'Publication Window' },
      { key: 'agency', label: isId ? 'Instansi Penyusun' : 'Compiling Agency' },
      { key: 'status', label: 'Status', render: (v) => `<span class="code-tag">${esc(v)}</span>` },
    ],
    rows: calRows,
  });

  const standardsHtml = STATISTICAL_STANDARDS.map(
    (s) => `<li class="release-item">
      <div class="release-top"><strong>${esc(isId ? s.titleId : s.title)}</strong><span class="code-tag">${esc(s.code)}</span></div>
      <p>${esc(isId ? s.detailId : s.detail)}</p>
    </li>`,
  ).join('');

  const methTake = isId
    ? 'Setiap indikator pada NusaStat menyertakan kode instansi penyusun dan tahun referensi secara eksplisit untuk audit komparabilitas luring.'
    : 'Every indicator across NusaStat carries its exact compiler code and reference year so analysts can verify vintage comparability offline.';

  const standardsSection = `<section class="grid-2">
    <article class="panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">${isId ? 'Klasifikasi Statistik Internasional' : 'International Classifications'}</h2>
          <p class="panel-sub">${isId ? 'Definisi dan standar rujukan seri indikator utama' : 'How headline series are defined and benchmarked'}</p>
        </div>
        <span class="code-tag">${isId ? 'Selaras UNSD / ILO' : 'UNSD / ILO Aligned'}</span>
      </div>
      <ul class="release-list">${standardsHtml}</ul>
    </article>

    <article class="panel">
      <div class="panel-head">
        <div>
          <h2 class="panel-title">${isId ? 'Kebijakan Revisi &amp; Registri Sumber' : 'Revision Policy &amp; Source Registry'}</h2>
          <p class="panel-sub">${isId ? 'Tata kelola rilis dan instansi penghimpun resmi' : 'Governance rules and authoritative data compilers'}</p>
        </div>
      </div>
      <div class="compare-box" style="margin-bottom:8px">
        <div class="compare-metric"><span>${isId ? 'PDB Triwulanan Angka Awal' : 'Preliminary Quarterly GDP'}</span><strong>${isId ? 't + 35 hari' : 't + 35 days'}</strong></div>
        <div class="compare-metric"><span>${isId ? 'Neraca Revisi (Pajak &amp; Bea Cukai)' : 'Revised Accounts (Tax &amp; Customs)'}</span><strong>${isId ? 't + 125 hari' : 't + 125 days'}</strong></div>
        <div class="compare-metric"><span>${isId ? 'Rekonsiliasi Tahunan' : 'Annual Benchmark Reconciliation'}</span><strong>${isId ? 'Setiap Siklus TW IV' : 'Every Q4 Cycle'}</strong></div>
        <div class="compare-metric"><span>${isId ? 'Penyusun Makro &amp; Sensus Utama' : 'Primary Macro &amp; Census Compiler'}</span><strong>${isId ? 'BPS-Statistik Indonesia' : 'BPS-Statistics Indonesia'}</strong></div>
        <div class="compare-metric"><span>${isId ? 'Moneter &amp; Cadangan Devisa' : 'Monetary &amp; FX Reserves'}</span><strong>Bank Indonesia</strong></div>
        <div class="compare-metric"><span>${isId ? 'Realisasi Fiskal (APBN)' : 'Fiscal Accounts (APBN)'}</span><strong>${isId ? 'Kementerian Keuangan RI' : 'Ministry of Finance'}</strong></div>
      </div>
      ${takeawayBox(methTake, t.keyTakeaway)}
    </article>
  </section>`;

  const calendarSection = `<article class="panel" id="release-calendar" style="${focusCal ? 'border-color:#9e2a2b;box-shadow:0 0 0 1px #9e2a2b;margin-bottom:9px' : 'margin-bottom:9px'}">
    <div class="panel-head">
      <div>
        <h2 class="panel-title">${isId ? 'Kalender Rilis Resmi 2026' : '2026 Advance Release Calendar'}</h2>
        <p class="panel-sub">${isId ? 'Jadwal publikasi terencana indikator makro, ketenagakerjaan, dan sosial' : 'Scheduled publication dates for core macroeconomic, labor, and social releases'}</p>
      </div>
      <span class="code-tag">${isId ? 'Jadwal TA 2026' : 'FY 2026 Schedule'}</span>
    </div>
    ${calendarTable}
  </article>`;

  root.innerHTML = `
    <div class="editorial-lead">
      <div>
        <span class="kicker">${esc(t.methKicker)}</span>
        <h1>${esc(t.methTitle)}</h1>
        <p>${esc(t.methSub)}</p>
      </div>
    </div>
    ${focusCal ? `${calendarSection}${standardsSection}` : `${standardsSection}${calendarSection}`}
  `;
}

export const render = renderMethodology;
