import { get, list, put } from '@vercel/blob';
import { randomBytes, randomUUID } from 'node:crypto';
import { keyHash, equal, workspaces, verify, issue, sessionIdentity, validId, type Workspace, type Role } from './core';
export type Member={id:string;name:string;role:Role;keyHash:string;revoked:boolean;createdAt:string};
const path=(tenant:string,id:string)=>`knowledgeos/v1/${tenant}/members/${id}.json`;
async function member(tenant:string,id:string):Promise<Member|null>{
 if(!validId(id))return null;
 const r=await get(path(tenant,id),{access:'private',useCache:false});
 if(!r||r.statusCode!==200)return null;
 return JSON.parse(await new Response(r.stream).text());
}
function principal(w:Workspace,m:Member):Workspace{return {...w,key:m.keyHash,memberId:m.id,role:m.role};}
export async function current(token:string):Promise<Workspace|null>{
 const roots=workspaces();const root=verify(token,roots);if(root)return {...root,role:'owner',memberId:'root'};
 const who=sessionIdentity(token);if(!who)return null;
 const w=roots.find(w=>w.id===who.id);if(!w)return null;
 const m=await member(w.id,who.memberId);if(!m||m.revoked)return null;
 return verify(token,[principal(w,m)]);
}
export async function signin(key:string):Promise<string|null>{
 const roots=workspaces();const root=roots.find(w=>equal(w.key,key));if(root)return issue(root);
 const [tag,tenant,id,secret,extra]=key.split('.');
 if(tag!=='kos'||!secret||secret.length!==43||extra||!validId(id))return null;
 const w=roots.find(w=>w.id===tenant);if(!w)return null;
 const m=await member(tenant,id);if(!m||m.revoked||!equal(m.keyHash,keyHash(key)))return null;
 return issue(principal(w,m));
}
export async function members(tenant:string){
 const page=await list({prefix:`knowledgeos/v1/${tenant}/members/`,limit:100});
 const rows=await Promise.all(page.blobs.map(async b=>{const id=b.pathname.split('/').pop()!.replace('.json','');return member(tenant,id);}));
 return rows.filter((m):m is Member=>Boolean(m)).map(({keyHash,...safe})=>safe);
}
export async function invite(tenant:string,name:unknown,role:unknown){
 if(typeof name!=='string'||!name.trim()||name.length>100||!['viewer','editor','owner'].includes(String(role)))throw new Error('invalid_member');
 if((await members(tenant)).length>=50)throw new Error('member_limit');
 const id=randomUUID(),key=`kos.${tenant}.${id}.${randomBytes(32).toString('base64url')}`;
 const m:Member={id,name:name.trim(),role:role as Role,keyHash:keyHash(key),revoked:false,createdAt:new Date().toISOString()};
 await put(path(tenant,id),JSON.stringify(m),{access:'private',contentType:'application/json',addRandomSuffix:false});
 return {id,key};
}
export async function revoke(tenant:string,id:unknown){
 if(!validId(id))throw new Error('invalid_member');
 const m=await member(tenant,id);if(!m)throw new Error('invalid_member');
 await put(path(tenant,id),JSON.stringify({...m,revoked:true}),{access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:true});
}
