import {get,list,put} from '@vercel/blob';
import {randomUUID} from 'node:crypto';
import type {Workspace} from './core';
export type Audit={id:string;at:string;actor:string;event:string;target:string;status:string};
export async function audit(w:Workspace,event:string,target='',status='completed'){
 const row:Audit={id:randomUUID(),at:new Date().toISOString(),actor:w.memberId||'root',event,target,status};
 await put(`knowledgeos/v1/${w.id}/audit/${row.at}-${row.id}.json`,JSON.stringify(row),{access:'private',addRandomSuffix:false,contentType:'application/json'});
}
export async function audited<T>(w:Workspace,event:string,target:string,fn:()=>Promise<T>):Promise<T>{
 await audit(w,event,target,'requested');
 try {const result=await fn();await audit(w,event,target).catch(()=>{});return result;}
 catch(e){await audit(w,event,target,'failed').catch(()=>{});throw e;}
}
export async function history(tenant:string){
 // Retain metadata only; source contents, questions, and credentials are never logged.
 let cursor:string|undefined;const paths:string[]=[];
 do{const page=await list({prefix:`knowledgeos/v1/${tenant}/audit/`,limit:1000,cursor});paths.push(...page.blobs.map(b=>b.pathname));cursor=page.hasMore?page.cursor:undefined;}while(cursor&&paths.length<10000);
 return Promise.all(paths.sort().reverse().slice(0,50).map(async path=>{const r=await get(path,{access:'private',useCache:false});if(!r||r.statusCode!==200)throw Error('audit unavailable');return JSON.parse(await new Response(r.stream).text()) as Audit;}));
}
export async function reserveAI(tenant:string){
 // Atomic create-if-absent daily slots bound AI calls across all function instances.
 // A failed attempt consumes a slot too; this intentionally fails closed.
 const day=new Date().toISOString().slice(0,10),limit=50;
 const prefix=`knowledgeos/v1/${tenant}/budget/${day}/`;
 const used=await list({prefix,limit:100});
 if(used.blobs.length>=limit)throw Error('ai_budget');
 for(let i=0;i<limit;i++){
  const pathname=`${prefix}${String(i).padStart(3,'0')}.json`;
  if(used.blobs.some(b=>b.pathname===pathname))continue;
  try{await put(pathname,'{}',{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json'});return;}
  catch(e){if(!String(e).toLowerCase().includes('already exists'))throw e;}
 }
 throw Error('ai_budget');
}
