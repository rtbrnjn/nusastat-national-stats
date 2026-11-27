// National overview dataset (BPS-Statistics Indonesia, Bank Indonesia, Ministry of Finance 2025/2026)

export const NATIONAL_KPIS = [
  {
    id: 'population',
    code: 'DEM-01',
    label: 'Resident Population',
    value: '284.4M',
    delta: '+1.08% YoY',
    tone: 'neutral',
    source: 'BPS · SP2020/SUPAS',
    year: '2025',
    spark: [270.2, 273.3, 276.4, 279.1, 281.6, 284.4],
    route: '#/demographics',
  },
  {
    id: 'gdp-growth',
    code: 'ECO-01',
    label: 'Real GDP Growth',
    value: '5.11%',
    delta: '$1.44T nominal',
    tone: 'good',
    source: 'BPS · National Accounts',
    year: 'FY 2025',
    spark: [-2.07, 3.70, 5.31, 5.05, 5.03, 5.11],
    route: '#/economy',
  },
  {
    id: 'cpi',
    code: 'PRC-01',
    label: 'Headline CPI Inflation',
    value: '2.42%',
    delta: 'Target 2.5±1%',
    tone: 'good',
    source: 'BPS · 90-City Survey',
    year: 'Dec 2025',
    spark: [1.68, 1.87, 5.51, 2.61, 1.57, 2.42],
    route: '#/economy',
  },
  {
    id: 'unemployment',
    code: 'LAB-01',
    label: 'Unemployment Rate',
    value: '4.74%',
    delta: 'Poverty 8.57%',
    tone: 'signal',
    source: 'BPS · SAKERNAS',
    year: 'Aug 2025',
    spark: [7.07, 6.49, 5.86, 5.32, 4.91, 4.74],
    route: '#/demographics',
  },
];

export const QUARTERLY_MACRO = [
  { period: '2021 Q1', gdpGrowth: -0.70, cpi: 1.37 },
  { period: '2021 Q3', gdpGrowth: 3.51, cpi: 1.60 },
  { period: '2022 Q1', gdpGrowth: 5.02, cpi: 2.64 },
  { period: '2022 Q3', gdpGrowth: 5.73, cpi: 5.95 },
  { period: '2023 Q1', gdpGrowth: 5.04, cpi: 4.97 },
  { period: '2023 Q3', gdpGrowth: 4.94, cpi: 2.28 },
  { period: '2024 Q1', gdpGrowth: 5.11, cpi: 3.05 },
  { period: '2024 Q3', gdpGrowth: 4.95, cpi: 1.84 },
  { period: '2025 Q1', gdpGrowth: 4.98, cpi: 1.65 },
  { period: '2025 Q2', gdpGrowth: 5.12, cpi: 1.98 },
  { period: '2025 Q3', gdpGrowth: 5.08, cpi: 2.24 },
  { period: '2025 Q4', gdpGrowth: 5.26, cpi: 2.42 },
];

export const SECTOR_GDP_SHARE = [
  { label: 'Manufacturing (KBLI C)', share: 19.2, growth: 4.8, color: '#16425b' },
  { label: 'Wholesale & Retail Trade', share: 13.1, growth: 4.9, color: '#2a6284' },
  { label: 'Agriculture & Fisheries', share: 12.6, growth: 3.1, color: '#0f766e' },
  { label: 'Construction', share: 10.1, growth: 6.2, color: '#b45309' },
  { label: 'Mining & Quarrying', share: 9.8, growth: 4.5, color: '#9e2a2b' },
  { label: 'ICT & Financial Services', share: 9.2, growth: 7.4, color: '#475569' },
];

export const MACRO_REGION_SUMMARY = [
  { id: 'java', name: 'Java', shareGdp: 57.1, popMillions: 158.2, growth: 5.18, hdi: 76.4 },
  { id: 'sumatra', name: 'Sumatra', shareGdp: 22.1, popMillions: 62.4, growth: 4.79, hdi: 74.1 },
  { id: 'kalimantan', name: 'Kalimantan', shareGdp: 8.3, popMillions: 17.6, growth: 5.44, hdi: 73.6 },
  { id: 'sulawesi', name: 'Sulawesi', shareGdp: 7.1, popMillions: 20.9, growth: 6.12, hdi: 72.8 },
  { id: 'bali-nt', name: 'Bali & Nusa Tenggara', shareGdp: 2.8, popMillions: 15.8, growth: 5.25, hdi: 71.9 },
  { id: 'maluku-papua', name: 'Maluku & Papua', shareGdp: 2.6, popMillions: 9.5, growth: 6.45, hdi: 66.8 },
];

export const LATEST_RELEASES = [
  {
    date: '05 Feb 2026',
    code: 'BPS-SNA-014',
    title: 'Q4 & Full-Year 2025 National Accounts',
    summary: 'Real GDP grew 5.11% in FY 2025 ($1.44T nominal), driven by household consumption (+4.94%) and investment (+4.72%).',
    route: '#/economy',
  },
  {
    date: '02 Feb 2026',
    code: 'BPS-CPI-011',
    title: '90-City Consumer Price Index (Dec 2025)',
    summary: 'Headline inflation finished 2025 at 2.42% YoY with core inflation steady at 2.26%, comfortably inside Bank Indonesia’s target.',
    route: '#/economy',
  },
  {
    date: '15 Jan 2026',
    code: 'BPS-SUS-005',
    title: 'SUSENAS Poverty & Inequality Profile',
    summary: 'Poverty declined to 8.57% (24.06M residents) as real rural wages improved; Gini expenditure ratio fell to 0.379.',
    route: '#/regions',
  },
  {
    date: '05 Nov 2025',
    code: 'BPS-SAK-118',
    title: 'SAKERNAS Labor Force Survey',
    summary: 'Workforce reached 144.6M employed (70.6% participation) while open unemployment eased to 4.74%.',
    route: '#/demographics',
  },
];
