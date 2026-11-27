// Editorial SVG chart primitives with inline callout annotations and hover tooltips

import { esc } from './ui.js';

export function sparklineSvg(values, stroke = '#16425b') {
  if (!values || values.length < 2) return '';
  const w = 180;
  const h = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, idx) => {
    const x = (idx / (values.length - 1)) * (w - 8) + 4;
    const y = h - 4 - ((v - min) / span) * (h - 8);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const last = pts[pts.length - 1].split(',');
  return `<svg class="chart-svg" viewBox="0 0 ${w} ${h}" aria-hidden="true" style="height:24px">
    <polyline fill="none" stroke="${esc(stroke)}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" points="${pts.join(' ')}" />
    <circle cx="${last[0]}" cy="${last[1]}" r="2.7" fill="${esc(stroke)}" />
  </svg>`;
}

export function lineChartSvg({ labels, series, unit = '%', height = 210, annotations = [] }) {
  const width = 620;
  const padL = 46;
  const padR = 18;
  const padT = 22;
  const padB = 30;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;

  const allValues = series.flatMap((s) => s.values);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const minVal = rawMin < 0 ? Math.floor(rawMin - 0.6) : 0;
  const maxVal = Math.ceil((rawMax + Math.max(0.5, (rawMax - minVal) * 0.14)) * 10) / 10 || 1;
  const span = maxVal - minVal || 1;

  const xAt = (i) => padL + (labels.length <= 1 ? plotW / 2 : (i / (labels.length - 1)) * plotW);
  const yAt = (v) => padT + plotH - ((v - minVal) / span) * plotH;

  let grid = '';
  const ticks = 4;
  for (let t = 0; t <= ticks; t++) {
    const val = minVal + (span * t) / ticks;
    const y = yAt(val).toFixed(1);
    grid += `<line x1="${padL}" y1="${y}" x2="${width - padR}" y2="${y}" stroke="#e5dfd5" stroke-dasharray="${t === 0 ? '' : '2 3'}" />`;
    grid += `<text x="${padL - 7}" y="${Number(y) + 3.5}" text-anchor="end" font-size="10.5" fill="#4b5563">${val.toFixed(1)}${esc(unit)}</text>`;
  }
  if (minVal < 0 && maxVal > 0) {
    const y0 = yAt(0).toFixed(1);
    grid += `<line x1="${padL}" y1="${y0}" x2="${width - padR}" y2="${y0}" stroke="#9ca3af" stroke-width="1.1" />`;
  }

  const labelStep = Math.max(1, Math.ceil(labels.length / 7));
  const xLabels = labels
    .map((lbl, idx) => {
      if (idx % labelStep !== 0 && idx !== labels.length - 1) return '';
      return `<text x="${xAt(idx).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="10.5" fill="#4b5563">${esc(lbl)}</text>`;
    })
    .join('');

  const paths = series
    .map((s) => {
      const coords = s.values.map((v, i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`);
      const area = `${padL},${padT + plotH} ${coords.join(' ')} ${xAt(s.values.length - 1).toFixed(1)},${padT + plotH}`;
      const dots = s.values
        .map(
          (v, i) =>
            `<circle cx="${xAt(i).toFixed(1)}" cy="${yAt(v).toFixed(1)}" r="3.4" fill="${esc(s.color)}" stroke="#fff" stroke-width="1.2" data-tip="${esc(labels[i])} · ${esc(s.name)}: ${v}${esc(unit)}" />`,
        )
        .join('');
      return `
        ${s.area ? `<polygon points="${area}" fill="${esc(s.color)}" opacity="0.08" />` : ''}
        <polyline fill="none" stroke="${esc(s.color)}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" points="${coords.join(' ')}" />
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
      const tx = Math.min(width - 96, Math.max(padL + 40, x + (ann.dx ?? 0)));
      const ty = Math.max(14, Math.min(height - 34, y + (ann.dy ?? -18)));
      return `<g>
        <line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${(ty + 4).toFixed(1)}" stroke="#4b5563" stroke-width="1" stroke-dasharray="2 2" />
        <rect x="${(tx - 46).toFixed(1)}" y="${(ty - 10).toFixed(1)}" width="92" height="16" rx="3" fill="#fffdf9" stroke="${esc(s.color)}" stroke-width="1" />
        <text x="${tx.toFixed(1)}" y="${(ty + 1.5).toFixed(1)}" text-anchor="middle" font-size="9.2" font-weight="700" fill="#121820">${esc(ann.label)}</text>
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

export function horizontalBarsSvg({ items, valueSuffix = '%', maxVal = null }) {
  const width = 560;
  const rowH = 29;
  const padL = 188;
  const padR = 54;
  const height = items.length * rowH + 8;
  const top = maxVal ?? Math.max(...items.map((i) => Math.abs(i.value)), 1);
  const barMaxW = width - padL - padR;

  const rows = items
    .map((item, idx) => {
      const y = idx * rowH + 5;
      const bw = Math.max(4, (Math.abs(item.value) / top) * barMaxW);
      const fill = item.color || '#16425b';
      return `<g data-tip="${esc(item.label)}: ${item.value}${esc(valueSuffix)}${item.sub ? ` (${esc(item.sub)})` : ''}">
        <text x="${padL - 8}" y="${y + 14}" text-anchor="end" font-size="11.2" fill="#121820" font-weight="600">${esc(item.label)}</text>
        <rect x="${padL}" y="${y + 3}" width="${barMaxW}" height="15" rx="3" fill="#f0ebe1" />
        <rect x="${padL}" y="${y + 3}" width="${bw.toFixed(1)}" height="15" rx="3" fill="${esc(fill)}" />
        <text x="${(padL + bw + 6).toFixed(1)}" y="${y + 14}" font-size="10.8" fill="#121820" font-weight="700">${item.value}${esc(valueSuffix)}</text>
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

export function pyramidSvg(cohorts) {
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
      return `<g data-tip="Age ${esc(c.age)}: Male ${c.male}% · Female ${c.female}%">
        <text x="${midX}" y="${y + 10}" text-anchor="middle" font-size="9.8" fill="#121820" font-weight="700">${esc(c.age)}</text>
        <rect x="${(midX - gap - mw).toFixed(1)}" y="${y + 1.5}" width="${mw.toFixed(1)}" height="10.5" rx="2" fill="#16425b" />
        <rect x="${(midX + gap).toFixed(1)}" y="${y + 1.5}" width="${fw.toFixed(1)}" height="10.5" rx="2" fill="#9e2a2b" />
      </g>`;
    })
    .join('');

  return `<div class="chart-wrap">
    <div class="chart-tooltip"></div>
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Population pyramid by age cohort">
      <text x="${midX - gap - 8}" y="12" text-anchor="end" font-size="10.5" font-weight="700" fill="#16425b">Male (%)</text>
      <text x="${midX + gap + 8}" y="12" text-anchor="start" font-size="10.5" font-weight="700" fill="#9e2a2b">Female (%)</text>
      ${bars}
    </svg>
  </div>`;
}

export function bindChartTooltips(root) {
  root.querySelectorAll('.chart-wrap').forEach((wrap) => {
    const tip = wrap.querySelector('.chart-tooltip');
    if (!tip) return;
    wrap.querySelectorAll('[data-tip]').forEach((el) => {
      el.addEventListener('mouseenter', (ev) => {
        tip.textContent = el.getAttribute('data-tip') || '';
        const rect = wrap.getBoundingClientRect();
        const x = Math.min(rect.width - 185, Math.max(8, ev.clientX - rect.left + 10));
        const y = Math.max(4, ev.clientY - rect.top - 26);
        tip.style.left = `${x}px`;
        tip.style.top = `${y}px`;
        tip.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        tip.style.opacity = '0';
      });
    });
  });
}
