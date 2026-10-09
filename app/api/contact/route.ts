import { NextResponse } from "next/server";

export const runtime = "nodejs";
const hits = new Map<string,{count:number;expires:number}>();

export async function POST(req:Request){
  if(Number(req.headers.get("content-length")||0)>10000) return NextResponse.json({error:"too_large"},{status:413});
  const raw=await req.text();
  if(raw.length>10000) return NextResponse.json({error:"too_large"},{status:413});
  let body;
  try{body=JSON.parse(raw);}catch{return NextResponse.json({error:"bad_request"},{status:400});}
  if(!body||typeof body!=="object") return NextResponse.json({error:"bad_request"},{status:400});
  if(body.fax) return NextResponse.json({ok:true});
  const name=typeof body.name==="string"?body.name.trim():"";
  const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";
  const message=typeof body.message==="string"?body.message.trim():"";
  if(!name||name.length>160||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||!message||message.length>4000) return NextResponse.json({error:"valid_name_email_message_required"},{status:400});
  const ip=(req.headers.get("x-forwarded-for")||"anonymous").split(",")[0].trim(),now=Date.now();
  for(const [key,value] of hits) if(value.expires<now) hits.delete(key);
  const hit=hits.get(ip)||{count:0,expires:now+600000};
  if(++hit.count>10) return NextResponse.json({error:"rate_limited"},{status:429});
  hits.set(ip,hit);
  const token=process.env.BLAIR_CONTACT_INTAKE_KEY;
  if(!token) return NextResponse.json({error:"contact_unavailable"},{status:503});
  try{
    const url=new URL("/api/crm?action=create_lead",process.env.BLAIR_CONTACT_CRM_ORIGIN||"https://blair-os-v6.vercel.app");
    if(url.protocol!=="https:") throw new Error("invalid_origin");
    const response=await fetch(url,{method:"POST",headers:{"content-type":"application/json",authorization:`Bearer ${token}`},body:JSON.stringify({contact_name:name,email,company:typeof body.company==="string"?body.company.slice(0,180):"",message,source:"Emmanuel Portfolio"}),redirect:"error",signal:AbortSignal.timeout(25000)});
    const result=await response.json();
    if(!response.ok||!result.ok||!result.lead?.id) throw new Error("capture_failed");
    return NextResponse.json({ok:true});
  }catch{return NextResponse.json({error:"contact_unavailable"},{status:502});}
}
