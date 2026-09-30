import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
const b=await chromium.launch({channel:'chrome', headless:true});
const ctx=await b.newContext({userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'});
for (const u of ['https://api.leadconnectorhq.com/widget/bookings/blair-chiro-revenue-demo','https://blair-medspa.vibepreview.com']) {
  const p=await ctx.newPage(); const r=await p.goto(u,{waitUntil:'networkidle',timeout:60000}).catch(e=>null); await p.waitForTimeout(3000);
  console.log(u, r?.status(), '|', await p.title(), '|', (await p.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(0,220)); await p.close(); }
await b.close();
