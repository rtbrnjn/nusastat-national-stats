import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('./app', import.meta.url)));
const cliArgs = process.argv.slice(2);
const portFlag = cliArgs.indexOf('--port');
const parsedPort = portFlag !== -1 ? Number(cliArgs[portFlag + 1]) : 8080;
const port = Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort < 65536 ? parsedPort : 8080;

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const server = createServer((req, res) => {
  const reqUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
  let pathname: string;
  try {
    pathname = decodeURIComponent(reqUrl.pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  const target = resolve(join(appRoot, normalize(pathname)));
  if (target !== appRoot && !target.startsWith(appRoot + sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  let fileSize = 0;
  try {
    const info = statSync(target);
    if (!info.isFile()) throw new Error('Not a regular file');
    fileSize = info.size;
  } catch {
    res.writeHead(404).end('Not found');
    return;
  }

  res.writeHead(200, {
    'content-type': MIME_TYPES[extname(target).toLowerCase()] ?? 'application/octet-stream',
    'content-length': fileSize,
    'cache-control': 'no-store',
  });
  createReadStream(target).pipe(res);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`NusaStat serving app/ at http://127.0.0.1:${port}`);
});
