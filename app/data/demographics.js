// Demographics, population pyramid cohorts, urbanization, labor force, and social indicators

export const PYRAMID_2025 = [
  { age: '75+', male: 1.1, female: 1.5 },
  { age: '70-74', male: 1.3, female: 1.6 },
  { age: '65-69', male: 2.0, female: 2.1 },
  { age: '60-64', male: 2.6, female: 2.7 },
  { age: '55-59', male: 3.1, female: 3.1 },
  { age: '50-54', male: 3.5, female: 3.5 },
  { age: '45-49', male: 3.7, female: 3.7 },
  { age: '40-44', male: 3.9, female: 3.9 },
  { age: '35-39', male: 4.0, female: 3.9 },
  { age: '30-34', male: 4.1, female: 4.0 },
  { age: '25-29', male: 4.2, female: 4.1 },
  { age: '20-24', male: 4.3, female: 4.1 },
  { age: '15-19', male: 4.3, female: 4.0 },
  { age: '10-14', male: 4.1, female: 3.9 },
  { age: '05-09', male: 3.9, female: 3.7 },
  { age: '00-04', male: 3.7, female: 3.5 },
];

export const PYRAMID_2035 = [
  { age: '75+', male: 1.7, female: 2.2 },
  { age: '70-74', male: 1.9, female: 2.2 },
  { age: '65-69', male: 2.5, female: 2.7 },
  { age: '60-64', male: 3.0, female: 3.1 },
  { age: '55-59', male: 3.4, female: 3.5 },
  { age: '50-54', male: 3.6, female: 3.6 },
  { age: '45-49', male: 3.8, female: 3.8 },
  { age: '40-44', male: 3.9, female: 3.8 },
  { age: '35-39', male: 4.0, female: 3.8 },
  { age: '30-34', male: 4.0, female: 3.8 },
  { age: '25-29', male: 3.9, female: 3.7 },
  { age: '20-24', male: 3.7, female: 3.5 },
  { age: '15-19', male: 3.5, female: 3.3 },
  { age: '10-14', male: 3.3, female: 3.2 },
  { age: '05-09', male: 3.1, female: 3.0 },
  { age: '00-04', male: 2.9, female: 2.8 },
];

export const LABOR_TRANSITION = [
  { label: 'Trade, Hospitality & Services', value: 49.8, sub: '72.0M workers', color: '#0f4c81' },
  { label: 'Agriculture, Forestry & Fisheries', value: 28.2, sub: '40.8M workers', color: '#047857' },
  { label: 'Manufacturing & Utilities', value: 14.4, sub: '20.8M workers', color: '#2563eb' },
  { label: 'Construction', value: 6.4, sub: '9.3M workers', color: '#d97706' },
  { label: 'Mining & Quarrying', value: 1.2, sub: '1.7M workers', color: '#c2410c' },
];

export const URBANIZATION_TREND = {
  years: ['2000', '2005', '2010', '2015', '2020', '2025'],
  urbanPct: [42.0, 45.9, 49.8, 53.3, 56.7, 59.8],
  ruralPct: [58.0, 54.1, 50.2, 46.7, 43.3, 40.2],
};

export const SOCIAL_PROGRESS_INDICATORS = [
  { indicator: 'Life Expectancy at Birth', value: '74.15 years', year: '2025', change: '+0.28 yrs', source: 'Vital Statistics & SUPAS' },
  { indicator: 'Total Fertility Rate (TFR)', value: '2.11 births/woman', year: '2025', change: '-0.07 vs 2020', source: 'SP2020 / BKKBN Projection' },
  { indicator: 'Working-Age Share (15–64)', value: '69.2%', year: '2025', change: 'Demographic window', source: 'Population Census Series' },
  { indicator: 'Adult Literacy Rate (15+)', value: '96.5%', year: '2025', change: '+0.4 pp', source: 'SUSENAS Education Module' },
  { indicator: 'Mean Years of Schooling (25+)', value: '8.92 years', year: '2025', change: '+0.15 yrs', source: 'HDI Components Release' },
  { indicator: 'Formal Employment Share', value: '42.4%', year: 'Aug 2025', change: '+1.6 pp YoY', source: 'SAKERNAS Labor Survey' },
  { indicator: 'Clean Drinking Water Access', value: '92.6%', year: '2025', change: '+1.2 pp YoY', source: 'SUSENAS Housing Module' },
  { indicator: 'Household Internet Penetration', value: '79.5%', year: '2025', change: '+2.8 pp YoY', source: 'ICT Household Survey' },
];
