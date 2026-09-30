import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const slugs = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome' });
let port = 4600;
for (const slug of slugs) {
  const dir = new URL(`./${slug}/site/`, import.meta.url).pathname;
  const rep = JSON.parse(fs.readFileSync(new URL(`./${slug}/mirror-report.json`, import.meta.url)));
  const srv = spawn('python3', ['-m', 'http.server', String(++port), '--bind', '127.0.0.1'], { cwd: decodeURIComponent(dir), stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 900));
  const base = `http://127.0.0.1:${port}`;
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const issues = [];
  for (const p of rep.pages) {
    const page = await ctx.newPage(); const errs = [];
    page.on('console', m => m.type() === 'error' && errs.push(m.text().slice(0, 120)));
    page.on('pageerror', e => errs.push('PAGEERROR ' + e.message.slice(0, 120)));
    page.on('requestfailed', r => errs.push('FAILED ' + r.url().slice(0, 100)));
    page.on('response', r => { const u = r.url(); if (r.status() >= 400 && !u.includes('favicon') && !u.includes('/api/demo-lead')) errs.push(r.status() + ' ' + u.replace(base, '').slice(0, 100)); if (/leadconnector|filesafe|msgsndr/.test(u)) errs.push('GHL-CALL ' + u.slice(0, 100)); });
    await page.goto(base + p, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => errs.push('GOTO ' + e.message.slice(0, 80)));
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 800) { await page.evaluate(v => scrollTo(0, v), y); await page.waitForTimeout(80); }
    await page.waitForTimeout(500);
    const broken = await page.evaluate(() => [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.slice(-50)));
    if (broken.length) errs.push('BROKENIMG ' + broken.join(','));
    // client-side navigation: click the first internal nav link that differs from current path
    if (p === '/') {
      const target = await page.evaluate(() => { const a = [...document.querySelectorAll('header a[href^="/"], nav a[href^="/"]')].find(a => a.getAttribute('href') !== '/'); return a ? a.getAttribute('href') : null; });
      if (target) {
        await page.locator(`a[href="${target}"]`).first().click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(1500);
        const path = await page.evaluate(() => location.pathname);
        const h1 = await page.evaluate(() => document.querySelector('h1')?.innerText?.slice(0, 40) || '');
        if (path.replace(/\/$/, '') !== target.replace(/\/$/, '')) errs.push(`CLIENTNAV expected ${target} got ${path}`);
        else issues.push(`  ok client-nav / -> ${target} (h1: ${h1})`);
      }
    }
    if (errs.length) issues.push(`  ${p}: ${[...new Set(errs)].join(' | ')}`);
    await page.close();
  }
  console.log(`${slug}: ${rep.pages.length} pages`);
  console.log(issues.join('\n') || '  clean');
  await ctx.close(); srv.kill();
}
await b.close();
