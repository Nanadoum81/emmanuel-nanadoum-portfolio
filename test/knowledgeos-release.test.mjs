import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {list,del} from '@vercel/blob';
import {makePDF} from './helpers/pdf-fixture.mjs';
if(!process.env.BLOB_READ_WRITE_TOKEN)throw Error('Private Blob token required');
const base=process.env.KOS_TEST_URL||'http://127.0.0.1:3024';
const nonce=randomBytes(5).toString('hex');
const rows=[{id:`qa-release-${nonce}`,name:'Release QA',key:randomBytes(32).toString('base64url')},{id:`qa-other-${nonce}`,name:'Other QA',key:randomBytes(32).toString('base64url')}];
let child,logs='';
if(!process.env.KOS_TEST_URL){
 child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3024'],{cwd:process.cwd(),env:{...process.env,KNOWLEDGEOS_SESSION_SECRET:randomBytes(32).toString('base64url'),KNOWLEDGEOS_WORKSPACES:JSON.stringify(rows)},stdio:['ignore','pipe','pipe']});
 child.stdout.on('data',x=>logs+=x);child.stderr.on('data',x=>logs+=x);
}
const post=(data,cookie='')=>fetch(base+'/api/knowledgeos/workspace',{method:'POST',headers:{'content-type':'application/json',origin:base,cookie},body:JSON.stringify(data)});
const get=(cookie,view='')=>fetch(base+'/api/knowledgeos/workspace'+(view?'?view='+view:''),{headers:{cookie}});
const login=async key=>{const r=await post({action:'signin',key});assert.equal(r.status,200,await r.clone().text());return r.headers.get('set-cookie').split(';')[0];};
try{
 for(let i=0;i<100;i++){try{await fetch(base);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 const root=await login(rows[0].key),other=await login(rows[1].key);
 const create=async role=>{const r=await post({action:'invite',name:`QA ${role}`,role},root);assert.equal(r.status,201,await r.clone().text());return r.json();};
 const vi=await create('viewer'),ed=await create('editor'),viewer=await login(vi.key),editor=await login(ed.key);
 assert.equal((await (await get(viewer)).json()).workspace.role,'viewer');
 for(const action of ['upload','delete','index','invite','revoke'])assert.equal((await post({action,title:'No',text:'No',role:'owner'},viewer)).status,403,action);
 for(const action of ['invite','revoke'])assert.equal((await post({action},editor)).status,403,action);
 assert.equal((await get(viewer,'members')).status,403);assert.equal((await get(editor,'audit')).status,403);
 const pdf=await post({action:'upload',title:'PDF release policy',pdf:makePDF()},editor);assert.equal(pdf.status,201,await pdf.clone().text());const {id}=await pdf.json();
 const inventory=await (await get(viewer)).json();assert.ok(inventory.documents.some(d=>d.id===id));assert.ok(!JSON.stringify(inventory).includes('release captain approves'));
 const ask=await post({action:'ask',question:'release captain production launches'},viewer);assert.equal(ask.status,200);const evidence=await ask.json();assert.match(evidence.sources[0].excerpt,/release captain/);assert.match(evidence.sources[0].excerpt,/Page 1/);
 assert.equal((await (await get(other)).json()).documents.length,0);
 await post({action:'delete',id},other);assert.ok((await (await get(root)).json()).documents.some(d=>d.id===id));
 assert.equal((await post({action:'index',id,aiConsent:false},editor)).status,400);
 assert.equal((await post({action:'upload',title:'Invalid',pdf:'broken'},editor)).status,400);
 assert.equal((await post({action:'revoke',id:vi.id},root)).status,200);
 assert.equal((await get(viewer)).status,401);assert.equal((await post({action:'signin',key:vi.key})).status,401);
 const activity=await (await get(root,'audit')).json();assert.ok(activity.audit.some(a=>a.event==='member.revoke'&&a.status==='completed'));assert.ok(activity.audit.some(a=>a.event==='document.upload'));
 assert.equal((await post({action:'delete',id},editor)).status,200);assert.equal((await (await get(root)).json()).documents.length,0);
 console.log('PASS: real PDF upload, editor/viewer/owner authorization, persisted excerpts, metadata minimization, tenant isolation, revocation of active sessions, audit, deletion.');
}catch(e){console.error(logs);throw e;}finally{
 child?.kill('SIGTERM');
 for(const w of rows){let cursor;do{const page=await list({prefix:`knowledgeos/v1/${w.id}/`,limit:1000,cursor});if(page.blobs.length)await del(page.blobs.map(b=>b.pathname));cursor=page.hasMore?page.cursor:undefined;}while(cursor);}
}
