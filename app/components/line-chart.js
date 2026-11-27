// Multi-series SVG line/area chart with hairline gridlines, zero baseline, and inline callout annotations

import { esc } from './ui.js';

export function lineChartSvg({ labels, series, unit = '%', height = 185, annotations = [] }) {
  const width = 600;
  const padL = 44;
  const padR = 16;
  const padT = 20;
  const padB = 26;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const allValues = series.flatMap((s) => s.values);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const minVal = rawMin < 0 ? Math.floor(rawMin - 0.6) : 0;
  const maxVal = Math.ceil((rawMax + Math.max(0.5, (rawMax - minVal) * 0.15)) * 10) / 10 || 1;
  const span = maxVal - minVal || 1;

  const xAt = (i) => padL + (labels.length <= 1 ? plotW / 2 : (i / (labels.length - 1)) * plotW);
  const yAt = (v) => padT + plotH - ((v - minVal) / span) * plotH;

  let grid = '';
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const val = minVal + (span * t) / ticks;
    const y = yAt(val).toFixed(1);
    grid += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#e5dfd5" stroke-dasharray="${t === 0 ? '' : '2 3'}" />`;
    grid += `<text x="${padL - 6}" y="${Number(y) + 3.5}" text-anchor="end" font-size="10" fill="#4b5563">${val.toFixed(1)}${esc(unit)}</text>`;
  }
  if (minVal < 0 && maxVal > 0) {
    const y0 = yAt(0).toFixed(1);
    grid += `<line x1="${padL}" y1="${y0}" x2="${width - padR}" y2="${y0}" stroke="#9ca3af" stroke-width="1" />`;
  }

  const labelStep = Math.max(1, Math.ceil(labels.length / 7));
  const xLabels = labels
    .map((lbl, idx) => {
      if (idx % labelStep !== 0 && idx !== labels.length - 1) return '';
      return `<text x="${xAt(idx).toFixed(1)}" y="${height - 7}" text-anchor="middle" font-size="10" fill="#4b5563">${esc(lbl)}</text>`;
    })
    .join('');

  const paths = series
    .map((s) => {
      const coords = s.values.map((v, i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`);
      const area = `${padL},${padT + plotH} ${coords.join(' ')} ${xAt(s.values.length - 1).toFixed(1)},${padT + plotH}`;
      const dots = s.values
        .map(
          (v, i) =>
            `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(v).toFixed(1)}" r="3.2" fill="${esc(s.color)}" stroke="#fff" stroke-width="1.2" data-tip="${esc(labels[i])} · ${esc(s.name)}: ${v}${esc(unit)}" />`,
        )
        .join('');
      return `
        ${s.area ? `<polygon points="${area}" fill="${esc(s.color)}" opacity="0.08" />` : ''}
        <polyline fill="none" stroke="${esc(s.color)}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" points="${coords.join(' ')}" />
        ${dots}
      `;
    })
    .join('');

  const callouts = annotations
    .map((ann) => {
      const s = series[ann.seriesIdx ?? 0];
      if (!s || ann.index >= s.values.length) return '';
      const x = xAt(ann.index);
      const y = yAt(s.values[ann.index]);
      const tx = Math.min(width - 88, Math.max(padL + 42, x + (ann.dx ?? 0)));
      const ty = Math.max(13, Math.min(height - 30, y + (ann.dy ?? -16)));
      return `<g>
        <line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${(ty + 4).toFixed(1)}" stroke="#4b5563" stroke-width="1" stroke-dasharray="2 2" />
        <rect x="${(tx - 44).toFixed(1)}" y="${(ty - 9).toFixed(1)}" width="88" height="15" rx="3" fill="#fffdf9" stroke="${esc(s.color)}" stroke-width="1" />
        <text x="${tx.toFixed(1)}" y="${(ty + 1.5).toFixed(1)}" text-anchor="middle" font-size="8.9" font-weight="700" fill="#121820">${esc(ann.label)}</text>
      </g>`;
    })
    .join('');

  const legend = series
    .map(
      (s) =>
        `<span class="legend-item"><span class="legend-swatch" style="background:${esc(s.color)}"></span>${esc(s.name)}</span>`,
    )
    .join('');

  return `<div class="chart-wrap">
    <div class="chart-tooltip"></div>
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Time series chart">
      ${grid}
      ${xLabels}
      ${paths}
      ${callouts}
    </svg>
    <div class="chart-legend">${legend}</div>
  </div>`;
}
