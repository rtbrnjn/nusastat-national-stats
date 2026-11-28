// Choropleth SVG map renderer for the Indonesian archipelago (6 macro-regions, 38 provincial pins, active callout)

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
  lang = 'en',
}) {
  const isId = lang === 'id';
  const vals = macroRegions.map((r) => r[metricKey]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const ramp = invertScale ? POVERTY_PALETTE : PALETTE;

  const islandsSvg = macroRegions
    .map((reg) => {
      const d = ARCHIPELAGO_PATHS[reg.id];
      const fill = choroplethColor(reg[metricKey], min, max, invertScale);
      const isSelected = reg.id === activeRegionId;
      const rName = isId && reg.nameId ? reg.nameId : reg.name;
      return `<g class="map-island ${isSelected ? 'active' : ''}" tabindex="0" role="button" aria-label="${esc(rName)}" data-map-region="${esc(reg.id)}" data-tip="${esc(rName)} (${reg.provincesCount} prov.): ${esc(metricLabel)} ${esc(metricFormat(reg[metricKey]))}">
        <path d="${d}" fill="${fill}" stroke="${isSelected ? '#121820' : '#4b5563'}" stroke-width="${isSelected ? '1.8' : '0.85'}" stroke-linejoin="round" />
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
      const halo = selected ? `<circle cx="${p.x}" cy="${p.y}" r="8.2" fill="none" stroke="#9e2a2b" stroke-width="1.3" opacity="0.7" pointer-events="none" />` : '';
      return `${halo}<circle cx="${p.x}" cy="${p.y}" r="${selected ? 4.8 : 3.2}" fill="${selected ? '#9e2a2b' : fill}" stroke="#ffffff" stroke-width="${selected ? 1.7 : 0.85}" data-prov-pin="${esc(p.code)}" data-tip="${esc(p.name)}: ${esc(metricFormat(p[metricKey]))}" style="cursor:pointer" />`;
    })
    .join('');

  const activeProv = provinces.find((p) => p.code === activeProvCode);
  let calloutSvg = '';
  if (activeProv) {
    const labelTxt = `${activeProv.name} · ${metricFormat(activeProv[metricKey])}`;
    const boxW = Math.max(92, labelTxt.length * 5.2 + 14);
    const onLeft = activeProv.x > 540;
    const bx = Math.max(8, Math.min(752 - boxW, onLeft ? activeProv.x - boxW - 12 : activeProv.x + 12));
    const by = Math.max(8, Math.min(218, activeProv.y < 145 ? activeProv.y + 10 : activeProv.y - 28));
    const lx = onLeft ? bx + boxW : bx;
    calloutSvg = `<g pointer-events="none">
      <line x1="${activeProv.x}" y1="${activeProv.y}" x2="${lx}" y2="${by + 9}" stroke="#9e2a2b" stroke-width="1" stroke-dasharray="2 2" />
      <rect x="${bx}" y="${by}" width="${boxW}" height="18" rx="3" fill="#121820" stroke="#9e2a2b" stroke-width="1" />
      <text x="${bx + boxW / 2}" y="${by + 12}" font-size="8" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(labelTxt)}</text>
    </g>`;
  }

  const labelsSvg = REGION_LABELS.map(
    (l) =>
      `<text x="${l.x}" y="${l.y}" font-size="8.2" font-weight="800" letter-spacing="0.06em" fill="#1e293b" stroke="#ebf1f5" stroke-width="2.6" paint-order="stroke" text-anchor="middle" pointer-events="none">${l.text}</text>`,
  ).join('');

  return `<div class="chart-wrap">
    <div class="chart-tooltip"></div>
    <svg class="chart-svg" viewBox="0 0 760 248" role="img" aria-label="Choropleth vector map of Indonesia's 38 provinces">
      <rect x="0" y="0" width="760" height="248" rx="7" fill="#ebf1f5" stroke="#d6cfc2" />
      <line x1="0" y1="90" x2="760" y2="90" stroke="#d4e0e8" stroke-dasharray="4 4" />
      <text x="12" y="86" font-size="7.8" fill="#64748b">${isId ? '0° Khatulistiwa' : '0° Equator'}</text>
      <text x="12" y="238" font-size="7.8" fill="#4b5563">${isId ? 'Klik wilayah pulau atau titik 38 provinsi · BPS Neraca Regional 2025' : 'Click an island region or any of the 38 provincial pins · BPS Regional Accounts 2025'}</text>
      ${islandsSvg}
      <path d="${INTERNAL_BORDERS}" fill="none" stroke="rgba(255,255,255,0.46)" stroke-width="0.72" stroke-dasharray="2.5 2" pointer-events="none" />
      ${pinsSvg}
      ${labelsSvg}
      ${calloutSvg}
    </svg>
    <div class="scale-bar">
      <span>${isId ? 'Rendah' : 'Low'} (${esc(metricFormat(min))})</span>
      <span class="scale-swatches">${ramp.map((c) => `<span style="background:${c}"></span>`).join('')}</span>
      <span>${isId ? 'Tinggi' : 'High'} (${esc(metricFormat(max))})</span>
    </div>
  </div>`;
}
