import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
const out = decodeURIComponent(new URL('./raw/', import.meta.url).pathname);
const shots = JSON.parse(process.argv[2]);
const b = await chromium.launch({channel:'chrome'});
for (const [n,u,t,off=100,mobile] of shots) {
  const ctx = await b.newContext(mobile ? {viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'} : {viewport:{width:1440,height:900}, deviceScaleFactor:2, reducedMotion:'reduce', userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'});
  const p = await ctx.newPage();
  try { await p.goto(u,{waitUntil:'networkidle',timeout:60000}); await p.waitForTimeout(1200);
    await p.addStyleTag({content:'html,body{scroll-behavior:auto!important}'});
    const h = await p.evaluate(()=>document.documentElement.scrollHeight);
    for (let y=0;y<h;y+=800){ await p.evaluate(v=>window.scrollTo(0,v),y); await p.waitForTimeout(120); }
    const y = await p.getByText(t,{exact:false}).first().evaluate(el=>el.getBoundingClientRect().top+window.scrollY);
    await p.evaluate(v=>window.scrollTo(0,v), Math.max(0,y-off)); await p.waitForTimeout(1500);
    await p.screenshot({path:`${out}${n}.png`}); console.log('ok',n,Math.round(y));
  } catch(e){ console.log('FAIL',n,e.message.split('\n')[0]); }
  await ctx.close(); }
await b.close();
