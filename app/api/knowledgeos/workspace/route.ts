import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {COOKIE,canManage,isOwner,validateDocument,retrieve,validId} from '@/lib/knowledgeos/core';
import {current,signin,members,invite,revoke} from '@/lib/knowledgeos/members';
import {documents,save,remove,saveIndex,withIndexes,indexedIds} from '@/lib/knowledgeos/store';
import {audited,history,reserveAI} from '@/lib/knowledgeos/audit';
import {answerQuestion,indexDocument} from '@/lib/knowledgeos/ai';
import {extractPDF} from '@/lib/knowledgeos/pdf';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
const json=(body:unknown,status=200)=>NextResponse.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const session=async()=>current((await cookies()).get(COOKIE)?.value||'');
async function body(req:Request){
 if(!req.headers.get('content-type')?.includes('application/json'))throw Error('invalid_body');
 const reader=req.body?.getReader();if(!reader)throw Error('invalid_body');const chunks:Uint8Array[]=[];let bytes=0;
 try{for(;;){const r=await reader.read();if(r.done)break;bytes+=r.value.byteLength;if(bytes>2900000){await reader.cancel();throw Error('too_large');}chunks.push(r.value);}}finally{reader.releaseLock();}
 return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export async function GET(req:Request){
 try{
  const w=await session();if(!w)return json({error:'Sign in with your access key.'},401);
  const view=new URL(req.url).searchParams.get('view');
  if(view==='members'||view==='audit'){
   if(!isOwner(w))return json({error:'Owner access required.'},403);
   return json(view==='members'?{members:await members(w.id)}:{audit:await history(w.id)});
  }
  const [docs,indexed]=await Promise.all([documents(w.id),indexedIds(w.id)]);
  return json({workspace:{id:w.id,name:w.name,role:w.role||'owner',memberId:w.memberId||'root'},aiAvailable:Boolean(process.env.GEMINI_API_KEY),documents:docs.map(({text,index,...metadata})=>({...metadata,characters:text.length,indexed:indexed.has(metadata.id)}))});
 }catch{return json({error:'Workspace storage or configuration is unavailable.'},503);}
}
export async function POST(req:Request){
 let origin:URL;try{origin=new URL(req.headers.get('origin')||'');}catch{return json({error:'Invalid origin.'},403);}
 if(!['http:','https:'].includes(origin.protocol)||origin.host!==req.headers.get('host'))return json({error:'Invalid origin.'},403);
 try{
  const data=await body(req);if(!data||typeof data!=='object')return json({error:'Invalid request.'},400);
  if(data.action==='signout'){const r=json({ok:true});r.cookies.set(COOKIE,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:0});return r;}
  if(data.action==='signin'){
   if(typeof data.key!=='string'||data.key.length>256)return json({error:'Invalid access key.'},401);
   const token=await signin(data.key);if(!token)return json({error:'Invalid access key.'},401);
   const r=json({ok:true});r.cookies.set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:8*3600});return r;
  }
  const w=await session();if(!w)return json({error:'Session expired. Please sign in.'},401);
  if(['invite','revoke'].includes(data.action)){
   if(!isOwner(w))return json({error:'Owner access required.'},403);
   if(data.action==='invite')return json(await audited(w,'member.invite','',()=>invite(w.id,data.name,data.role)),201);
   if(data.id===w.memberId)return json({error:'You cannot revoke your current access.'},400);
   await audited(w,'member.revoke',String(data.id),()=>revoke(w.id,data.id));return json({ok:true});
  }
  if(['upload','delete','index'].includes(data.action)&&!canManage(w))return json({error:'Editor or owner access required.'},403);
  if(data.action==='upload'){
   let input;
   if(data.pdf!==undefined){if(typeof data.pdf!=='string')throw Error('invalid_pdf');input=validateDocument({title:data.title,text:await extractPDF(data.pdf)});}
   else input=validateDocument(data);
   if((await documents(w.id)).length>=50)return json({error:'Workspace limit: 50 documents. Remove a source before uploading.'},409);
   const doc=await audited(w,'document.upload','',()=>save(w.id,input));return json({id:doc.id},201);
  }
  if(data.action==='delete'){
   if(!validId(data.id))return json({error:'Valid document ID required.'},400);
   await audited(w,'document.delete',data.id,()=>remove(w.id,data.id));return json({ok:true});
  }
  if(data.action==='index'){
   if(data.aiConsent!==true)return json({error:'Confirm sending this document to Gemini for indexing.'},400);
   const doc=(await documents(w.id)).find(d=>d.id===data.id);if(!doc)return json({error:'Source not found.'},404);
   if(!process.env.GEMINI_API_KEY)throw Error('ai_unavailable');
   await reserveAI(w.id);
   await audited(w,'document.index',doc.id,async()=>saveIndex(w.id,doc.id,await indexDocument(doc)));
   return json({ok:true});
  }
  if(data.action==='ask'){
   if(typeof data.question!=='string'||!data.question.trim()||data.question.length>600)return json({error:'Enter a question of 1–600 characters.'},400);
   const docs=await documents(w.id);
   if(data.aiConsent===true){if(!process.env.GEMINI_API_KEY)throw Error('ai_unavailable');await reserveAI(w.id);return json(await audited(w,'question.ai','',async()=>answerQuestion(data.question,await withIndexes(w.id,docs))));}
   return json({...retrieve(data.question,docs),mode:'extract',retrieval:'lexical'});
  }
  return json({error:'Unknown action.'},400);
 }catch(e){
  const message=e instanceof Error?e.message:'';
  const errors:Record<string,string>={invalid_pdf:'Use a valid, unencrypted PDF up to 2 MB.',pdf_pages:'PDF limit: 50 pages.',pdf_text_limit:'Extracted PDF text exceeds 100 KB. Split the document.',pdf_no_text:'This PDF has no readable text. Use OCR before uploading.',invalid_member:'Choose a valid member name and role.',member_limit:'Workspace limit: 50 invitations.',ai_unavailable:'Gemini is unavailable. Use source search or try again later.',ai_budget:'Daily AI limit reached (50 indexing or question operations). Source search is still available.',too_large:'Upload too large. PDFs support 2 MB; document text supports 100 KB.'};
  if(errors[message])return json({error:errors[message]},message==='ai_budget'?429:message==='ai_unavailable'?503:400);
  if(message.startsWith('Use a title'))return json({error:message},400);
  if(e instanceof SyntaxError||message==='invalid_body'||message==='invalid document id')return json({error:'Invalid request.'},400);
  return json({error:'The operation could not be confirmed. Refresh to check the latest state before retrying.'},503);
 }
}
