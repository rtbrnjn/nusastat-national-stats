// Statistical bulletins, 2026 Advance Release Calendar, and international classifications

export const LATEST_RELEASES = [
  {
    date: '05 Feb 2026',
    code: 'BPS-SNA-014',
    title: 'Q4 & Full-Year 2025 National Accounts',
    summary: 'Real GDP grew 5.11% ($1.44T nominal), led by consumption (+4.94%) & capex (+4.72%).',
    route: '#/economy',
  },
  {
    date: '02 Feb 2026',
    code: 'BPS-CPI-011',
    title: '90-City Consumer Price Index (Dec 2025)',
    summary: 'Headline CPI ended 2025 at 2.42% YoY with core inflation anchored at 2.26%.',
    route: '#/economy',
  },
  {
    date: '15 Jan 2026',
    code: 'BPS-SUS-005',
    title: 'SUSENAS Poverty & Inequality Profile',
    summary: 'Poverty fell to 8.57% (24.06M residents); Gini ratio eased to 0.379.',
    route: '#/regions',
  },
  {
    date: '05 Nov 2025',
    code: 'BPS-SAK-118',
    title: 'SAKERNAS Labor Force Survey',
    summary: 'Employed workforce reached 144.6M (70.6% active); unemployment eased to 4.74%.',
    route: '#/demographics',
  },
];

export const RELEASE_CALENDAR_2026 = [
  { release: 'Q1 2026 Quarterly National Accounts (GDP)', frequency: 'Quarterly', window: '05 May 2026', agency: 'BPS · National Accounts', status: 'Scheduled' },
  { release: 'Monthly Consumer Price Index (90 Cities)', frequency: 'Monthly', window: '1st Business Day', agency: 'BPS · Price Statistics', status: 'Active' },
  { release: 'External Merchandise Trade Bulletin', frequency: 'Monthly', window: '15th of Month', agency: 'BPS · Distribution & Trade', status: 'Active' },
  { release: 'SAKERNAS Labor Force Survey (Feb Wave)', frequency: 'Biannual', window: '05 May 2026', agency: 'BPS · Labor & Demography', status: 'Scheduled' },
  { release: 'SUSENAS Poverty & Gini Release (Mar Wave)', frequency: 'Biannual', window: '15 Jul 2026', agency: 'BPS · Social Resilience', status: 'Scheduled' },
  { release: 'Provincial Human Development Index (38 Prov.)', frequency: 'Annual', window: '15 Nov 2026', agency: 'BPS · Statistical Analysis', status: 'Planned' },
];

export const STATISTICAL_STANDARDS = [
  { code: 'SNA 2008', title: 'System of National Accounts', detail: 'Constant-price GDP uses 2010 base-year chain-linked Laspeyres volume indices across 17 production sectors.' },
  { code: 'COICOP 2018', title: 'Consumer Price Index Basket', detail: 'Tracks 847 representative goods and services across 90 urban centers weighted by SBH household expenditure.' },
  { code: 'ILO 19th ICLS', title: 'Labor Force Definitions', detail: 'Employed persons cover ages 15+ working at least 1 hour in the reference week; open unemployment covers active seekers.' },
  { code: 'KBLI / ISIC Rev.4', title: 'Industrial Classification', detail: 'Aligns national industrial output and labor sector tables with international ISIC Rev.4 two-digit groupings.' },
];
