import { list, put, del, get } from '@vercel/blob';
import { randomUUID } from 'node:crypto';
import type { Document } from './core';
const prefix = (tenant: string) => `knowledgeos/v1/${tenant}/documents/`;
export async function documents(tenant: string): Promise<Document[]> {
  const result: Document[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({prefix:prefix(tenant),cursor,limit:100});
    const rows = await Promise.all(page.blobs.map(async b => {
      const response = await get(b.pathname, {access:'private',useCache:false});
      if (!response || response.statusCode !== 200) throw new Error('document read failed');
      return JSON.parse(await new Response(response.stream).text()) as Document;
    }));
    result.push(...rows); cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return result.sort((a,b) => b.createdAt.localeCompare(a.createdAt));
}
export async function save(tenant: string, input: {title:string;text:string}) {
  const doc: Document = {...input,id:randomUUID(),createdAt:new Date().toISOString()};
  await put(`${prefix(tenant)}${doc.id}.json`, JSON.stringify(doc), {access:'private',contentType:'application/json',addRandomSuffix:false});
  return doc;
}
export async function remove(tenant: string, id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id)) throw new Error('invalid document id');
  // Construct the pathname from authenticated tenant; never accept arbitrary URLs.
  await del([`${prefix(tenant)}${id}.json`, `knowledgeos/v1/${tenant}/indexes/${id}.json`]);
}

export async function saveIndex(tenant:string,id:string,index:NonNullable<Document['index']>){
 await put(`knowledgeos/v1/${tenant}/indexes/${id}.json`,JSON.stringify(index),{access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:true});
}
export async function withIndexes(tenant:string,docs:Document[]):Promise<Document[]>{
 return Promise.all(docs.map(async d=>{
  const r=await get(`knowledgeos/v1/${tenant}/indexes/${d.id}.json`,{access:'private',useCache:false});
  if(!r||r.statusCode!==200)return d;
  return {...d,index:JSON.parse(await new Response(r.stream).text())};
 }));
}
export async function indexedIds(tenant:string){
 const page=await list({prefix:`knowledgeos/v1/${tenant}/indexes/`,limit:100});
 return new Set(page.blobs.map(b=>b.pathname.split('/').pop()!.replace('.json','')));
}
