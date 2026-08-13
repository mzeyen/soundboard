import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
let html = await readFile('index.html', 'utf8');
html = html.replace('src="/src/main.js"', 'src="/src/main.js"');
await writeFile('dist/index.html', html);
await cp('src', 'dist/src', { recursive: true });
console.log('Build complete: dist/');
