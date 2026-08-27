import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile, rename } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { randomBytes, timingSafeEqual } from 'node:crypto';

const root = process.argv[2] || '.';
const dataDir = process.env.DATA_DIR || join(root, '..', 'data');
const featuredFile = join(dataDir, 'featured.json');
const adminEmail = process.env.ADMIN_EMAIL || '';
const adminPassword = process.env.ADMIN_PASSWORD || '';
const sessions = new Map();
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

const sendJson = (res, status, value) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(value));
};

const readJsonBody = req => new Promise((resolve, reject) => {
  let body = '', size = 0;
  req.on('data', chunk => {
    size += chunk.length;
    if (size > 15 * 1024 * 1024) { reject(new Error('Payload too large')); req.destroy(); return; }
    body += chunk;
  });
  req.on('end', () => { try { resolve(JSON.parse(body || '{}')); } catch (error) { reject(error); } });
  req.on('error', reject);
});

const safeEqual = (left, right) => {
  const a = Buffer.from(String(left)), b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
};

const sessionFor = req => {
  const cookie = req.headers.cookie || '';
  const token = cookie.split(';').map(value => value.trim()).find(value => value.startsWith('waveboard-session='))?.split('=')[1];
  return token && sessions.get(token);
};

async function readFeatured() {
  try { return JSON.parse(await readFile(featuredFile, 'utf8')); } catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}

async function writeFeatured(pads) {
  await mkdir(dataDir, { recursive: true });
  const temporaryFile = `${featuredFile}.${process.pid}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(pads), { mode: 0o600 });
  await rename(temporaryFile, featuredFile);
}

const server = createServer(async (req, res) => {
  try {
    const url = req.url.split('?')[0];
    if (url === '/api/featured' && req.method === 'GET') return sendJson(res, 200, await readFeatured());
    if (url === '/api/session' && req.method === 'GET') return sendJson(res, sessionFor(req) ? 200 : 401, sessionFor(req) || { error: 'Nicht angemeldet' });
    if (url === '/api/login' && req.method === 'POST') {
      const credentials = await readJsonBody(req);
      if (!adminEmail || !adminPassword || !safeEqual(credentials.email, adminEmail) || !safeEqual(credentials.password, adminPassword)) return sendJson(res, 401, { error: 'E-Mail-Adresse oder Passwort ist falsch.' });
      const token = randomBytes(32).toString('hex');
      const user = { name: adminEmail.split('@')[0].replace(/[._-]/g, ' '), email: adminEmail };
      sessions.set(token, user);
      res.setHeader('Set-Cookie', `waveboard-session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800`);
      return sendJson(res, 200, user);
    }
    if (url === '/api/logout' && req.method === 'POST') {
      const cookie = req.headers.cookie || '';
      const token = cookie.split(';').map(value => value.trim()).find(value => value.startsWith('waveboard-session='))?.split('=')[1];
      if (token) sessions.delete(token);
      res.setHeader('Set-Cookie', 'waveboard-session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
      return sendJson(res, 200, { ok: true });
    }
    if (url === '/api/featured' && req.method === 'PUT') {
      if (!sessionFor(req)) return sendJson(res, 401, { error: 'Nicht angemeldet' });
      const pads = await readJsonBody(req);
      if (!Array.isArray(pads) || pads.some(pad => !pad || typeof pad.id !== 'string' || typeof pad.title !== 'string')) return sendJson(res, 400, { error: 'Ungültige Sound-Daten' });
      await writeFeatured(pads);
      return sendJson(res, 200, { ok: true, count: pads.length });
    }
    if (url.startsWith('/api/')) return sendJson(res, 404, { error: 'Nicht gefunden' });
    let path = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
    if (path === '/') path = '/index.html';
    let file = join(root, path);
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.setHeader('Content-Type', types[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.statusCode = 404; res.end('Not found'); }
});
const port = Number(process.env.PORT) || 4173;
server.listen(port, '0.0.0.0', () => console.log(`Waveboard running on http://localhost:${port}`));
