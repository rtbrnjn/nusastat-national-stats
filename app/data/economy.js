// Detailed bilingual macroeconomic, price, trade, and fiscal time series (2019-2025)

export const ECONOMY_SERIES = {
  gdp: {
    title: 'Real GDP & Expenditure Growth (%)',
    titleId: 'Pertumbuhan PDB Riil & Pengeluaran (%)',
    subtitle: 'Annual constant-price growth rates, 2019–2025',
    subtitleId: 'Laju pertumbuhan harga konstan tahunan, 2019–2025',
    source: 'System of National Accounts · 2025',
    sourceId: 'Sistem Neraca Nasional BPS · 2025',
    unit: '%',
    years: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    series: [
      { name: 'Total Real GDP', nameId: 'PDB Riil Total', values: [5.02, -2.07, 3.70, 5.31, 5.05, 5.03, 5.11], color: '#0f4c81', area: true },
      { name: 'Household Consumption', nameId: 'Konsumsi Rumah Tangga', values: [5.04, -2.63, 2.02, 4.93, 4.82, 4.94, 4.94], color: '#047857' },
      { name: 'Gross Fixed Capital', nameId: 'PMTB / Investasi Fisik', values: [4.45, -4.96, 3.80, 3.87, 4.40, 4.61, 4.72], color: '#c2410c' },
    ],
  },
  prices: {
    title: 'Consumer Price Index (Headline vs. Core)',
    titleId: 'Indeks Harga Konsumen (Umum vs. Inti)',
    subtitle: 'Year-on-year annual average & end-period inflation (%)',
    subtitleId: 'Inflasi tahunan (YoY) umum, inti, dan sasaran BI (%)',
    source: '90-City Consumer Price Survey · Dec 2025',
    sourceId: 'Survei IHK 90 Kota BPS · Des 2025',
    unit: '%',
    years: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    series: [
      { name: 'Headline CPI', nameId: 'IHK Umum', values: [2.72, 1.68, 1.87, 5.51, 2.61, 1.57, 2.42], color: '#c2410c', area: true },
      { name: 'Core Inflation', nameId: 'Inflasi Inti', values: [3.02, 1.60, 1.56, 3.36, 1.80, 2.26, 2.26], color: '#0f4c81' },
      { name: 'Policy Target Midpoint', nameId: 'Titik Tengah Target', values: [3.50, 3.00, 3.00, 3.00, 3.00, 2.50, 2.50], color: '#64748b' },
    ],
  },
  trade: {
    title: 'External Merchandise Trade ($ Billions)',
    titleId: 'Perdagangan Barang Luar Negeri (Miliar US$)',
    subtitle: 'Annual FOB exports, CIF imports, and trade balance',
    subtitleId: 'Nilai ekspor FOB, impor CIF, dan neraca perdagangan',
    source: 'Customs Declarations & External Trade Report · 2025',
    sourceId: 'Dokumen Kepabeanan & BPS · 2025',
    unit: 'B',
    years: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    series: [
      { name: 'Total Exports', nameId: 'Total Ekspor', values: [167.7, 163.2, 231.6, 291.9, 258.8, 264.7, 276.4], color: '#0f4c81', area: true },
      { name: 'Total Imports', nameId: 'Total Impor', values: [171.3, 141.6, 196.2, 237.4, 221.9, 233.7, 241.6], color: '#d97706' },
      { name: 'Trade Balance', nameId: 'Neraca Dagang', values: [-3.6, 21.6, 35.4, 54.5, 36.9, 31.0, 34.8], color: '#047857' },
    ],
  },
  fiscal: {
    title: 'Central Government Fiscal Ratios (% of GDP)',
    titleId: 'Rasio Fiskal Pemerintah Pusat (% PDB)',
    subtitle: 'State revenue, expenditure, and fiscal deficit relative to GDP',
    subtitleId: 'Pendapatan negara, belanja APBN, dan rasio utang (% PDB)',
    source: 'Ministry of Finance APBN Realization · 2025',
    sourceId: 'Realisasi APBN Kemenkeu · 2025',
    unit: '%',
    years: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    series: [
      { name: 'Total Expenditure', nameId: 'Belanja Negara', values: [14.6, 16.8, 16.4, 15.8, 14.9, 15.2, 15.0], color: '#c2410c' },
      { name: 'Total Revenue', nameId: 'Pendapatan Negara', values: [12.4, 10.7, 11.8, 13.5, 13.3, 12.9, 12.7], color: '#0f4c81', area: true },
      { name: 'Public Debt / GDP (÷3)', nameId: 'Utang Pemerintah (÷3)', values: [10.1, 13.1, 13.6, 13.2, 13.0, 13.1, 13.0], color: '#64748b' },
    ],
  },
};

