import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const appSource = join(rootDir, 'app');
const shotsSource = join(rootDir, 'screenshots');

mkdirSync(outDir, { recursive: true });

const appDest = join(outDir, 'app');
const shotsDest = join(outDir, 'screenshots');

rmSync(appDest, { recursive: true, force: true });
rmSync(shotsDest, { recursive: true, force: true });

cpSync(appSource, appDest, { recursive: true });
mkdirSync(shotsDest, { recursive: true });
if (existsSync(shotsSource)) {
  cpSync(shotsSource, shotsDest, { recursive: true });
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});

writeFileSync(join(outDir, 'dossier.json'), dossier);
