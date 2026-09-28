/* Проверка сайта в headless Chrome: кадры заставки, полёт в букву, разделы.
   node tools/check.mjs [pc|phone] [en|ar] [outDir]
   Кадры складываются в outDir (по умолчанию tools/out). */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODE = process.argv[2] || 'pc', LANG = process.argv[3] || 'en';
const OUT = path.resolve(process.argv[4] || path.join(ROOT, 'tools', 'out'));
fs.mkdirSync(OUT, { recursive: true });
const PORT = 8176 + (MODE === 'phone' ? 1 : 0) + (LANG === 'ar' ? 2 : 0), DBG = 9350 + PORT - 8176;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (rel.endsWith('/')) rel += 'index.html';
  const f = path.join(ROOT, rel);
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404); return res.end(); }
    const type = MIME[path.extname(f)] || 'application/octet-stream', range = req.headers.range;
    if (range) { const [a, b] = range.replace('bytes=', '').split('-'); const s = +a, en = b ? +b : st.size - 1;
      res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${s}-${en}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': en - s + 1 });
      return fs.createReadStream(f, { start: s, end: en }).pipe(res); }
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': st.size }); fs.createReadStream(f).pipe(res);
  });
});
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
const exe = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p => fs.existsSync(p));
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'savva-'));
const br = spawn(exe, ['--headless=new', `--remote-debugging-port=${DBG}`, `--user-data-dir=${prof}`, '--no-first-run', '--hide-scrollbars', '--mute-audio', '--autoplay-policy=no-user-gesture-required', `--lang=${LANG}`, 'about:blank'], { stdio: 'ignore' });
let wsUrl; for (let i = 0; i < 50 && !wsUrl; i++) { try { wsUrl = (await (await fetch(`http://127.0.0.1:${DBG}/json/version`)).json()).webSocketDebuggerUrl; } catch { await sleep(200); } }
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let seq = 0; const pend = new Map(), logs = [];
ws.onmessage = ev => { const m = JSON.parse(ev.data);
  if (m.id && pend.has(m.id)) { const p = pend.get(m.id); pend.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
  else if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text));
  else if (m.method === 'Runtime.consoleAPICalled' && /error|warn/.test(m.params.type)) logs.push(m.params.type + ' ' + m.params.args.map(a => a.value ?? a.description).join(' '));
  else if (m.method === 'Log.entryAdded') logs.push('log ' + m.params.entry.level + ' ' + m.params.entry.text + ' ' + (m.params.entry.url || ''));
};
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const id = ++seq; pend.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params, sessionId })); });
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: s } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, s); await send('Runtime.enable', {}, s); await send('Log.enable', {}, s);
await send('Emulation.setFocusEmulationEnabled', { enabled: true }, s);
const W = MODE === 'phone' ? 390 : 1440, H = MODE === 'phone' ? 664 : 900;
await send('Emulation.setDeviceMetricsOverride', MODE === 'phone' ? { width: W, height: H, deviceScaleFactor: 2, mobile: true } : { width: W, height: H, deviceScaleFactor: 1, mobile: false }, s);
if (MODE === 'phone') await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, s);
await send('Page.addScriptToEvaluateOnNewDocument', { source: `try{localStorage.setItem('savva-lang','${LANG}')}catch(e){}` }, s);
const ev = async e => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }, s)).result.value;
const shot = async (name, clip) => { const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70, ...(clip ? { clip } : {}) }, s); fs.writeFileSync(path.join(OUT, name + '.jpg'), Buffer.from(r.data, 'base64')); };

await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` }, s);
const t0 = Date.now();
for (const t of [300, 900, 1500, 2100, 2700, 3300, 3800, 4300, 5200]) { await sleep(Math.max(0, t - (Date.now() - t0))); await shot(`intro-${String(t).padStart(4, '0')}`); }
await sleep(1500);
const heroH = await ev(`document.querySelector('.hero').offsetHeight - innerHeight`);
for (const p of [0, .15, .3, .45, .6, .8, 1]) { await ev(`scrollTo({top:${Math.round(heroH * p)},behavior:'instant'})`); await sleep(500); await shot(`hero-${Math.round(p * 100).toString().padStart(3, '0')}`); }
const secs = ['about', 'menu', 'finder', 'day', 'latte', 'space', 'reviews', 'visit'];
for (const id of secs) {
  await ev(`document.getElementById('${id}').scrollIntoView({behavior:'instant'})`); await sleep(900);
  if (id === 'finder') { await ev(`(async()=>{for(const v of ['iced','coffee','sweet']){document.querySelector('#quiz button[data-v=${'"'}'+v+'${'"'}]').click();await new Promise(r=>setTimeout(r,300))}})()`); await sleep(1600); }
  if (id === 'day') {
    for (const [i, name] of [[1, 'morning'], [5, 'night']]) { await ev(`document.querySelectorAll('#dayTicks button')[${i}].click()`); await sleep(1400); await shot('day-' + name); }
  }
  if (id === 'latte') {
    await sleep(3400);
    const clip = await ev(`(r=>({x:r.left,y:r.top+scrollY,width:r.width,height:r.height,scale:.6}))(document.getElementById('latteCanvas').getBoundingClientRect())`);
    await shot('latte-heart', clip);
    await ev(`document.querySelector('[data-pour=heart]').click()`); await sleep(800);
    for (let f = 0; f < 10; f++) { await shot('heartf-' + f, { ...clip, scale: .3 }); await sleep(180); }
    await sleep(1200);
    for (const k of ['tulip', 'rosetta']) { await ev(`document.querySelector('[data-pour=${k}]').click()`); await sleep(3600); await shot('latte-' + k, clip); }
  }
  await shot('sec-' + id);
  const h = await ev(`document.getElementById('${id}').offsetHeight`);
  if (h > H * 1.2) { await ev(`scrollBy({top:${H - 80},behavior:'instant'})`); await sleep(700); await shot('sec-' + id + '-2'); }
  if (h > H * 2.2) { await ev(`scrollBy({top:${H - 80},behavior:'instant'})`); await sleep(700); await shot('sec-' + id + '-3'); }
}
await ev(`scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'})`); await sleep(3500); await shot('sec-foot');
const info = await ev(`JSON.stringify({ hidden:[...document.querySelectorAll('[hidden]')].filter(e=>getComputedStyle(e).display!=='none').length, overflowX: document.documentElement.scrollWidth - innerWidth, video: (v=>({src:v.currentSrc, paused:v.paused, t:v.currentTime, on:v.classList.contains('is-on')}))(document.getElementById('heroVideo')), lang: document.documentElement.lang, intro: !!document.getElementById('intro') })`);
console.log(info); console.log(logs.join('\n') || 'no console errors');
ws.close(); br.kill(); server.close(); process.exit(0);
