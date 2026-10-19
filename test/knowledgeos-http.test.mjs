import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const port=3014,base=`http://127.0.0.1:${port}`;
const key='a'.repeat(50);
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{cwd:process.cwd(),env:{...process.env,KNOWLEDGEOS_SESSION_SECRET:'s'.repeat(50),KNOWLEDGEOS_WORKSPACES:JSON.stringify([{id:'alpha',name:'Alpha',key}])},stdio:['ignore','pipe','pipe']});
let logs='';child.stdout.on('data',x=>logs+=x);child.stderr.on('data',x=>logs+=x);
const post=(data,cookie='',origin=base)=>fetch(base+'/api/knowledgeos/workspace',{method:'POST',headers:{'content-type':'application/json',origin,cookie},body:JSON.stringify(data)});
try{
 for(let i=0;i<100;i++){try{await fetch(base);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 assert.equal((await fetch(base+'/knowledgeos/workspace')).status,200);
 assert.equal((await fetch(base+'/api/knowledgeos/workspace')).status,401);
 for(const action of ['upload','delete','ask'])assert.equal((await post({action})).status,401);
 assert.equal((await post({action:'signin',key},'','https://evil.example')).status,403);
 assert.equal((await post({action:'signin',key:'wrong'})).status,401);
 const login=await post({action:'signin',key});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie');assert.ok(cookie.includes('HttpOnly'));assert.ok(cookie.includes('SameSite=strict'));assert.ok(cookie.includes('Secure'));
 assert.equal((await post({action:'upload',title:'x',text:''},cookie)).status,400);
 assert.equal((await post({action:'delete',id:'../beta'},cookie)).status,400);
 assert.equal((await post({action:'ask',question:''},cookie)).status,400);
 assert.equal((await post({action:'upload',title:'x',text:'valid source'},cookie)).status,503);
 assert.equal((await post({action:'signout'},cookie)).status,200);
 console.log('11 HTTP checks passed: page, signed-out boundaries, origin, login/cookie, validation, storage failure, signout.');
}catch(e){console.error(logs);throw e;}finally{child.kill('SIGTERM');}
