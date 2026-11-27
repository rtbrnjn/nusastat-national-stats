// Real vector SVG choropleth map of the Indonesian archipelago (6 macro-regions + 38 provincial pins)

import { esc } from './ui.js';

export const ARCHIPELAGO_PATHS = {
  sumatra:
    'M 34 36 L 52 24 L 78 44 L 106 66 L 136 92 L 154 114 L 166 138 L 164 162 L 146 172 L 128 158 L 108 134 L 84 106 L 58 78 L 38 56 Z M 170 124 L 182 120 L 188 130 L 176 136 Z M 192 134 L 204 132 L 206 142 L 194 144 Z',
  java:
    'M 164 186 L 196 184 L 246 190 L 294 196 L 330 202 L 336 212 L 306 214 L 252 208 L 194 202 L 162 196 Z M 310 190 L 332 188 L 336 195 L 314 196 Z',
  kalimantan:
    'M 244 76 L 278 52 L 318 48 L 348 64 L 368 88 L 364 116 L 342 138 L 314 144 L 282 142 L 252 132 L 236 112 L 234 90 Z',
  sulawesi:
    'M 404 72 L 432 62 L 464 64 L 478 74 L 464 82 L 436 82 L 424 96 L 448 106 L 464 126 L 452 136 L 434 118 L 418 122 L 426 148 L 412 154 L 398 136 L 394 110 L 392 86 Z',
  'bali-nt':
    'M 344 204 L 364 202 L 368 212 L 346 214 Z M 374 205 L 394 204 L 396 214 L 374 214 Z M 402 206 L 436 205 L 438 216 L 404 216 Z M 446 206 L 486 204 L 488 214 L 448 216 Z M 440 220 L 466 220 L 468 230 L 442 230 Z M 482 222 L 516 214 L 520 226 L 484 234 Z',
  'maluku-papua':
    'M 516 74 L 534 66 L 542 82 L 532 96 L 546 106 L 534 114 L 518 102 Z M 506 130 L 538 124 L 542 136 L 510 140 Z M 574 108 L 606 100 L 626 114 L 656 122 L 716 134 L 732 154 L 732 202 L 702 198 L 668 184 L 636 164 L 602 150 L 580 132 Z',
};

const PALETTE = ['#d9e4ec', '#9cb8cc', '#5b8aa8', '#2a6284', '#16425b'];
const POVERTY_PALETTE = ['#ecfdf5', '#fed7aa', '#fb923c', '#dc2626', '#9e2a2b'];

export function choroplethColor(value, min, max, invertRisk = false) {
  const ramp = invertRisk ? POVERTY_PALETTE : PALETTE;
  const t = max === min ? 0.5 : Math.max(0, Math.min(1, (value - min) / (max - min)));
  const idx = Math.min(ramp.length - 1, Math.floor(t * ramp.length));
  return ramp[idx];
}

export function renderArchipelagoMap({
  macroRegions,
  provinces,
  metricKey,
  metricLabel,
  metricFormat,
  invertScale = false,
  activeRegionId,
  activeProvCode,
}) {
  const vals = macroRegions.map((r) => r[metricKey]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const ramp = invertScale ? POVERTY_PALETTE : PALETTE;

  const islandsSvg = macroRegions
    .map((reg) => {
      const d = ARCHIPELAGO_PATHS[reg.id];
      const fill = choroplethColor(reg[metricKey], min, max, invertScale);
      const isSelected = reg.id === activeRegionId;
      return `<g class="map-island ${isSelected ? 'active' : ''}" tabindex="0" role="button" aria-label="Select ${esc(reg.name)} macro-region" data-map-region="${esc(reg.id)}" data-tip="${esc(reg.name)} (${reg.provincesCount} prov.): ${esc(metricLabel)} ${esc(metricFormat(reg[metricKey]))}">
        <path d="${d}" fill="${fill}" stroke="${isSelected ? '#121820' : '#4b5563'}" stroke-width="${isSelected ? '2.2' : '0.95'}" stroke-linejoin="round" />
      </g>`;
    })
    .join('');

  const pVals = provinces.map((p) => p[metricKey]);
  const pMin = Math.min(...pVals);
  const pMax = Math.max(...pVals);

  const pinsSvg = provinces
    .map((p) => {
      const selected = p.code === activeProvCode;
      const fill = choroplethColor(p[metricKey], pMin, pMax, invertScale);
      return `<circle class="prov-pin" cx="${p.x}" cy="${p.y}" r="${selected ? 5.6 : 3.6}" fill="${selected ? '#9e2a2b' : fill}" stroke="#ffffff" stroke-width="${selected ? 1.8 : 1}" data-prov-pin="${esc(p.code)}" data-tip="${esc(p.name)}: ${esc(metricFormat(p[metricKey]))}" style="cursor:pointer" />`;
    })
    .join('');

  const labelsSvg = [
    { x: 64, y: 122, t: 'SUMATRA' },
    { x: 244, y: 224, t: 'JAVA' },
    { x: 300, y: 40, t: 'KALIMANTAN' },
    { x: 432, y: 168, t: 'SULAWESI' },
    { x: 428, y: 244, t: 'BALI & NUSA TENGGARA' },
    { x: 648, y: 94, t: 'MALUKU & PAPUA' },
  ]
    .map(
      (l) =>
        `<text x="${l.x}" y="${l.y}" font-size="8.6" font-weight="800" letter-spacing="0.06em" fill="#1e293b" stroke="#ebf1f5" stroke-width="2.6" paint-order="stroke" text-anchor="middle" pointer-events="none">${l.t}</text>`,
    )
    .join('');

  return `<div class="chart-wrap">
    <div class="chart-tooltip"></div>
    <svg class="chart-svg" viewBox="0 0 760 254" role="img" aria-label="Choropleth vector map of Indonesia's 38 provinces">
      <rect x="0" y="0" width="760" height="254" rx="8" fill="#ebf1f5" stroke="#d6cfc2" />
      <line x1="0" y1="132" x2="760" y2="132" stroke="#d4e0e8" stroke-dasharray="4 4" />
      <text x="12" y="128" font-size="8" fill="#64748b">0° Equator</text>
      <text x="14" y="244" font-size="8.2" fill="#4b5563">Click an island region or any of the 38 provincial nodes · Source: BPS Regional Accounts 2025</text>
      ${islandsSvg}
      ${pinsSvg}
      ${labelsSvg}
    </svg>
    <div class="scale-bar">
      <span>Low (${esc(metricFormat(min))})</span>
      <span class="scale-swatches">${ramp.map((c) => `<span style="background:${c}"></span>`).join('')}</span>
      <span>High (${esc(metricFormat(max))})</span>
    </div>
  </div>`;
}
