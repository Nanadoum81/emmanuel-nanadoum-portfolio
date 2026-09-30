import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
import fs from 'fs';
const out = decodeURIComponent(new URL('./text/', import.meta.url).pathname); fs.mkdirSync(out,{recursive:true});
const t = [['cactus-rs','https://cactus-chiro.vibepreview.app/revenue-system'],['palmer-rs','https://palmer-chiropractic.vibepreview.app/revenue-system'],['canham-rs','https://canham-compass.vibepreview.app/revenue-system'],['palmer','https://palmer-chiropractic.vibepreview.app'],['nelson','https://nelson-chiro.vibepreview.app'],['coyote','https://coyote-wellness.vibepreview.app'],['canham','https://canham-compass.vibepreview.app'],['cactus','https://cactus-chiro.vibepreview.app'],['medspa','https://blair-medspa.vibepreview.com'],['vybe','https://vybe-app-blue.vercel.app/variation5/'],['vybe-voice','https://vybe-app-blue.vercel.app/variation5/experience/']];
const b = await chromium.launch({channel:'chrome'});
const ctx = await b.newContext({viewport:{width:1440,height:900}, userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'});
for (const [n,u] of t) { const p = await ctx.newPage(); await p.goto(u,{waitUntil:'networkidle',timeout:60000}); await p.waitForTimeout(2000);
  const txt = await p.evaluate(()=>document.body.innerText); const links = await p.evaluate(()=>[...new Set([...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')))].join('\n'));
  fs.writeFileSync(out+n+'.txt', txt+'\n\n=== LINKS ===\n'+links); console.log(n, txt.length); await p.close(); }
await b.close();
