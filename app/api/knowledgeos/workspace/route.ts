import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE, workspaces, equal, issue, verify, validateDocument, retrieve } from '@/lib/knowledgeos/core';
import { documents, save, remove } from '@/lib/knowledgeos/store';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const json = (body: unknown, status = 200) => NextResponse.json(body, {status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function session() { return verify((await cookies()).get(COOKIE)?.value || '',workspaces()); }
async function body(req: Request) {
  if (!req.headers.get('content-type')?.includes('application/json')) throw new Error('invalid_body');
  if (Number(req.headers.get('content-length')) > 120000) throw new Error('too_large');
  const reader = req.body?.getReader(); if (!reader) throw new Error('invalid_body');
  const chunks: Uint8Array[] = []; let bytes = 0;
  try { for (;;) { const r = await reader.read(); if(r.done) break; bytes += r.value.byteLength; if(bytes > 120000) { await reader.cancel(); throw new Error('too_large'); } chunks.push(r.value); } } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export async function GET() {
  try {
    const w = await session(); if (!w) return json({error:'Sign in with your workspace access key.'},401);
    const docs = await documents(w.id);
    return json({workspace:{id:w.id,name:w.name},documents:docs.map(({text,...metadata})=>({...metadata,characters:text.length}))});
  } catch { return json({error:'Workspace storage or configuration is unavailable.'},503); }
}
export async function POST(req: Request) {
  // All browser mutations require exact same-origin requests, including sign-in.
  let origin: URL;
  try { origin = new URL(req.headers.get('origin') || ''); } catch { return json({error:'Invalid origin.'},403); }
  if (!['http:', 'https:'].includes(origin.protocol) || origin.host !== req.headers.get('host')) return json({error:'Invalid origin.'},403);
  try {
    const data = await body(req);
    if (!data || typeof data !== 'object') return json({error:'Invalid request.'},400);
    if (data.action === 'signout') { const r=json({ok:true}); r.cookies.set(COOKIE,'',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:0}); return r; }
    if (data.action === 'signin') {
      if (typeof data.key !== 'string' || data.key.length > 256) return json({error:'Invalid access key.'},401);
      const w=workspaces().find(w=>equal(w.key,data.key));
      if(!w) return json({error:'Invalid access key.'},401);
      const r=json({ok:true}); r.cookies.set(COOKIE,issue(w),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:8*3600}); return r;
    }
    const w=await session(); if(!w) return json({error:'Session expired. Please sign in.'},401);
    if(data.action==='upload') { const input=validateDocument(data); const doc=await save(w.id,input); return json({id:doc.id},201); }
    if(data.action==='delete') { if(typeof data.id!=='string') return json({error:'Document required.'},400); await remove(w.id,data.id); return json({ok:true}); }
    if(data.action==='ask') {
      if(typeof data.question!=='string' || !data.question.trim() || data.question.length>600) return json({error:'Enter a question of 1–600 characters.'},400);
      return json(retrieve(data.question,await documents(w.id)));
    }
    return json({error:'Unknown action.'},400);
  } catch(e) {
    const message=e instanceof Error?e.message:'';
    if(message==='too_large') return json({error:'Document exceeds the 100 KB upload limit.'},413);
    if(message.startsWith('Use a title')) return json({error:message},400);
    if(e instanceof SyntaxError || message==='invalid_body' || message==='invalid document id') return json({error:'Invalid request.'},400);
    return json({error:'Workspace storage or configuration is unavailable. No success was recorded.'},503);
  }
}
