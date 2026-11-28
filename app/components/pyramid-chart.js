// Population pyramid SVG chart for 5-year age cohorts by sex (bilingual EN/ID)

import { esc } from './ui.js';

export function pyramidSvg(cohorts, lang = 'en') {
  const isId = lang === 'id';
  const width = 540;
  const rowH = 16;
  const height = cohorts.length * rowH + 26;
  const midX = width / 2;
  const gap = 26;
  const maxBar = midX - gap - 36;
  const maxPct = Math.max(...cohorts.flatMap((c) => [c.male, c.female]), 6);

  const bars = cohorts
    .map((c, idx) => {
      const y = idx * rowH + 19;
      const mw = (c.male / maxPct) * maxBar;
      const fw = (c.female / maxPct) * maxBar;
      const tip = isId ? `Usia ${c.age}: Pria ${c.male}% · Wanita ${c.female}%` : `Age ${c.age}: Male ${c.male}% · Female ${c.female}%`;
      return `<g data-tip="${esc(tip)}">
        <text x="${midX}" y="${y + 10}" text-anchor="middle" font-size="9.8" fill="#121820" font-weight="700">${esc(c.age)}</text>
        <rect x="${(midX - gap - mw).toFixed(1)}" y="${y + 1.5}" width="${mw.toFixed(1)}" height="10.5" rx="2" fill="#16425b" />
        <rect x="${(midX + gap).toFixed(1)}" y="${y + 1.5}" width="${fw.toFixed(1)}" height="10.5" rx="2" fill="#9e2a2b" />
      </g>`;
    })
    .join('');

  return `<div class="chart-wrap">
    <div class="chart-tooltip"></div>
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Population pyramid by age cohort">
      <text x="${midX - gap - 8}" y="12" text-anchor="end" font-size="10.5" font-weight="700" fill="#16425b">${isId ? 'Pria (%)' : 'Male (%)'}</text>
      <text x="${midX + gap + 8}" y="12" text-anchor="start" font-size="10.5" font-weight="700" fill="#9e2a2b">${isId ? 'Wanita (%)' : 'Female (%)'}</text>
      ${bars}
    </svg>
  </div>`;
}
