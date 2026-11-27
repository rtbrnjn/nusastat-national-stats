// Compact inline SVG sparkline for KPI cards

import { esc } from './ui.js';

export function sparklineSvg(values, stroke = '#16425b') {
  if (!values || values.length < 2) return '';
  const w = 180;
  const h = 20;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, idx) => {
    const x = (idx / (values.length - 1)) * (w - 8) + 4;
    const y = h - 3 - ((v - min) / span) * (h - 6);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = pts[pts.length - 1].split(',');
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" aria-hidden="true" style="height:20px">
    <polyline fill="none" stroke="${esc(stroke)}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" points="${pts.join(' ')}" />
    <circle cx="${last[0]}" cy="${last[1]}" r="2.5" fill="${esc(stroke)}" />
  </svg>`;
}
