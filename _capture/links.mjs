import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
const BASE='https://emmanuel-nanadoum.vercel.app';
const pages=['/','/work','/work/vybe','/work/cactus','/work/palmer-herman','/work/blair-revenue-systems','/about','/contact','/resume','/solutions','/solutions/cactus','/solutions/palmer-herman','/solutions/canham','/solutions/nelson','/solutions/coyote','/solutions/blair-medspa','/nope'];
const b=await chromium.launch({channel:'chrome'}); const p=await b.newPage();
const all=new Map(); const anchors=[];
for(const path of pages){ await p.goto(BASE+path,{waitUntil:'domcontentloaded'});
  const hrefs=await p.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>({h:a.getAttribute('href'),t:a.getAttribute('target'),r:a.getAttribute('rel')})));
  for(const {h,t,r} of hrefs){ if(!all.has(h)) all.set(h,new Set()); all.get(h).add(path);
    if(/^https?:/.test(h) && !h.startsWith(BASE) && t!=='_blank') anchors.push(`no _blank: ${h} on ${path}`);
    if(t==='_blank' && !(r||'').includes('noopener')) anchors.push(`no noopener: ${h}`); }
  const ids=await p.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1 && !document.getElementById(h.slice(1))));
  ids.forEach(i=>anchors.push(`dead anchor ${i} on ${path}`));
}
await b.close();
const res=[];
for(const [h,src] of all){ if(h.startsWith('#')||h.startsWith('mailto:')||h.startsWith('tel:')){ res.push(`OK-${h.split(':')[0]||'anchor'} ${h}`); continue; }
  const url=h.startsWith('/')?BASE+h:h; let code;
  try{ const r=await fetch(url,{redirect:'follow',headers:{'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/141 Safari/537.36'}}); code=r.status; }catch(e){ code='ERR '+e.message; }
  res.push(`${code} ${h}`); }
console.log(res.filter(x=>!x.startsWith('200')&&!x.startsWith('OK')).join('\n')||'all fetched links 200');
console.log('total unique hrefs', all.size, '| mailto/tel/anchors:', res.filter(x=>x.startsWith('OK')).length);
console.log(res.filter(x=>x.startsWith('OK-mailto')||x.startsWith('OK-tel')).join('\n'));
console.log(anchors.join('\n')||'target/rel/anchors OK');
