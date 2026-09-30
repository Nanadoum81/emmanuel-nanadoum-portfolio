import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
import fs from 'fs';
const sites = { cactus:'https://cactus-chiro.vibepreview.app', nelson:'https://nelson-chiro.vibepreview.app', palmer:'https://palmer-chiropractic.vibepreview.app', coyote:'https://coyote-wellness.vibepreview.app', canham:'https://canham-compass.vibepreview.app', medspa:'https://blair-medspa.vibepreview.com' };
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const b = await chromium.launch({ channel:'chrome' });
const report = {};
for (const [name, base] of Object.entries(sites)) {
  const ctx = await b.newContext({ userAgent: UA, viewport:{width:1440,height:900} });
  const mctx = await b.newContext({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', viewport:{width:390,height:844}, isMobile:true, hasTouch:true });
  const seen = new Set(); const queue = ['/', '/revenue-system']; const pages = []; const links = new Map();
  while (queue.length && seen.size < 25) {
    const path = queue.shift(); if (seen.has(path)) continue; seen.add(path);
    const p = await ctx.newPage(); const errs = []; const failed = [];
    p.on('console', m => m.type()==='error' && errs.push(m.text().slice(0,140)));
    p.on('pageerror', e => errs.push('PAGEERROR '+e.message.slice(0,140)));
    p.on('response', r => { if (r.status()>=400 && !r.url().includes('favicon')) failed.push(r.status()+' '+r.url().slice(0,110)); });
    let status=0; try { const r = await p.goto(base+path, { waitUntil:'networkidle', timeout:45000 }); status = r?.status()||0; } catch(e) { status='ERR'; }
    await p.waitForTimeout(800);
    const info = await p.evaluate(() => {
      const q = s => document.querySelector(s);
      const text = document.body.innerText;
      const anchors = [...document.querySelectorAll('a')].map(a => ({ h: a.getAttribute('href'), t: (a.innerText||a.getAttribute('aria-label')||'').trim().slice(0,40) }));
      return {
        title: document.title, desc: q('meta[name=description]')?.content || '', og: q('meta[property="og:image"]')?.content || '',
        canonical: q('link[rel=canonical]')?.href || '', h1: [...document.querySelectorAll('h1')].map(h=>h.innerText.trim().slice(0,60)),
        brokenImgs: [...document.images].filter(i => i.complete && i.naturalWidth===0).map(i=>i.src.slice(-60)),
        anchors, forms: [...document.querySelectorAll('form')].map(f => ({ action: f.getAttribute('action'), method: f.method, fields: [...f.elements].filter(e=>e.name||e.id).map(e=>e.name||e.id).slice(0,12) })),
        placeholders: (text.match(/\{\{[^}]+\}\}|lorem ipsum|TODO|\[insert[^\]]*\]/gi)||[]).slice(0,5),
        demoWords: (text.match(/\b(demo|sample data|illustrative|Blair Digital Studios|system demo)\b/gi)||[]).length,
        empty: anchors.filter(a => !a.h || a.h==='#' || a.h.includes('{{')).map(a=>a.t+' -> '+a.h).slice(0,6),
      };
    });
    const m = await mctx.newPage(); await m.goto(base+path, { waitUntil:'networkidle', timeout:45000 }).catch(()=>{}); await m.waitForTimeout(500);
    const over = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await m.close();
    for (const a of info.anchors) { if (!a.h) continue; if (a.h.startsWith('/') && !a.h.startsWith('//')) { const clean=a.h.split('#')[0].split('?')[0]||'/'; if(!seen.has(clean)) queue.push(clean); } links.set(a.h, a.t); }
    pages.push({ path, status, ...info, anchors: undefined, errs:[...new Set(errs)].slice(0,4), failed:[...new Set(failed)].slice(0,4), mobileOverflowPx: over });
    await p.close();
  }
  // external / special links
  const ext = [];
  for (const [h] of links) {
    if (/^https?:/.test(h) && !h.startsWith(base)) { let s; try { s = (await fetch(h,{redirect:'follow',headers:{'user-agent':UA}})).status; } catch(e){ s='ERR'; } ext.push(`${s} ${h}`); }
    else if (/^(tel|mailto):/.test(h)) ext.push(`LINK ${h}`);
  }
  report[name] = { base, pages, ext };
  await ctx.close(); await mctx.close();
  console.log('audited', name, pages.length, 'pages');
}
await b.close();
fs.writeFileSync(decodeURIComponent(new URL('./demo-audit.json', import.meta.url).pathname), JSON.stringify(report, null, 1));
