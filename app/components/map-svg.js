// Choropleth SVG map renderer for the Indonesian archipelago (6 macro-regions + 38 provincial pins)

import { ARCHIPELAGO_PATHS, INTERNAL_BORDERS, REGION_LABELS } from '../data/archipelago-paths.js';
import { esc } from './ui.js';

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
        <path d="${d}" fill="${fill}" stroke="${isSelected ? '#121820' : '#4b5563'}" stroke-width="${isSelected ? '2' : '0.9'}" stroke-linejoin="round" />
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
      return `<circle cx="${p.x}" cy="${p.y}" r="${selected ? 5.2 : 3.4}" fill="${selected ? '#9e2a2b' : fill}" stroke="#ffffff" stroke-width="${selected ? 1.8 : 0.9}" data-prov-pin="${esc(p.code)}" data-tip="${esc(p.name)}: ${esc(metricFormat(p[metricKey]))}" style="cursor:pointer" />`;
    })
    .join('');

  const labelsSvg = REGION_LABELS.map(
    (l) =>
      `<text x="${l.x}" y="${l.y}" font-size="8.4" font-weight="800" letter-spacing="0.06em" fill="#1e293b" stroke="#ebf1f5" stroke-width="2.6" paint-order="stroke" text-anchor="middle" pointer-events="none">${l.text}</text>`,
  ).join('');

  return `<div class="chart-wrap">
    <div class="chart-tooltip"></div>
    <svg class="chart-svg" viewBox="0 0 760 248" role="img" aria-label="Choropleth vector map of Indonesia's 38 provinces">
      <rect x="0" y="0" width="760" height="248" rx="7" fill="#ebf1f5" stroke="#d6cfc2" />
      <line x1="0" y1="90" x2="760" y2="90" stroke="#d4e0e8" stroke-dasharray="4 4" />
      <text x="12" y="86" font-size="7.8" fill="#64748b">0° Equator</text>
      <text x="12" y="238" font-size="8" fill="#4b5563">Click an island region or any of the 38 provincial pins · BPS Regional Accounts 2025</text>
      ${islandsSvg}
      <path d="${INTERNAL_BORDERS}" fill="none" stroke="rgba(255,255,255,0.48)" stroke-width="0.75" stroke-dasharray="2.5 2" pointer-events="none" />
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
