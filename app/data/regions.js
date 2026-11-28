// Complete 6 macro-regions and all 38 official provinces of Indonesia (BPS Regional Accounts & SUSENAS 2025)

export const MACRO_REGIONS = [
  { id: 'sumatra', name: 'Sumatra', nameId: 'Sumatra', provincesCount: 10, popM: 62.4, gdpShare: 22.1, grdpPerCapitaUsd: 4680, growth: 4.79, hdi: 74.1, poverty: 8.6, leadDriver: 'Agro-processing, downstream oleochemicals, energy & ports', leadDriverId: 'Agroindustri, hilirisasi sawit, energi & pelabuhan' },
  { id: 'java', name: 'Java', nameId: 'Jawa', provincesCount: 6, popM: 158.2, gdpShare: 57.1, grdpPerCapitaUsd: 5410, growth: 5.18, hdi: 76.4, poverty: 8.1, leadDriver: 'Manufacturing corridors, finance, ICT & household consumption', leadDriverId: 'Koridor manufaktur, keuangan, TIK & konsumsi rumah tangga' },
  { id: 'kalimantan', name: 'Kalimantan', nameId: 'Kalimantan', provincesCount: 5, popM: 17.6, gdpShare: 8.3, grdpPerCapitaUsd: 6940, growth: 5.44, hdi: 73.6, poverty: 5.7, leadDriver: 'Mineral refining, coal/LNG exports, Nusantara capital works', leadDriverId: 'Pemurnian mineral, ekspor LNG/batubara, pembangunan IKN' },
  { id: 'sulawesi', name: 'Sulawesi', nameId: 'Sulawesi', provincesCount: 6, popM: 20.9, gdpShare: 7.1, grdpPerCapitaUsd: 4860, growth: 6.12, hdi: 72.8, poverty: 9.4, leadDriver: 'Nickel smelters, EV battery supply chain, fisheries', leadDriverId: 'Smelter nikel, rantai pasok baterai EV & perikanan' },
  { id: 'bali-nt', name: 'Bali & Nusa Tenggara', nameId: 'Bali & Nusa Tenggara', provincesCount: 3, popM: 15.8, gdpShare: 2.8, grdpPerCapitaUsd: 2680, growth: 5.25, hdi: 71.9, poverty: 11.4, leadDriver: 'International tourism, creative economy, copper smelting', leadDriverId: 'Pariwisata internasional, ekonomi kreatif & smelter tembaga' },
  { id: 'maluku-papua', name: 'Maluku & Papua', nameId: 'Maluku & Papua', provincesCount: 8, popM: 9.5, gdpShare: 2.6, grdpPerCapitaUsd: 3920, growth: 6.45, hdi: 66.8, poverty: 18.7, leadDriver: 'Copper/gold concentrates, LNG, marine & forestry hubs', leadDriverId: 'Konsentrat tembaga/emas, LNG, kelautan & kehutanan' },
];

