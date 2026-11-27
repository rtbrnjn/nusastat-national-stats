// Horizontal breakdown SVG bar chart and side-by-side comparison mini-bar helpers

import { esc } from './ui.js';

export function horizontalBarsSvg({ items, valueSuffix = '%', maxVal = null }) {
  const width = 560;
  const rowH = 26;
  const padL = 186;
  const padR = 52;
  const height = items.length * rowH + 6;
  const top = maxVal ?? Math.max(...items.map((i) => Math.abs(i.value)), 1);
  const barMaxW = width - padL - padR;

  const rows = items
    .map((item, idx) => {
      const y = idx * rowH + 4;
      const bw = Math.max(4, (Math.abs(item.value) / top) * barMaxW);
      const fill = item.color || '#16425b';
      return `<g data-tip="${esc(item.label)}: ${item.value}${esc(valueSuffix)}${item.sub ? ` (${esc(item.sub)})` : ''}">
        <text x="${padL - 8}" y="${y + 13}" text-anchor="end" font-size="11" fill="#121820" font-weight="600">${esc(item.label)}</text>
        <rect x="${padL}" y="${y + 2}" width="${barMaxW}" height="14" rx="3" fill="#f0ebe1" />
        <rect x="${padL}" y="${y + 2}" width="${bw.toFixed(1)}" height="14" rx="3" fill="${esc(fill)}" />
        <text x="${(padL + bw + 6).toFixed(1)}" y="${y + 13}" font-size="10.5" fill="#121820" font-weight="700">${item.value}${esc(valueSuffix)}</text>
      </g>`;
    })
    .join('');

  return `<div class="chart-wrap">
    <div class="chart-tooltip"></div>
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Breakdown bar chart">
      ${rows}
    </svg>
  </div>`;
}

export function compareMiniBar(label, valA, valB, maxVal, formatFn) {
  const wA = Math.max(6, Math.min(100, (valA / maxVal) * 100));
  const wB = Math.max(6, Math.min(100, (valB / maxVal) * 100));
  return `<div class="mini-bar-row">
    <div class="mini-bar-head">
      <span>${esc(label)}</span>
      <span><strong style="color:#16425b">${esc(formatFn(valA))}</strong> vs <strong style="color:#9e2a2b">${esc(formatFn(valB))}</strong></span>
    </div>
    <div class="mini-bar-track">
      <div class="mini-bar-a" style="width:${(wA / 2).toFixed(1)}%"></div>
      <div class="mini-bar-b" style="width:${(wB / 2).toFixed(1)}%"></div>
    </div>
  </div>`;
}
