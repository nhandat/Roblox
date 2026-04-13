import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, '../web');

// bootstrap mock runtime once
globalThis.window = { location: { href: 'https://www.roblox.com/home' } };
globalThis.document = { nodeType: 9 };
Object.defineProperty(globalThis, 'navigator', {
  value: { userAgent: 'node' },
  configurable: true,
});
globalThis.HTMLFormElement = class HTMLFormElement {};

const { bootstrap } = await import('../playground/entry.local.js');
const boot = bootstrap();

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400).end('Bad Request');
    return;
  }

  if (req.url === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      ok: true,
      token: boot.token,
      robloxReady: boot.hasRobloxGlobal,
      message: 'Mock runtime is active for UI preview.',
      now: new Date().toISOString(),
    }));
    return;
  }

  const cleanPath = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.resolve(webRoot, `.${cleanPath}`);

  if (!filePath.startsWith(webRoot)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const ext = path.extname(filePath);
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('Not Found');
  }
});

const port = Number(process.env.PORT || 4173);
server.listen(port, () => {
  console.log('✅ Web playground started');
  console.log(`Open UI: http://localhost:${port}`);
});
