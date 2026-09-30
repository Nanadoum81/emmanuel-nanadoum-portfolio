import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
const b=await chromium.launch({channel:'chrome'});
for (const [w,h] of [[1440,900],[1280,800],[1366,768],[1536,864]]) { const p=await b.newPage({viewport:{width:w,height:h},reducedMotion:'reduce'}); await p.goto(process.argv[2]||'http://localhost:3200/',{waitUntil:'networkidle'});
  const r=await p.evaluate(()=>{const k=document.querySelector('[data-cover-keys]').getBoundingClientRect(); const i=document.querySelector('nav[aria-label="Exhibit index"]').getBoundingClientRect(); return {keysBottom:Math.round(k.bottom), indexTop:Math.round(i.top)}});
  console.log(`${w}x${h}`, JSON.stringify(r), r.keysBottom<=h?'KEYS ABOVE FOLD':'below fold'); await p.close(); }
await b.close();
