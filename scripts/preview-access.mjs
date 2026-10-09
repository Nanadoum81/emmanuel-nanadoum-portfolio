import {readFile,writeFile,unlink} from 'node:fs/promises';

const auth=JSON.parse(await readFile(process.env.HOME+'/Library/Application Support/com.vercel.cli/auth.json','utf8'));
const link=JSON.parse(await readFile('.vercel/project.json','utf8'));
if(link.projectId!=='prj_841IK518O4LN8Yehv1K9W1T2RXb0')throw Error('Wrong project');
const endpoint=`https://api.vercel.com/v1/projects/${link.projectId}/protection-bypass?teamId=${link.orgId}`;
const headers={Authorization:'Bearer '+auth.token,'Content-Type':'application/json'};
const file='.vercel/verification-bypass.json';
const note='Temporary portfolio workflow verification; revoke after testing';
async function existing(){
  const r=await fetch(`https://api.vercel.com/v9/projects/${link.projectId}?teamId=${link.orgId}`,{headers});
  if(!r.ok)throw Error('Could not inspect preview access: '+r.status);
  const project=await r.json();
  const matches=Object.entries(project.protectionBypass||{}).filter(([,value])=>value.note===note);
  if(matches.length>1)throw Error('Unexpected duplicate verification access');
  return matches[0]?.[0];
}
if(process.argv.includes('--revoke')){
  const {secret}=JSON.parse(await readFile(file,'utf8'));
  const r=await fetch(endpoint,{method:'PATCH',headers,body:JSON.stringify({revoke:{secret,regenerate:false}})});
  if(!r.ok)throw Error('Temporary bypass revocation failed: '+r.status);
  await unlink(file);console.log('Temporary verification access revoked.');
}else{
  try{await readFile(file);throw Error('Temporary access already exists; reuse or revoke it');}catch(e){if(e.code!=='ENOENT')throw e;}
  let secret=await existing();
  if(!secret){
    const r=await fetch(endpoint,{method:'PATCH',headers,body:JSON.stringify({generate:{note}})});
    if(!r.ok)throw Error('Temporary preview access failed: '+r.status);
    secret=await existing();
  }
  if(typeof secret!=='string')throw Error('Unexpected bypass response (not logged)');
  await writeFile(file,JSON.stringify({secret}),{mode:0o600});console.log('Temporary preview access stored only in ignored local metadata.');
}
