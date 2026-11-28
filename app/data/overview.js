// Headline national KPIs, quarterly macro & monetary series, sectoral GDP shares, and macro-region summary (BPS & BI 2025)

export const NATIONAL_KPIS = [
  {
    id: 'population',
    code: 'DEM-01',
    label: { en: 'Resident Population', id: 'Jumlah Penduduk' },
    value: '284.4M',
    delta: { en: '+1.08% YoY', id: '+1,08% YoY' },
    tone: 'neutral',
    source: 'BPS · SP2020/SUPAS',
    year: '2025',
    spark: [270.2, 273.3, 276.4, 279.1, 281.6, 284.4],
    route: '#/demographics',
  },
  {
    id: 'gdp-growth',
    code: 'ECO-01',
    label: { en: 'Real GDP Growth', id: 'Pertumbuhan PDB Riil' },
    value: '5.11%',
    delta: { en: '$1.44T nominal', id: 'US$1,44T nominal' },
    tone: 'good',
    source: { en: 'BPS · National Accounts', id: 'BPS · Neraca Nasional' },
    year: 'FY 2025',
    spark: [-2.07, 3.70, 5.31, 5.05, 5.03, 5.11],
    route: '#/economy',
  },
  {
    id: 'cpi',
    code: 'PRC-01',
    label: { en: 'Headline CPI Inflation', id: 'Inflasi IHK Umum' },
    value: '2.42%',
    delta: { en: 'Target 2.5±1%', id: 'Sasaran 2,5±1%' },
    tone: 'good',
    source: { en: 'BPS · 90-City Survey', id: 'BPS · Survei 90 Kota' },
    year: { en: 'Dec 2025', id: 'Des 2025' },
    spark: [1.68, 1.87, 5.51, 2.61, 1.57, 2.42],
    route: '#/economy',
  },
  {
    id: 'unemployment',
    code: 'LAB-01',
    label: { en: 'Unemployment Rate', id: 'Tingkat Pengangguran' },
    value: '4.74%',
    delta: { en: 'Poverty 8.57%', id: 'Kemiskinan 8,57%' },
    tone: 'signal',
    source: 'BPS · SAKERNAS',
    year: { en: 'Aug 2025', id: 'Agu 2025' },
    spark: [7.07, 6.49, 5.86, 5.32, 4.91, 4.74],
    route: '#/demographics',
  },
];

export const QUARTERLY_MACRO = [
  { period: '2021 Q1', gdpGrowth: -0.70, cpi: 1.37, biRate: 3.50, fxIdrK: 14.3 },
  { period: '2021 Q3', gdpGrowth: 3.51, cpi: 1.60, biRate: 3.50, fxIdrK: 14.3 },
  { period: '2022 Q1', gdpGrowth: 5.02, cpi: 2.64, biRate: 3.50, fxIdrK: 14.4 },
  { period: '2022 Q3', gdpGrowth: 5.73, cpi: 5.95, biRate: 4.25, fxIdrK: 15.0 },
  { period: '2023 Q1', gdpGrowth: 5.04, cpi: 4.97, biRate: 5.75, fxIdrK: 15.1 },
  { period: '2023 Q3', gdpGrowth: 4.94, cpi: 2.28, biRate: 5.75, fxIdrK: 15.4 },
  { period: '2024 Q1', gdpGrowth: 5.11, cpi: 3.05, biRate: 6.00, fxIdrK: 15.8 },
  { period: '2024 Q3', gdpGrowth: 4.95, cpi: 1.84, biRate: 6.00, fxIdrK: 15.5 },
  { period: '2025 Q1', gdpGrowth: 4.98, cpi: 1.65, biRate: 5.75, fxIdrK: 16.1 },
  { period: '2025 Q2', gdpGrowth: 5.12, cpi: 1.98, biRate: 5.75, fxIdrK: 16.0 },
  { period: '2025 Q3', gdpGrowth: 5.08, cpi: 2.24, biRate: 5.50, fxIdrK: 15.8 },
  { period: '2025 Q4', gdpGrowth: 5.26, cpi: 2.42, biRate: 5.50, fxIdrK: 15.7 },
];

export const SECTOR_GDP_SHARE = [
  { label: 'Manufacturing (KBLI C)', labelId: 'Industri Pengolahan (C)', share: 19.2, growth: 4.8, color: '#16425b' },
  { label: 'Wholesale & Retail Trade', labelId: 'Perdagangan Besar/Eceran', share: 13.1, growth: 4.9, color: '#2a6284' },
  { label: 'Agriculture & Fisheries', labelId: 'Pertanian & Perikanan', share: 12.6, growth: 3.1, color: '#0f766e' },
  { label: 'Construction', labelId: 'Konstruksi', share: 10.1, growth: 6.2, color: '#b45309' },
  { label: 'Mining & Quarrying', labelId: 'Pertambangan & Penggalian', share: 9.8, growth: 4.5, color: '#9e2a2b' },
  { label: 'ICT & Financial Services', labelId: 'Jasa TIK & Keuangan', share: 9.2, growth: 7.4, color: '#475569' },
];

export const MACRO_REGION_SUMMARY = [
  { id: 'java', name: 'Java', nameId: 'Jawa', shareGdp: 57.1, popMillions: 158.2, growth: 5.18, hdi: 76.4 },
  { id: 'sumatra', name: 'Sumatra', nameId: 'Sumatra', shareGdp: 22.1, popMillions: 62.4, growth: 4.79, hdi: 74.1 },
  { id: 'kalimantan', name: 'Kalimantan', nameId: 'Kalimantan', shareGdp: 8.3, popMillions: 17.6, growth: 5.44, hdi: 73.6 },
  { id: 'sulawesi', name: 'Sulawesi', nameId: 'Sulawesi', shareGdp: 7.1, popMillions: 20.9, growth: 6.12, hdi: 72.8 },
  { id: 'bali-nt', name: 'Bali & Nusa Tenggara', nameId: 'Bali & Nusa Tenggara', shareGdp: 2.8, popMillions: 15.8, growth: 5.25, hdi: 71.9 },
  { id: 'maluku-papua', name: 'Maluku & Papua', nameId: 'Maluku & Papua', shareGdp: 2.6, popMillions: 9.5, growth: 6.45, hdi: 66.8 },
];
