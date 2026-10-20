import {reserveAI} from '../lib/knowledgeos/audit.ts';
import {list,put,del} from '@vercel/blob';
if(!process.env.BLOB_READ_WRITE_TOKEN)throw Error('Private Blob token required');
const tenant='qa-budget-'+Date.now(),prefix=`knowledgeos/v1/${tenant}/budget/${new Date().toISOString().slice(0,10)}/`;
try{
 await Promise.all([reserveAI(tenant),reserveAI(tenant)]);
 const initial=await list({prefix,limit:100});if(initial.blobs.length!==2)throw Error('Concurrent reservations shared a slot');
 for(let i=2;i<50;i++)await put(`${prefix}${String(i).padStart(3,'0')}.json`,'{}',{access:'private',addRandomSuffix:false,contentType:'application/json'});
 try{await reserveAI(tenant);throw Error('Budget cap failed');}catch(e){if(e.message!=='ai_budget')throw e;}
 console.log('PASS: concurrent AI reservations use unique durable slots; operation 51 is denied.');
}finally{const p=await list({prefix,limit:100});if(p.blobs.length)await del(p.blobs.map(b=>b.pathname));}