export const PROVINCES_38 = [
  { code: 'ID-AC', name: 'Aceh', region: 'sumatra', popM: 5.56, grdpPerCapitaUsd: 2810, growth: 4.62, poverty: 13.84, unemployment: 5.75, hdi: 75.03, x: 40, y: 38 },
  { code: 'ID-SU', name: 'North Sumatra', region: 'sumatra', popM: 15.62, grdpPerCapitaUsd: 4460, growth: 5.07, poverty: 7.89, unemployment: 5.60, hdi: 75.76, x: 66, y: 62 },
  { code: 'ID-SB', name: 'West Sumatra', region: 'sumatra', popM: 5.84, grdpPerCapitaUsd: 3740, growth: 4.54, poverty: 5.92, unemployment: 5.75, hdi: 76.43, x: 84, y: 94 },
  { code: 'ID-RI', name: 'Riau', region: 'sumatra', popM: 6.82, grdpPerCapitaUsd: 10280, growth: 4.58, poverty: 6.67, unemployment: 3.70, hdi: 75.67, x: 108, y: 88 },
  { code: 'ID-KR', name: 'Riau Islands', region: 'sumatra', popM: 2.24, grdpPerCapitaUsd: 10120, growth: 5.14, poverty: 5.34, unemployment: 6.39, hdi: 79.89, x: 149, y: 84 },
  { code: 'ID-JA', name: 'Jambi', region: 'sumatra', popM: 3.76, grdpPerCapitaUsd: 5410, growth: 4.68, poverty: 7.10, unemployment: 4.48, hdi: 74.36, x: 120, y: 112 },
  { code: 'ID-SS', name: 'South Sumatra', region: 'sumatra', popM: 8.92, grdpPerCapitaUsd: 4720, growth: 5.09, poverty: 10.82, unemployment: 3.86, hdi: 73.84, x: 138, y: 136 },
  { code: 'ID-BB', name: 'Bangka Belitung', region: 'sumatra', popM: 1.54, grdpPerCapitaUsd: 4520, growth: 4.18, poverty: 4.52, unemployment: 4.63, hdi: 74.55, x: 178, y: 125 },
  { code: 'ID-BE', name: 'Bengkulu', region: 'sumatra', popM: 2.12, grdpPerCapitaUsd: 3090, growth: 4.65, poverty: 13.56, unemployment: 3.11, hdi: 74.94, x: 116, y: 138 },
  { code: 'ID-LA', name: 'Lampung', region: 'sumatra', popM: 9.42, grdpPerCapitaUsd: 3280, growth: 4.82, poverty: 10.62, unemployment: 4.19, hdi: 73.13, x: 152, y: 158 },

  { code: 'ID-JK', name: 'DKI Jakarta', region: 'java', popM: 10.74, grdpPerCapitaUsd: 21450, growth: 5.04, poverty: 4.14, unemployment: 6.02, hdi: 84.15, x: 196, y: 189 },
  { code: 'ID-BT', name: 'Banten', region: 'java', popM: 12.56, grdpPerCapitaUsd: 4380, growth: 4.96, poverty: 5.84, unemployment: 6.68, hdi: 76.35, x: 174, y: 190 },
  { code: 'ID-JB', name: 'West Java', region: 'java', popM: 50.76, grdpPerCapitaUsd: 3560, growth: 5.12, poverty: 7.46, unemployment: 6.75, hdi: 74.92, x: 216, y: 196 },
  { code: 'ID-JT', name: 'Central Java', region: 'java', popM: 37.89, grdpPerCapitaUsd: 3040, growth: 5.02, poverty: 10.18, unemployment: 4.78, hdi: 73.87, x: 254, y: 196 },
  { code: 'ID-YO', name: 'DI Yogyakarta', region: 'java', popM: 3.78, grdpPerCapitaUsd: 3320, growth: 5.15, poverty: 10.63, unemployment: 3.48, hdi: 81.62, x: 263, y: 205 },
  { code: 'ID-JI', name: 'East Java', region: 'java', popM: 41.88, grdpPerCapitaUsd: 4820, growth: 5.09, poverty: 9.56, unemployment: 4.19, hdi: 75.35, x: 302, y: 204 },

  { code: 'ID-KB', name: 'West Kalimantan', region: 'kalimantan', popM: 5.69, grdpPerCapitaUsd: 3420, growth: 4.94, poverty: 6.25, unemployment: 4.86, hdi: 71.19, x: 252, y: 98 },
  { code: 'ID-KT', name: 'Central Kalimantan', region: 'kalimantan', popM: 2.81, grdpPerCapitaUsd: 5190, growth: 4.52, poverty: 5.17, unemployment: 4.01, hdi: 74.28, x: 292, y: 120 },
  { code: 'ID-KS', name: 'South Kalimantan', region: 'kalimantan', popM: 4.28, grdpPerCapitaUsd: 4320, growth: 5.08, poverty: 4.12, unemployment: 4.20, hdi: 75.19, x: 322, y: 132 },
  { code: 'ID-KI', name: 'East Kalimantan', region: 'kalimantan', popM: 4.06, grdpPerCapitaUsd: 14190, growth: 6.18, poverty: 5.51, unemployment: 5.14, hdi: 78.79, x: 344, y: 100 },
  { code: 'ID-KU', name: 'North Kalimantan', region: 'kalimantan', popM: 0.76, grdpPerCapitaUsd: 12840, growth: 4.92, poverty: 6.32, unemployment: 3.90, hdi: 73.41, x: 334, y: 62 },

  { code: 'ID-SA', name: 'North Sulawesi', region: 'sulawesi', popM: 2.71, grdpPerCapitaUsd: 4420, growth: 5.48, poverty: 7.21, unemployment: 5.85, hdi: 75.68, x: 468, y: 68 },
  { code: 'ID-GO', name: 'Gorontalo', region: 'sulawesi', popM: 1.24, grdpPerCapitaUsd: 2890, growth: 4.46, poverty: 14.57, unemployment: 3.13, hdi: 72.01, x: 440, y: 67 },
  { code: 'ID-ST', name: 'Central Sulawesi', region: 'sulawesi', popM: 3.16, grdpPerCapitaUsd: 7890, growth: 9.85, poverty: 11.42, unemployment: 2.94, hdi: 72.24, x: 416, y: 90 },
  { code: 'ID-SR', name: 'West Sulawesi', region: 'sulawesi', popM: 1.50, grdpPerCapitaUsd: 2640, growth: 4.78, poverty: 11.08, unemployment: 2.68, hdi: 70.45, x: 404, y: 112 },
  { code: 'ID-SN', name: 'South Sulawesi', region: 'sulawesi', popM: 9.48, grdpPerCapitaUsd: 4580, growth: 5.16, poverty: 7.98, unemployment: 4.19, hdi: 75.18, x: 410, y: 138 },
  { code: 'ID-SG', name: 'Southeast Sulawesi', region: 'sulawesi', popM: 2.81, grdpPerCapitaUsd: 4210, growth: 5.42, poverty: 10.94, unemployment: 3.09, hdi: 73.62, x: 444, y: 130 },

  { code: 'ID-BA', name: 'Bali', region: 'bali-nt', popM: 4.46, grdpPerCapitaUsd: 4290, growth: 5.42, poverty: 3.92, unemployment: 1.79, hdi: 78.64, x: 351, y: 208 },
  { code: 'ID-NB', name: 'West Nusa Tenggara', region: 'bali-nt', popM: 5.65, grdpPerCapitaUsd: 2150, growth: 5.18, poverty: 12.64, unemployment: 2.73, hdi: 73.10, x: 375, y: 209 },
  { code: 'ID-NT', name: 'East Nusa Tenggara', region: 'bali-nt', popM: 5.69, grdpPerCapitaUsd: 1580, growth: 4.12, poverty: 19.02, unemployment: 3.02, hdi: 69.14, x: 454, y: 208 },

  { code: 'ID-MU', name: 'North Maluku', region: 'maluku-papua', popM: 1.37, grdpPerCapitaUsd: 4720, growth: 13.78, poverty: 6.32, unemployment: 4.03, hdi: 71.84, x: 528, y: 80 },
  { code: 'ID-MA', name: 'Maluku', region: 'maluku-papua', popM: 1.94, grdpPerCapitaUsd: 2040, growth: 5.36, poverty: 15.88, unemployment: 6.11, hdi: 73.40, x: 538, y: 128 },
  { code: 'ID-PD', name: 'Southwest Papua', region: 'maluku-papua', popM: 0.63, grdpPerCapitaUsd: 3840, growth: 4.10, poverty: 17.95, unemployment: 6.48, hdi: 69.32, x: 586, y: 112 },
  { code: 'ID-PB', name: 'West Papua', region: 'maluku-papua', popM: 0.58, grdpPerCapitaUsd: 7810, growth: 5.22, poverty: 20.84, unemployment: 4.13, hdi: 67.69, x: 606, y: 124 },
  { code: 'ID-PA', name: 'Papua', region: 'maluku-papua', popM: 1.10, grdpPerCapitaUsd: 5240, growth: 5.84, poverty: 17.26, unemployment: 6.48, hdi: 73.83, x: 694, y: 134 },
  { code: 'ID-PT', name: 'Central Papua', region: 'maluku-papua', popM: 1.48, grdpPerCapitaUsd: 7210, growth: 7.45, poverty: 29.76, unemployment: 2.75, hdi: 60.44, x: 656, y: 150 },
  { code: 'ID-PE', name: 'Highland Papua', region: 'maluku-papua', popM: 1.47, grdpPerCapitaUsd: 1190, growth: 4.24, poverty: 31.85, unemployment: 1.48, hdi: 54.43, x: 696, y: 158 },
  { code: 'ID-PS', name: 'South Papua', region: 'maluku-papua', popM: 0.55, grdpPerCapitaUsd: 4050, growth: 4.95, poverty: 17.44, unemployment: 3.92, hdi: 68.76, x: 706, y: 184 },
];
