// Interactive Personal CPI & Purchasing-Power Calculator (COICOP 2025 basket + 38 Provincial UMP)

import { UMP_2025_PROVINCES } from '../data/ump-2025.js';
import { esc, fmtNum } from './ui.js';

const NATIONAL_WEIGHTS = { food: 34, housing: 26, transport: 18, healthEdu: 22 };
const GROUP_RATES = { food: 3.84, housing: 1.15, transport: 0.96, healthEdu: 2.75 };

export function createCpiCalculatorState() {
  return {
    provCode: 'ID-JK',
    weights: { ...NATIONAL_WEIGHTS },
  };
}

export function renderCpiCalculator(state, lang = 'en') {
  const isId = lang === 'id';
  const prov = UMP_2025_PROVINCES.find((p) => p.code === state.provCode) || UMP_2025_PROVINCES[0];
  const w = state.weights;
  const totalW = Math.max(1, w.food + w.housing + w.transport + w.healthEdu);

  const shares = {
    food: Math.round((w.food / totalW) * 100),
    housing: Math.round((w.housing / totalW) * 100),
    transport: Math.round((w.transport / totalW) * 100),
    healthEdu: Math.max(0, 100 - Math.round((w.food / totalW) * 100) - Math.round((w.housing / totalW) * 100) - Math.round((w.transport / totalW) * 100)),
  };

  const rawRate =
    (w.food * GROUP_RATES.food +
      w.housing * GROUP_RATES.housing +
      w.transport * GROUP_RATES.transport +
      w.healthEdu * GROUP_RATES.healthEdu) /
    totalW;
  const personalRate = rawRate * prov.localCpiFactor;
  const diffVsNat = personalRate - 2.42;
  const realWageLossIdrK = Math.round(prov.umpIdrM * 1000 * (personalRate / 100));

  const sliders = [
    { key: 'food', label: isId ? 'Pangan & Beras (+3.84%)' : 'Food & Rice (+3.84%)', share: shares.food },
    { key: 'housing', label: isId ? 'Perumahan & Listrik (+1.15%)' : 'Housing & Power (+1.15%)', share: shares.housing },
    { key: 'transport', label: isId ? 'Transport & BBM (+0.96%)' : 'Transport & Fuel (+0.96%)', share: shares.transport },
    { key: 'healthEdu', label: isId ? 'Kesehatan & Pendidikan (+2.75%)' : 'Health & Education (+2.75%)', share: shares.healthEdu },
  ];

  const provOptions = UMP_2025_PROVINCES.map(
    (p) => `<option value="${esc(p.code)}" ${p.code === prov.code ? 'selected' : ''}>${esc(p.name)} (UMP Rp ${fmtNum(p.umpIdrM, 2)}${isId ? ' jt' : 'M'})</option>`,
  ).join('');

  return `<article class="panel" id="cpi-calculator">
    <div class="panel-head">
      <div>
        <h2 class="panel-title">${isId ? 'Kalkulator IHK Pribadi & Daya Beli UMP' : 'Personal CPI & Purchasing-Power Calculator'}</h2>
        <p class="panel-sub">${isId ? 'Sesuaikan bobot belanja & pilih UMP 38 provinsi (2025)' : 'Adjust household weights & benchmark against 38 provincial UMPs (2025)'}</p>
      </div>
      <button type="button" class="btn btn-outline" id="cpi-reset">${isId ? 'Reset BPS' : 'Reset'}</button>
    </div>

    <div class="controls-bar" style="margin-bottom:5px">
      <select class="control-select" id="cpi-prov" aria-label="${isId ? 'UMP Provinsi 2025' : 'Province UMP 2025'}" style="width:100%">${provOptions}</select>
    </div>

    <div class="calc-grid">
      ${sliders
        .map(
          (s) => `<label class="calc-row">
            <span>${esc(s.label)}</span>
            <strong>${s.share}%</strong>
            <input type="range" min="5" max="70" value="${w[s.key]}" data-cpi-slider="${s.key}">
          </label>`,
        )
        .join('')}
    </div>

    <div class="calc-result">
      <div class="calc-stat">
        <small>${isId ? 'IHK Pribadi' : 'Personal CPI'}</small>
        <strong style="color:#9e2a2b">${fmtNum(personalRate, 2)}%</strong>
      </div>
      <div class="calc-stat">
        <small>${isId ? 'Selisih vs Nas.' : 'vs. Nat. 2.42%'}</small>
        <strong>${diffVsNat >= 0 ? '+' : ''}${fmtNum(diffVsNat, 2)} pp</strong>
      </div>
      <div class="calc-stat">
        <small>${isId ? 'Beban Riil/Bln' : 'Monthly Erosion'}</small>
        <strong>Rp ${realWageLossIdrK.toLocaleString('en-US')}k</strong>
      </div>
    </div>
  </article>`;
}

export function bindCpiCalculator(root, state, onChange) {
  root.querySelector('#cpi-prov')?.addEventListener('change', (ev) => {
    state.provCode = ev.target.value;
    onChange();
  });
  root.querySelectorAll('[data-cpi-slider]').forEach((inp) => {
    inp.addEventListener('input', (ev) => {
      state.weights[ev.target.dataset.cpiSlider] = Number(ev.target.value);
      onChange();
    });
  });
  root.querySelector('#cpi-reset')?.addEventListener('click', () => {
    state.provCode = 'ID-JK';
    state.weights = { ...NATIONAL_WEIGHTS };
    onChange();
  });
}
