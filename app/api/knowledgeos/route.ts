import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Chunk = { id: string; source: string; section: string; text: string };

const KB: Chunk[] = [
  { id:"hb-pto", source:"Employee Handbook", section:"Paid Time Off", text:"Full-time employees receive 15 days of paid vacation during their first year. Vacation requests should be submitted at least two weeks in advance when possible." },
  { id:"hb-remote", source:"Employee Handbook", section:"Remote Work", text:"Eligible employees may work remotely up to three days per week with manager approval. Teams may designate collaboration days that require in-office attendance." },
  { id:"sec-access", source:"Security Policy", section:"Access Control", text:"Multi-factor authentication is required for company email, source control, CRM, cloud infrastructure, and administrative systems. Shared user accounts are prohibited." },
  { id:"sec-incident", source:"Security Policy", section:"Incident Reporting", text:"Suspected phishing, credential exposure, lost devices, or unauthorized access must be reported to the security contact immediately. Employees should not investigate suspicious activity on their own." },
  { id:"sales-qual", source:"Sales Playbook", section:"Lead Qualification", text:"A qualified opportunity has a defined business problem, an identified stakeholder, a plausible implementation window, and agreement on a next step. Budget should be discussed when appropriate but is not required for initial qualification." },
  { id:"sales-handoff", source:"Sales Playbook", section:"Implementation Handoff", text:"Before implementation handoff, sales records the customer's desired outcome, current workflow, stakeholders, integrations, constraints, success criteria, and open risks. The implementation owner confirms scope before kickoff." },
  { id:"impl-uat", source:"Implementation Guide", section:"UAT", text:"User acceptance testing validates agreed workflows with representative scenarios before production launch. Critical failures block launch; minor issues are documented with an owner and target resolution date." },
  { id:"impl-launch", source:"Implementation Guide", section:"Launch", text:"Production launch requires configuration review, integration checks, UAT sign-off, rollback planning, owner assignment, user enablement, and a post-launch monitoring window." },
];

const cleanTokens = (s:string) => s.toLowerCase().replace(/[^a-z0-9\s]/g," ").split(/\s+/).filter(x=>x.length>2);
const lexical = (q:string,c:Chunk) => {
  const qs=new Set(cleanTokens(q)); const ts=cleanTokens(c.text+" "+c.section+" "+c.source);
  return ts.reduce((n,t)=>n+(qs.has(t)?1:0),0) / Math.max(1, Math.sqrt(ts.length));
};
const dot=(a:number[],b:number[])=>a.reduce((s,x,i)=>s+x*(b[i]||0),0);
const norm=(a:number[])=>Math.sqrt(dot(a,a))||1;
const cosine=(a:number[],b:number[])=>dot(a,b)/(norm(a)*norm(b));

async function embed(key:string,text:string) {
  const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent",{
    method:"POST", headers:{"content-type":"application/json","x-goog-api-key":key},
    body:JSON.stringify({content:{parts:[{text}]}})
  });
  if(!r.ok) throw new Error("embedding unavailable");
  const j=await r.json();
  return j?.embedding?.values as number[];
}

async function generate(key:string,question:string,chunks:Chunk[]) {
  const context=chunks.map((c,i)=>`[S${i+1}] ${c.source} — ${c.section}\n${c.text}`).join("\n\n");
  const prompt=`You are KnowledgeOS, an enterprise knowledge assistant. Answer ONLY from the supplied sources. If the answer is not supported, say exactly: "I can't verify that from the current knowledge base." Keep the answer concise. Cite supporting sources inline as [S1], [S2], etc.\n\nSOURCES:\n${context}\n\nQUESTION: ${question}`;
  for(const model of [process.env.GEMINI_MODEL,"gemini-flash-latest","gemini-flash-lite-latest"].filter(Boolean)){
    const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{
      method:"POST",headers:{"content-type":"application/json","x-goog-api-key":key},
      body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{temperature:0.1,maxOutputTokens:500}})
    }).catch(()=>null);
    if(r?.ok){
      const j=await r.json();
      return j?.candidates?.[0]?.content?.parts?.map((p:any)=>p.text||"").join(" ").trim();
    }
  }
  throw new Error("generation unavailable");
}

export async function POST(req:Request){
  let body:{question?:string};
  try{ body=await req.json(); }catch{ return NextResponse.json({error:"bad_request"},{status:400}); }
  const question=(body.question||"").trim().slice(0,600);
  if(!question) return NextResponse.json({error:"question_required"},{status:400});
  const key=process.env.GEMINI_API_KEY;

  let ranked=KB.map(c=>({c,score:lexical(question,c)})).sort((a,b)=>b.score-a.score);
  let retrieval:"vector"|"lexical"="lexical";
  if(key){
    try{
      const qv=await embed(key,question);
      const docs=await Promise.all(KB.map(async c=>({c,v:await embed(key,c.text)})));
      ranked=docs.map(x=>({c:x.c,score:cosine(qv,x.v)})).sort((a,b)=>b.score-a.score);
      retrieval="vector";
    }catch{}
  }
  const top=ranked.slice(0,3);
  const supported = retrieval==="vector" ? top[0].score >= 0.42 : top[0].score > 0;
  if(!supported){
    return NextResponse.json({answer:"I can't verify that from the current knowledge base.",retrieval,sources:[]});
  }
  const chunks=top.map(x=>x.c);
  let answer="";
  if(key){
    try{ answer=await generate(key,question,chunks); }catch{}
  }
  if(!answer) answer=`The most relevant policy says: ${chunks[0].text} [S1]`;
  return NextResponse.json({
    answer,retrieval,
    sources:chunks.map((c,i)=>({ref:`S${i+1}`,source:c.source,section:c.section,excerpt:c.text}))
  });
}