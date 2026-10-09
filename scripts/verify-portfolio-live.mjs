import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import {randomBytes} from 'node:crypto';
import postgres from 'postgres';
import {chromium} from 'playwright';

const origin=process.argv[3];
if(!/^https:\/\/emmanuel-nanadoum[a-z0-9-]*\.vercel\.app$/.test(origin||''))throw Error('Select the explicit portfolio deployment');
const env=parseEnv(await readFile(process.argv[2],'utf8'));
const local=parseEnv(await readFile('.env.local','utf8').catch(()=>''));
const oidc=process.env.VERCEL_OIDC_TOKEN||local.VERCEL_OIDC_TOKEN;
const access=JSON.parse(await readFile('.vercel/verification-bypass.json','utf8').catch(()=>'{}'));
const headers=access.secret?{'x-vercel-protection-bypass':access.secret}:oidc?{'x-vercel-trusted-oidc-idp-token':oidc}:{};
const fetchPortfolio=(url,options={})=>fetch(url,{...options,headers:{...headers,...options.headers}});
const db=postgres(env.DATABASE_URL,{ssl:'require',prepare:false,max:1});
const marker='qa_portfolio_'+randomBytes(6).toString('hex'),email=marker+'@example.invalid';
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH});
const evidence=[];const record=check=>{evidence.push(check);console.log(JSON.stringify({check}));};
const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage();
if(Object.keys(headers).length)await context.route(origin+'/**',route=>route.continue({headers:{...route.request().headers(),...headers}}));
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
  await mkdir('artifacts',{recursive:true});
  for(const width of [1440,390]){
    await page.setViewportSize({width,height:width===1440?1000:844});
    for(const path of ['/','/work','/contact','/knowledgeos']){
      const response=await page.goto(origin+path,{waitUntil:'networkidle'});assert.equal(response.status(),200);
      assert.ok(await page.locator('h1').first().isVisible());
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow on '+path+' at '+width);
      const images=page.locator('img');
      for(let index=0;index<await images.count();index++){
        const image=images.nth(index);
        if(await image.isVisible()){
          await image.scrollIntoViewIfNeeded();
          await image.evaluate(img=>img.decode());
        }
      }
      await page.evaluate(()=>window.scrollTo(0,0));
      assert.deepEqual(await images.evaluateAll(images=>images.filter(img=>{const r=img.getBoundingClientRect();return r.width>0&&r.height>0&&(!img.complete||!img.naturalWidth);}).map(img=>img.src)),[]);
      await page.screenshot({path:'artifacts/portfolio-'+(path.slice(1)||'home')+'-'+width+'.png',fullPage:true});
    }
  }
  record('desktop/mobile home, work, contact and KnowledgeOS render without overflow; all visible image assets decode after scrolling');
  await page.goto(origin+'/contact');
  await page.locator('input[name="name"]').fill('QA Portfolio Visitor');await page.locator('input[name="email"]').fill(email);await page.locator('textarea[name="message"]').fill('Labeled disposable portfolio workflow verification '+marker);
  await page.getByRole('button',{name:'Send message'}).click();await page.getByRole('status').filter({hasText:'Thank you.'}).waitFor({timeout:45000});
  const again=await fetchPortfolio(origin+'/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'QA Portfolio Visitor',email,message:'Labeled duplicate capture '+marker,org_id:'forged_org'})});assert.equal(again.status,200);assert.equal((await again.json()).ok,true);
  const contacts=await db`select id,org_id from contacts where email=${email}`;assert.equal(contacts.length,1);assert.equal(contacts[0].org_id,'org_blair');
  const leads=await db`select id from leads where contact_id=${contacts[0].id} and org_id='org_blair'`;assert.equal(leads.length,1);
  assert.equal((await db`select id from messages where contact_id=${contacts[0].id} and direction='out'`).length,0);
  record('signed-out mobile contact and repeated delivery persist exactly one Blair OS contact/lead with correct organization and no outbound messages');
  await page.goto(origin+'/knowledgeos');
  for(const [question,expected] of [['How many vacation days do new employees receive?','15'],["What is the company's parental leave policy?","I can't verify that from the current knowledge base."]]){
    await page.locator('#q').fill(question);await page.getByRole('button',{name:'Ask KnowledgeOS',exact:true}).click();
    await page.getByRole('button',{name:'Ask KnowledgeOS',exact:true}).waitFor({timeout:60000});
    assert.ok((await page.locator('main').innerText()).includes(expected));
  }
  record('real KnowledgeOS UI answers known vacation policy and refuses absent parental policy');
  for(const [question,status] of [[null,400],[{},400],['x'.repeat(601),400]]){
    const r=await fetchPortfolio(origin+'/api/knowledgeos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question})});assert.equal(r.status,status);
  }
  const answer=await fetchPortfolio(origin+'/api/knowledgeos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:'Can employees share admin accounts?'})});
  const result=await answer.json();assert.equal(answer.status,200);assert.ok(result.answer.includes('[S1]'));assert.equal(result.sources[0].section,'Access Control');assert.equal(result.sources.length,1);
  record('known security answer cites its actual sample document; malformed and oversized requests reject cleanly; retrieval='+result.retrieval);
  const links=await page.locator('a[href^="/"]').evaluateAll(links=>[...new Set(links.map(a=>a.getAttribute('href').split('#')[0]).filter(Boolean))]);
  for(const link of links){const r=await fetchPortfolio(origin+link);assert.equal(r.status,200,'Broken internal link '+link);}
  assert.deepEqual(errors,[]);record('internal navigation and browser JavaScript checks pass');
}finally{
  const contacts=await db`select id from contacts where email=${email} and org_id='org_blair'`;
  for(const contact of contacts){
    const leads=await db`select id from leads where contact_id=${contact.id} and org_id='org_blair'`;
    const ids=leads.map(l=>l.id);
    await db`delete from audit_log where org_id='org_blair' and entity_id in ${db(ids.length?ids:['none'])}`;
    await db`delete from automation_steps where run_id in (select id from automation_runs where org_id='org_blair' and contact_id=${contact.id})`;
    await db`delete from automation_runs where org_id='org_blair' and contact_id=${contact.id}`;
    for(const table of ['messages','activities','approvals','notes','tasks'])await db.unsafe(`delete from ${table} where org_id='org_blair' and contact_id=$1`,[contact.id]);
    await db`delete from leads where org_id='org_blair' and contact_id=${contact.id}`;
    await db`delete from contacts where org_id='org_blair' and id=${contact.id}`;
  }
  await browser.close();await db.end();record('only labeled portfolio test data removed');
}
console.log(JSON.stringify({verifiedChecks:evidence.length,origin,outreachSent:false}));
