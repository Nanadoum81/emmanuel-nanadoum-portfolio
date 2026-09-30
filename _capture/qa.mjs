import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
const BASE = process.argv[2] || 'https://emmanuel-nanadoum.vercel.app';
const out = decodeURIComponent(new URL('../.impeccable/review/', import.meta.url).pathname);
const pages = ['/', '/work', '/work/vybe', '/work/cactus', '/work/palmer-herman', '/work/blair-revenue-systems', '/about', '/contact', '/resume', '/solutions', '/solutions/cactus', '/solutions/nelson', '/solutions/blair-medspa', '/nope'];
const vps = [['d',1440,900],['t',768,1024],['p',430,932],['m',390,844]];
const shoot = (process.argv[3]||'').split(',').filter(Boolean);
const b = await chromium.launch({ channel: 'chrome' });
const issues = [];
for (const [tag,w,h] of vps) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor: 1, isMobile: w<768, hasTouch: w<768, reducedMotion: 'reduce' });
  for (const path of pages) {
    const p = await ctx.newPage(); const errs = [];
    p.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,160)); });
    p.on('pageerror', e => errs.push('PAGEERROR '+e.message.slice(0,160)));
    p.on('response', r => { if (r.status()>=400 && !r.url().includes('/nope')) errs.push(`${r.status()} ${r.url().slice(0,120)}`); });
    await p.goto(BASE+path, { waitUntil: 'networkidle', timeout: 60000 });
    const H = await p.evaluate(()=>document.documentElement.scrollHeight);
    for (let y=0;y<H;y+=600){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(60);} await p.evaluate(()=>window.scrollTo(0,0)); await p.evaluate(async()=>{ document.querySelectorAll('img[loading="lazy"]').forEach(i=>i.loading='eager'); await Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))); }); await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = [...document.querySelectorAll('main h1,main h2,main h3,main p,main td,main th,main li,main a,main dd,main table')].filter(el => { const b = el.getBoundingClientRect(); return b.width>0 && b.right > vw + 1 && !el.closest('.snap-x'); }).slice(0,4).map(el => el.tagName+'.'+(el.className||'').toString().slice(0,60)+' r='+Math.round(el.getBoundingClientRect().right));
      const brokenImg = [...document.images].filter(i => i.complete && i.naturalWidth===0).map(i=>i.src.slice(-60));
      const smallTargets = [...document.querySelectorAll('a,button')].filter(a => { const b=a.getBoundingClientRect(); const cs=getComputedStyle(a); return b.width>0 && b.height>0 && b.height<24 && cs.display!=='inline' && !a.closest('p'); }).slice(0,5).map(a=>a.textContent.trim().slice(0,30)+':'+Math.round(a.getBoundingClientRect().height));
      return { scrollW: document.documentElement.scrollWidth, vw, over, brokenImg, smallTargets, h1: document.querySelectorAll('h1').length };
    });
    const flag = [];
    if (r.scrollW > r.vw) flag.push(`HSCROLL ${r.scrollW}>${r.vw}`);
    if (r.over.length) flag.push('OVER '+r.over.join(' | '));
    if (r.brokenImg.length) flag.push('BROKENIMG '+r.brokenImg.join(','));
    if (r.h1 !== 1) flag.push('H1 count '+r.h1);
    if (errs.length) flag.push('ERR '+[...new Set(errs)].join(' || '));
    if (r.smallTargets.length && w<768) flag.push('SMALL '+r.smallTargets.join(', '));
    if (flag.length) issues.push(`[${tag}] ${path}: ${flag.join(' ;; ')}`);
    const name = (path==='/'?'home':path.slice(1).replace(/\//g,'_'));
    if (shoot.includes(tag) && ['home','work_vybe','work_palmer-herman','solutions','solutions_cactus'].includes(name)) await p.screenshot({ path: `${out}${tag}-${name}.png`, fullPage: true });
    await p.close();
  }
  await ctx.close();
}
await b.close();
console.log(issues.length ? issues.join('\n') : 'NO ISSUES');
