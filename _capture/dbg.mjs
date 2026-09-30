import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
const b = await chromium.launch({channel:'chrome'}); const p = await b.newPage({viewport:{width:390,height:844}});
await p.goto(process.argv[2]||'https://emmanuel-nanadoum.vercel.app/',{waitUntil:'networkidle'});
console.log(await p.evaluate(()=>{ const vw=document.documentElement.clientWidth; return [...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect(); return r.right>vw+1 && r.width>0 && !e.closest('.snap-x')}).slice(0,12).map(e=>`${e.tagName} w=${Math.round(e.getBoundingClientRect().width)} r=${Math.round(e.getBoundingClientRect().right)} ${String(e.className).slice(0,70)}`).join('\n')}));
await b.close();
