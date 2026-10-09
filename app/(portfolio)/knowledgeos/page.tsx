"use client";
import { useState } from "react";
import Link from "next/link";

type Source={ref:string;source:string;section:string;excerpt:string};
const prompts=[
  "How many vacation days do new employees receive?",
  "What has to happen before a production launch?",
  "What information should sales capture before implementation handoff?",
  "Can employees share admin accounts?",
  "What is the company's parental leave policy?"
];

export default function KnowledgeOS(){
  const [q,setQ]=useState(prompts[0]); const [answer,setAnswer]=useState("");
  const [sources,setSources]=useState<Source[]>([]); const [mode,setMode]=useState("");
  const [loading,setLoading]=useState(false);
  async function ask(question=q){
    if(loading) return;
    setQ(question); setLoading(true); setAnswer(""); setSources([]); setMode("");
    try{
      const r=await fetch("/api/knowledgeos",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({question})});
      const j=await r.json();
      if(!r.ok) throw new Error("request_failed");
      setAnswer(j.answer||"The demo could not answer that request."); setSources(j.sources||[]); setMode(j.retrieval||"");
    }catch{setAnswer("The demo is temporarily unavailable.");} finally{setLoading(false);}
  }
  return <main className="min-h-screen bg-[#f3f0e8] text-[#151515]">
    <header className="border-b border-black/20 bg-[#101418] text-white">
      <div className="mx-auto max-w-[1320px] px-6 py-5 flex items-center justify-between gap-6">
        <div><div className="text-xs tracking-[.22em] uppercase text-white/55">Enterprise AI implementation</div><div className="text-xl font-bold">KnowledgeOS</div></div>
        <div className="flex items-center gap-5 text-sm"><Link href="/knowledgeos/enterprise" className="underline underline-offset-4">Enterprise platform</Link><Link href="/work/knowledgeos" className="underline underline-offset-4">Implementation dossier →</Link></div>
      </div>
    </header>
    <section className="mx-auto max-w-[1320px] px-6 py-12 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.16em]">Grounded answers. Visible evidence.</p>
          <h1 className="mt-4 text-[clamp(44px,6vw,82px)] font-extrabold leading-[.94] tracking-[-.05em]">Ask the company.<br/>See the source.</h1>
          <p className="mt-6 max-w-[48ch] text-lg text-black/65">A portfolio implementation of retrieval-augmented generation. Questions are retrieved against a labeled sample knowledge base, then the answer is constrained to the retrieved evidence and returned with citations.</p>
          <div className="mt-8 border-t border-black pt-4 grid grid-cols-2 gap-5 text-sm">
            <div><b>Knowledge base</b><br/><span className="text-black/55">Handbook · Security · Sales · Implementation</span></div>
            <div><b>Retrieval</b><br/><span className="text-black/55">Gemini embeddings with lexical fallback</span></div>
            <div><b>Generation</b><br/><span className="text-black/55">Grounded Gemini response</span></div>
            <div><b>Guardrail</b><br/><span className="text-black/55">Unsupported answers are refused</span></div>
          </div>
        </div>
        <div className="border border-black/25 bg-white shadow-[0_20px_60px_rgba(0,0,0,.08)]">
          <div className="border-b border-black/15 px-6 py-4 flex items-center justify-between"><b>Knowledge query</b><span className="text-xs uppercase tracking-wider text-black/45">{mode?mode+" retrieval":"ready"}</span></div>
          <div className="p-6">
            <label className="text-sm font-bold" htmlFor="q">Ask about company policy or implementation</label>
            <textarea id="q" value={q} onChange={e=>setQ(e.target.value)} maxLength={600} disabled={loading} rows={3} className="mt-2 w-full resize-none border border-black/25 bg-[#faf9f5] p-4 outline-none focus:border-black"/>
            <button onClick={()=>ask()} disabled={loading} className="mt-3 bg-black px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{loading?"Retrieving evidence…":"Ask KnowledgeOS"}</button>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">{prompts.map(p=><button key={p} disabled={loading} onClick={()=>ask(p)} className="text-left underline decoration-black/25 underline-offset-4 hover:decoration-black disabled:opacity-40">{p}</button>)}</div>
            <div className="mt-7 min-h-[120px] border-t border-black/15 pt-5">
              <div className="text-xs font-bold uppercase tracking-[.16em] text-black/45">Grounded response</div>
              <p className="mt-3 text-[17px] leading-7">{answer||"Ask a question to run retrieval, grounding and citation generation."}</p>
            </div>
            {sources.length>0&&<div className="mt-6 border-t border-black/15 pt-5">
              <div className="text-xs font-bold uppercase tracking-[.16em] text-black/45">Retrieved evidence</div>
              <div className="mt-3 grid gap-3">{sources.map(s=><article key={s.ref} className="border-l-2 border-black pl-4"><b>{s.ref} · {s.source}</b><div className="text-sm text-black/55">{s.section}</div><p className="mt-1 text-sm leading-6">{s.excerpt}</p></article>)}</div>
            </div>}
          </div>
        </div>
      </div>
      <section className="mt-16 border-t border-black pt-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {[["01","Retrieve","The question is embedded and compared with the knowledge chunks."],["02","Rank","The most relevant evidence is selected before the model sees the question."],["03","Generate","The model is instructed to answer only from retrieved evidence."],["04","Cite / refuse","Sources are shown. Unsupported questions receive an explicit refusal."]].map(([n,h,t])=><div key={n}><div className="font-mono text-sm text-black/40">{n}</div><h2 className="mt-2 text-xl font-bold">{h}</h2><p className="mt-2 text-sm leading-6 text-black/60">{t}</p></div>)}
        </div>
      </section>
    </section>
  </main>
}
