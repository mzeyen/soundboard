import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.argv[2] || '.';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
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
