import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
const out = decodeURIComponent(new URL('../.impeccable/review/', import.meta.url).pathname);
const b = await chromium.launch({ channel: 'chrome' });
for (const rm of ['no-preference','reduce']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: rm });
  const errs=[]; p.on('pageerror', e=>errs.push(e.message)); p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()) });
  await p.goto('https://emmanuel-nanadoum.vercel.app/', { waitUntil: 'networkidle' });
  if (rm==='no-preference') await p.screenshot({ path: out+'motion-t0.4.png' });
  await p.waitForTimeout(3500);
  const s = await p.evaluate(() => ({
    nameT: [...document.querySelectorAll('[data-name-line]')].map(e=>getComputedStyle(e).transform),
    strike: getComputedStyle(document.querySelector('.redline-del')).getPropertyValue('--strike') || 'unset(=1)',
    insOp: [...document.querySelectorAll('[data-ins-word]')].map(e=>getComputedStyle(e).opacity).filter(o=>o!=='1').length,
    plateClip: [...document.querySelectorAll('.exhibit-body')].map(e=>getComputedStyle(e).clipPath).filter(c=>c!=='none').length,
    keysOp: [...document.querySelectorAll('[data-cover-keys] > *')].map(e=>getComputedStyle(e).opacity).filter(o=>o!=='1').length,
  }));
  if (rm==='no-preference') await p.screenshot({ path: out+'motion-final.png' });
  // scroll through the page and verify section reveals complete
  const H = await p.evaluate(()=>document.documentElement.scrollHeight);
  for (let y=0;y<H;y+=500){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(140);} await p.waitForTimeout(1800);
  const hidden = await p.evaluate(()=>[...document.querySelectorAll('[data-r]')].flatMap(el=> el.dataset.r==='rows'?[...el.children]:[el]).filter(el=>{const cs=getComputedStyle(el); return el.dataset.r!=='rule' && (parseFloat(cs.opacity)<0.99 || (cs.clipPath!=='none' && cs.clipPath!=='')) }).length);
  console.log(rm, JSON.stringify(s), 'hiddenAfterScroll:', hidden, 'errors:', errs.length);
  await p.close();
}
await b.close();
