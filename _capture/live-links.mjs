import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
const sites = ['https://emmanuel-nanadoum.vercel.app', ...['cactus','palmer','canham','nelson','coyote','medspa'].map(s => `https://blair-demo-${s}.vercel.app`)];
const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const checked = new Map(); const bad = [];
for (const base of sites) {
  const seen = new Set(); const queue = ['/'];
  while (queue.length && seen.size < 40) {
    const path = queue.shift(); if (seen.has(path)) continue; seen.add(path);
    const p = await ctx.newPage();
    const r = await p.goto(base + path, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => null);
    if (!r || r.status() >= 400) { bad.push(`${r?.status()} ${base}${path} (page)`); await p.close(); continue; }
    const hrefs = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.href));
    await p.close();
    for (const h of hrefs) {
      if (!/^https?:/.test(h)) continue;
      const u = new URL(h); const clean = u.origin + u.pathname;
      if (u.origin === base) { const pth = u.pathname || '/'; if (!seen.has(pth) && !/\.(pdf|docx|png|jpg)$/.test(pth)) queue.push(pth); }
      if (checked.has(clean)) continue;
      let st; try { const res = await fetch(clean, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (Macintosh) Chrome/141 Safari/537.36' } }); st = res.status; } catch { st = 'ERR'; }
      checked.set(clean, st);
      if (st >= 400 || st === 'ERR') bad.push(`${st} ${clean}  <- found on ${base}${path}`);
    }
  }
  console.log(`${base}: ${seen.size} pages crawled`);
}
await b.close();
console.log('\nBROKEN:\n' + ([...new Set(bad)].join('\n') || 'none'));
