import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
if (!process.env.BLOB_READ_WRITE_TOKEN) { console.error('Set BLOB_READ_WRITE_TOKEN to run real storage integration checks.'); process.exit(1); }
const base='http://127.0.0.1:3017',nonce=randomBytes(6).toString('hex');
const rows=[{id:`qa-alpha-${nonce}`,name:'Alpha',key:randomBytes(32).toString('base64url')},{id:`qa-beta-${nonce}`,name:'Beta',key:randomBytes(32).toString('base64url')}];
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3017'],{cwd:process.cwd(),env:{...process.env,KNOWLEDGEOS_SESSION_SECRET:randomBytes(32).toString('base64url'),KNOWLEDGEOS_WORKSPACES:JSON.stringify(rows)},stdio:['ignore','pipe','pipe']});
let logs='';child.stdout.on('data',x=>logs+=x);child.stderr.on('data',x=>logs+=x);
const post=(data,cookie='')=>fetch(base+'/api/knowledgeos/workspace',{method:'POST',headers:{'content-type':'application/json',origin:base,cookie},body:JSON.stringify(data)});
const inventory=cookie=>fetch(base+'/api/knowledgeos/workspace',{headers:{cookie}}).then(async r=>{assert.equal(r.status,200);return r.json();});
let alpha='',id='';
try{
 for(let i=0;i<100;i++){try{await fetch(base);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 const a=await post({action:'signin',key:rows[0].key});assert.equal(a.status,200);alpha=a.headers.get('set-cookie').split(';')[0];
 const b=await post({action:'signin',key:rows[1].key});assert.equal(b.status,200);const beta=b.headers.get('set-cookie').split(';')[0];
 const original=`Orchid-${nonce} deployment procedure requires release captain approval.`;
 const upload=await post({action:'upload',title:'QA isolated document',text:original},alpha);assert.equal(upload.status,201,await upload.clone().text());id=(await upload.json()).id;
 assert.ok((await inventory(alpha)).documents.some(d=>d.id===id));
 assert.equal((await inventory(beta)).documents.length,0);
 const query=async cookie=>{const r=await post({action:'ask',question:`Orchid-${nonce} deployment procedure`},cookie);assert.equal(r.status,200);return r.json();};
 assert.equal((await query(alpha)).sources[0].excerpt,original);
 assert.equal((await query(beta)).sources.length,0);
 assert.equal((await post({action:'delete',id},beta)).status,200);
 assert.ok((await inventory(alpha)).documents.some(d=>d.id===id));
 assert.equal((await post({action:'delete',id},alpha)).status,200);
 assert.equal((await inventory(alpha)).documents.length,0);
 assert.equal((await query(alpha)).sources.length,0);id='';
 console.log('PASS real private Blob: upload, persisted inventory, exact excerpt, second-workspace isolation, cross-workspace delete isolation, deletion, retrieval cleanup.');
}catch(e){console.error(logs);throw e;}finally{if(id&&alpha)await post({action:'delete',id},alpha).catch(()=>{});child.kill('SIGTERM');}