export const CPI_BASKET_2025 = [
  { label: 'Food, Beverages & Tobacco', labelId: 'Makanan, Minuman & Tembakau', value: 3.84, sub: 'Weight 25.0%', subId: 'Bobot 25,0%', color: '#c2410c' },
  { label: 'Personal Care & Other Services', labelId: 'Perawatan Pribadi & Jasa', value: 4.12, sub: 'Weight 6.1%', subId: 'Bobot 6,1%', color: '#d97706' },
  { label: 'Food & Beverage Service / Dining', labelId: 'Penyediaan Makanan/Restoran', value: 2.38, sub: 'Weight 8.7%', subId: 'Bobot 8,7%', color: '#0f4c81' },
  { label: 'Education Services', labelId: 'Jasa Pendidikan', value: 1.94, sub: 'Weight 5.6%', subId: 'Bobot 5,6%', color: '#2563eb' },
  { label: 'Health & Medical Care', labelId: 'Kesehatan & Perawatan', value: 1.78, sub: 'Weight 2.7%', subId: 'Bobot 2,7%', color: '#047857' },
  { label: 'Housing, Water & Electricity', labelId: 'Perumahan, Air & Listrik', value: 1.15, sub: 'Weight 20.4%', subId: 'Bobot 20,4%', color: '#0e7490' },
  { label: 'Transport & Fuel', labelId: 'Transportasi & BBM', value: 0.96, sub: 'Weight 12.4%', subId: 'Bobot 12,4%', color: '#64748b' },
];

export const MACRO_ANNUAL_TABLE = [
  { year: 2019, nominalUsdB: 1119.1, realGrowth: 5.02, cpiPct: 2.72, exportsB: 167.7, importsB: 171.3, balanceB: -3.6, policyRate: 5.00 },
  { year: 2020, nominalUsdB: 1058.7, realGrowth: -2.07, cpiPct: 1.68, exportsB: 163.2, importsB: 141.6, balanceB: 21.6, policyRate: 3.75 },
  { year: 2021, nominalUsdB: 1186.5, realGrowth: 3.70, cpiPct: 1.87, exportsB: 231.6, importsB: 196.2, balanceB: 35.4, policyRate: 3.50 },
  { year: 2022, nominalUsdB: 1319.1, realGrowth: 5.31, cpiPct: 5.51, exportsB: 291.9, importsB: 237.4, balanceB: 54.5, policyRate: 5.50 },
  { year: 2023, nominalUsdB: 1371.2, realGrowth: 5.05, cpiPct: 2.61, exportsB: 258.8, importsB: 221.9, balanceB: 36.9, policyRate: 6.00 },
  { year: 2024, nominalUsdB: 1396.3, realGrowth: 5.03, cpiPct: 1.57, exportsB: 264.7, importsB: 233.7, balanceB: 31.0, policyRate: 6.00 },
  { year: 2025, nominalUsdB: 1440.2, realGrowth: 5.11, cpiPct: 2.42, exportsB: 276.4, importsB: 241.6, balanceB: 34.8, policyRate: 5.50 },
];

export const TRADE_PARTNERS_2025 = [
  { label: 'China (Exports Share)', labelId: 'Tiongkok (Pangsa Ekspor)', value: 23.8, sub: '$65.8B', color: '#0f4c81' },
  { label: 'United States', labelId: 'Amerika Serikat', value: 10.6, sub: '$29.3B', color: '#2563eb' },
  { label: 'Japan', labelId: 'Jepang', value: 8.4, sub: '$23.2B', color: '#0e7490' },
  { label: 'India', labelId: 'India', value: 8.1, sub: '$22.4B', color: '#047857' },
  { label: 'Singapore', labelId: 'Singapura', value: 5.3, sub: '$14.6B', color: '#d97706' },
  { label: 'Malaysia & Other ASEAN', labelId: 'Malaysia & ASEAN Lainnya', value: 14.9, sub: '$41.2B', color: '#64748b' },
];
