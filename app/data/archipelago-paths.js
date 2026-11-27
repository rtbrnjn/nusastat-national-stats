// Detailed multi-island vector SVG coastline paths for the Indonesian archipelago (viewBox 0 0 760 250)

export const ARCHIPELAGO_PATHS = {
  sumatra: [
    // Aceh -> Malacca Strait -> Riau -> Jambi -> Palembang -> Teluk Lampung -> Sunda Strait -> Semangka -> Bengkulu -> Padang -> Sibolga -> Aceh
    'M 23 32 L 32 30 L 44 35 L 54 44 L 66 50 L 76 62 L 88 73 L 103 77 L 116 82 L 126 94 L 124 104 L 134 111 L 146 122 L 156 134 L 160 148 L 164 160 L 158 172 L 152 165 L 146 173 L 139 162 L 134 167 L 122 152 L 108 139 L 97 122 L 84 107 L 75 94 L 68 82 L 56 71 L 46 58 L 32 45 Z',
    // Pulau Weh (Sabang)
    'M 19 25 L 24 24 L 25 28 L 20 29 Z',
    // Simeulue
    'M 28 54 L 34 53 L 38 61 L 31 62 Z',
    // Nias
    'M 38 72 L 46 70 L 49 82 L 41 85 Z',
    // Mentawai chain (Siberut, Sipora, Pagai)
    'M 62 103 L 69 102 L 72 114 L 64 115 Z',
    'M 71 118 L 78 117 L 80 125 L 73 126 Z',
    'M 79 129 L 86 128 L 89 139 L 81 140 Z',
    // Riau Islands (Batam, Bintan, Lingga)
    'M 138 79 L 149 77 L 151 85 L 140 86 Z',
    'M 152 81 L 160 80 L 161 88 L 153 89 Z',
    'M 145 93 L 155 92 L 156 100 L 146 100 Z',
    // Bangka & Belitung
    'M 169 116 L 180 114 L 186 124 L 183 132 L 173 130 L 170 123 Z',
    'M 191 128 L 203 126 L 207 136 L 198 140 L 192 135 Z',
  ].join(' '),
  java: [
    'M 164 188 Q 182 182 204 184 L 242 189 Q 260 185 274 188 L 304 195 Q 324 198 336 206 L 332 213 Q 294 212 248 208 L 196 202 Q 170 198 162 192 Z',
    'M 308 189 L 332 190 L 331 196 L 307 195 Z',
  ].join(' '),
  kalimantan: [
    // Sambas/Tanjung Datu -> Sarawak/Kapuas Hulu border -> North Kalimantan -> Mangkalihat Peninsula -> Mahakam/Balikpapan -> Tanah Bumbu -> Banjarmasin -> Sampit/Tanjung Puting -> Pontianak
    'M 237 76 L 252 72 L 266 78 L 283 75 L 296 65 L 307 52 L 319 45 L 337 42 L 346 51 L 349 63 L 347 73 L 358 75 L 373 82 L 369 89 L 354 91 L 348 96 L 351 105 L 344 113 L 338 116 L 340 124 L 334 137 L 325 140 L 318 141 L 310 136 L 301 139 L 294 132 L 285 137 L 276 143 L 268 136 L 256 132 L 248 121 L 245 110 L 239 102 L 242 93 L 236 85 Z',
    // Pulau Laut (South Kalimantan) & Tarakan
    'M 339 130 L 345 129 L 344 142 L 338 141 Z',
    'M 350 56 L 355 55 L 356 61 L 350 61 Z',
  ].join(' '),
  sulawesi: [
    'M 398 76 Q 408 62 436 58 L 468 60 Q 486 64 484 72 L 466 78 Q 440 76 422 86 L 446 90 Q 468 88 464 98 L 436 102 Q 422 106 436 116 L 456 134 Q 454 146 442 142 L 428 122 Q 418 122 418 148 L 404 152 Q 396 138 398 114 Z',
    'M 456 140 L 466 138 L 468 152 L 457 152 Z',
  ].join(' '),
  'bali-nt': [
    'M 340 205 L 360 203 L 362 212 L 342 213 Z',
    'M 366 206 L 382 205 L 383 214 L 367 214 Z',
    'M 388 206 L 422 204 L 424 214 L 390 215 Z',
    'M 428 205 L 472 202 L 474 212 L 430 214 Z',
    'M 424 221 L 452 220 L 454 230 L 426 230 Z',
    'M 476 226 L 514 212 L 518 222 L 480 236 Z',
  ].join(' '),
  'maluku-papua': [
    'M 516 68 L 534 60 L 540 76 L 530 88 L 542 98 L 532 108 L 518 96 Z',
    'M 500 128 L 516 126 L 518 136 L 502 138 Z',
    'M 522 124 L 558 122 L 560 133 L 524 134 Z',
    'M 574 106 Q 590 96 608 100 L 618 114 Q 638 122 654 114 L 688 120 Q 714 126 726 132 L 728 202 Q 704 200 682 186 L 652 172 Q 626 156 602 146 L 584 128 Z',
    'M 640 100 L 658 100 L 660 107 L 642 107 Z',
  ].join(' '),
};

export const INTERNAL_BORDERS = [
  // Kalimantan provincial lines (West / Central / South / East / North)
  'M 256 131 L 269 109 L 284 96 L 296 86 L 307 78 L 296 65',
  'M 307 78 L 323 76 L 347 73',
  'M 307 78 L 312 104 L 326 112 L 338 116',
  'M 304 138 L 308 122 L 319 116 L 326 112',
  // Sumatra internal ridge / provincial divisions
  'M 42 52 L 54 44',
  'M 64 78 L 88 73',
  'M 94 114 L 124 104',
  'M 122 150 L 146 142 L 160 148',
].join(' ');

export const REGION_LABELS = [
  { x: 64, y: 146, text: 'SUMATRA' },
  { x: 246, y: 224, text: 'JAVA' },
  { x: 298, y: 38, text: 'KALIMANTAN' },
  { x: 434, y: 166, text: 'SULAWESI' },
  { x: 428, y: 242, text: 'BALI & NUSA TENGGARA' },
  { x: 652, y: 94, text: 'MALUKU & PAPUA' },
];
