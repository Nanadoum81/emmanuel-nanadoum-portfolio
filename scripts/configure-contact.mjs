import {readFile} from 'node:fs/promises';
import {parseEnv} from 'node:util';
import {randomBytes,createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import postgres from 'postgres';

const link=JSON.parse(await readFile('.vercel/project.json','utf8'));
if(link.projectId!=='prj_841IK518O4LN8Yehv1K9W1T2RXb0')throw Error('Wrong portfolio project');
const env=parseEnv(await readFile(process.argv[2],'utf8'));
const db=postgres(env.DATABASE_URL,{ssl:'require',prepare:false,max:1});
const key='blair_live_'+randomBytes(24).toString('hex'),id='key_portfolio_'+randomBytes(8).toString('hex');
try{
  const existing=await db`select id from api_keys where org_id='org_blair' and name='Emmanuel portfolio contact intake' and revoked_at is null`;
  if(existing.length)throw Error('An active dedicated intake key already exists; reuse it rather than generating duplicates');
  await db`insert into api_keys(id,org_id,name,key_hash,scopes) values(${id},'org_blair','Emmanuel portfolio contact intake',${createHash('sha256').update(key).digest('hex')},'["intake"]'::jsonb)`;
  try{
    await new Promise((resolve,reject)=>{
      const child=spawn('vercel',['env','add','BLAIR_CONTACT_INTAKE_KEY','production','--sensitive','--yes','--force','--scope','emmanuel-nanandoums-projects'],{stdio:['pipe','pipe','pipe']});
      let output='';child.stdout.on('data',b=>output+=b);child.stderr.on('data',b=>output+=b);child.stdin.end(key);
      child.on('error',reject);child.on('close',code=>code===0?resolve():reject(Error(output.replaceAll(key,'[REDACTED]'))));
    });
    console.log(JSON.stringify({configured:true,project:link.projectId,keyId:id,scope:'intake',organization:'org_blair',secretExposed:false}));
  }catch(e){await db`update api_keys set revoked_at=now() where id=${id}`;throw e;}
}finally{await db.end();}
