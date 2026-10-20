'use client';
import {useEffect,useState,type FormEvent} from 'react';
import Link from 'next/link';
type Role='owner'|'editor'|'viewer';
type Doc={id:string;title:string;createdAt:string;characters:number;indexed:boolean};
type Evidence={ref:string;documentId:string;title:string;excerpt:string;offset:number};
type Member={id:string;name:string;role:Role;revoked:boolean};
type Audit={id:string;at:string;actor:string;event:string;target:string;status:string};
const field='mt-2 w-full border border-white/25 bg-white/5 p-3 outline-none focus:border-[#c8ff55] disabled:opacity-40';
const button='border border-white/30 px-4 py-2 text-sm disabled:opacity-40';
export default function WorkspacePage(){
 const [workspace,setWorkspace]=useState<{id:string;name:string;role:Role;memberId:string}|null>(null);
 const [docs,setDocs]=useState<Doc[]>([]),[key,setKey]=useState(''),[title,setTitle]=useState(''),[text,setText]=useState(''),[pdf,setPdf]=useState('');
 const [question,setQuestion]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[answer,setAnswer]=useState('');
 const [sources,setSources]=useState<Evidence[]>([]),[ready,setReady]=useState(false),[ai,setAI]=useState(false),[available,setAvailable]=useState(false),[mode,setMode]=useState('');
 const [view,setView]=useState<'knowledge'|'members'|'audit'>('knowledge'),[members,setMembers]=useState<Member[]>([]),[history,setHistory]=useState<Audit[]>([]);
 const [memberName,setMemberName]=useState(''),[role,setRole]=useState<Role>('viewer'),[invitation,setInvitation]=useState('');
 async function refresh(){
  const r=await fetch('/api/knowledgeos/workspace',{cache:'no-store'}),j=await r.json();
  if(r.status===401){setWorkspace(null);setDocs([]);return;}if(!r.ok)throw Error(j.error);
  setWorkspace(j.workspace);setDocs(j.documents);setAvailable(j.aiAvailable);
 }
 useEffect(()=>{void refresh().catch(e=>setError(e.message)).finally(()=>setReady(true));},[]);
 async function action(data:Record<string,unknown>){
  const r=await fetch('/api/knowledgeos/workspace',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}),j=await r.json();
  if(r.status===401){setWorkspace(null);setDocs([]);setAnswer('');setSources([]);setInvitation('');}
  if(!r.ok)throw Error(j.error||'Request failed.');return j;
 }
 async function run(task:()=>Promise<void>){if(busy)return;setBusy(true);setError('');try{await task();}catch(e){setError(e instanceof Error?e.message:'Request failed.');}finally{setBusy(false);}}
 async function loadView(next:'knowledge'|'members'|'audit'){
  setView(next);if(next==='knowledge')return;
  const r=await fetch(`/api/knowledgeos/workspace?view=${next}`,{cache:'no-store'}),j=await r.json();if(!r.ok)throw Error(j.error);
  if(next==='members')setMembers(j.members);else setHistory(j.audit);
 }
 function signin(e:FormEvent){e.preventDefault();void run(async()=>{await action({action:'signin',key});setKey('');await refresh();});}
 const writable=workspace?.role!=='viewer';
 return <main className="min-h-screen bg-[#101418] text-[#f3f0e8]">
  <header className="border-b border-white/15 px-6 py-6"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
   <Link href="/knowledgeos" className="text-xl font-bold tracking-tight">KnowledgeOS</Link>
   <span className="text-sm text-white/60">Private knowledge workspace {workspace&&`/ ${workspace.role}`}</span>
   {workspace&&<button disabled={busy} className="underline disabled:opacity-40" onClick={()=>void run(async()=>{await action({action:'signout'});setWorkspace(null);setDocs([]);setAnswer('');setSources([]);setText('');setPdf('');setInvitation('');setMembers([]);setHistory([]);setView('knowledge');})}>Sign out</button>}
  </div></header>
  <div className="mx-auto max-w-6xl px-6 py-12">
   <p className="text-xs uppercase tracking-[.2em] text-[#c8ff55]">Evidence before answers</p>
   <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">{workspace?workspace.name:'Your knowledge. In one place.'}</h1>
   <p className="mt-5 max-w-2xl leading-7 text-white/65">Bring your approved documents together. Find original evidence, or use Gemini to draft an answer with source citations.</p>
   {error&&<p role="alert" className="mt-6 border border-red-300/40 p-4 text-red-200">{error}</p>}
   {!ready?<p role="status" className="mt-10">Loading workspace…</p>:!workspace?<form onSubmit={signin} className="mt-10 max-w-xl border-t border-white/20 pt-8">
    <label htmlFor="key" className="block font-bold">Workspace access key</label><input id="key" type="password" autoComplete="off" required value={key} onChange={e=>setKey(e.target.value)} className={field}/>
    <p className="mt-3 text-sm leading-6 text-white/55">Use your private invitation key. Sessions expire after eight hours. Contact the workspace owner if your access was revoked.</p>
    <button disabled={busy} className="mt-6 bg-[#c8ff55] px-6 py-3 font-bold text-black disabled:opacity-40">{busy?'Opening…':'Open workspace'}</button>
   </form>:<>
    <nav aria-label="Workspace sections" className="mt-10 flex gap-7 border-b border-white/20 pb-4">
     {(['knowledge',...(workspace.role==='owner'?['members','audit']:[])] as const).map(v=><button key={v} disabled={busy} aria-current={view===v?'page':undefined} className={view===v?'font-bold text-[#c8ff55]':'text-white/60'} onClick={()=>void run(()=>loadView(v as typeof view))}>{v==='knowledge'?'Knowledge':v==='members'?'Team access':'Activity'}</button>)}
    </nav>
    {view==='knowledge'?<div className="mt-8 grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
     <section><h2 className="text-2xl font-bold">Sources</h2><p className="mt-2 text-sm text-white/60">{docs.length} of 50 documents</p>
      <ul className="mt-5">{docs.map(d=><li key={d.id} className="border-t border-white/15 py-4">
       <b className="break-words">{d.title}</b><p className="mt-1 text-xs text-white/50">{new Date(d.createdAt).toLocaleDateString()} · {d.characters.toLocaleString()} characters · {d.indexed?'Semantic index ready':'Source search ready'}</p>
       {writable&&<div className="mt-3 flex flex-wrap gap-3">
        {available&&<button disabled={busy} className={button} onClick={()=>{if(window.confirm('Send this document to Gemini to create a semantic search index?'))void run(async()=>{await action({action:'index',id:d.id,aiConsent:true});await refresh();});}}>{d.indexed?'Reindex':'Enable semantic search'}</button>}
        <button disabled={busy} className={button} onClick={()=>{if(window.confirm(`Permanently delete “${d.title}” and its index?`))void run(async()=>{await action({action:'delete',id:d.id});setSources([]);setAnswer('');await refresh();});}}>Delete</button>
       </div>}
      </li>)}</ul>
      {writable&&<form className="mt-8 border-t border-white/20 pt-6" onSubmit={e=>{e.preventDefault();void run(async()=>{await action({action:'upload',title,...(pdf?{pdf}:{text})});setTitle('');setText('');setPdf('');setSources([]);setAnswer('');await refresh();});}}>
       <h3 className="text-lg font-bold">Add an approved source</h3>
       <label htmlFor="file" className="mt-5 block text-sm">PDF (2 MB / 50 pages), text or Markdown (100 KB)</label>
       <input id="file" type="file" accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown" disabled={busy} className="mt-2 w-full text-sm" onChange={e=>{const f=e.target.files?.[0];if(!f)return;void run(async()=>{const isPDF=f.name.toLowerCase().endsWith('.pdf');if(f.size>(isPDF?2000000:100000))throw Error('File exceeds the upload limit.');setTitle(f.name.slice(0,160));setPdf('');setText('');if(isPDF){const bytes=new Uint8Array(await f.arrayBuffer());let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);setPdf(btoa(binary));}else setText(await f.text());});}}/>
       <label htmlFor="title" className="mt-5 block text-sm">Source title</label><input id="title" disabled={busy} required maxLength={160} value={title} onChange={e=>setTitle(e.target.value)} className={field}/>
       {pdf?<p className="mt-4 text-sm text-white/60">PDF selected. Readable text is extracted on upload. Scanned and password-protected PDFs require conversion first.</p>:<><label htmlFor="text" className="mt-5 block text-sm">Document text</label><textarea id="text" disabled={busy} required rows={7} value={text} onChange={e=>setText(e.target.value)} className={field}/></>}
       <p className="mt-3 text-xs leading-5 text-white/50">Uploading stores your source privately. Semantic indexing and AI answers send document text to Gemini only when you choose those features.</p>
       <button disabled={busy} className={'mt-4 '+button}>{busy?'Working…':'Save source'}</button>
      </form>}
     </section>
     <section className="border-t border-white/20 pt-6"><h2 className="text-2xl font-bold">Ask your knowledge</h2>
      <form onSubmit={e=>{e.preventDefault();void run(async()=>{setAnswer('');setSources([]);const j=await action({action:'ask',question,aiConsent:ai});setAnswer(j.answer+(j.notice?'\n\n'+j.notice:''));setSources(j.sources);setMode(`${j.mode} · ${j.retrieval}`);});}}>
       <label htmlFor="question" className="mt-5 block text-sm">Question</label><textarea id="question" disabled={busy} required maxLength={600} rows={3} value={question} onChange={e=>setQuestion(e.target.value)} className={field}/>
       <label className="mt-4 flex items-start gap-3 text-sm leading-6"><input type="checkbox" disabled={!available||busy} checked={ai} onChange={e=>setAI(e.target.checked)} className="mt-1"/><span>Use Gemini for a cited AI draft. This sends your question and matching source excerpts to Gemini. Verify the evidence before acting.</span></label>
       {!available&&<p className="mt-2 text-sm text-white/50">AI is not configured. Original source search is available.</p>}
       <button disabled={busy||!docs.length} className="mt-4 bg-[#c8ff55] px-6 py-3 font-bold text-black disabled:opacity-40">{busy?'Working…':ai?'Ask with AI':'Search sources'}</button>
       {!docs.length&&<p className="mt-3 text-sm text-white/50">Add your first source to begin.</p>}
      </form>
      <div aria-live="polite" className="mt-8"><p className="text-xs uppercase tracking-wider text-[#c8ff55]">{mode}</p><p className="mt-3 whitespace-pre-wrap leading-7 text-white/80">{answer}</p>
       {sources.map(s=><article key={s.ref} className="mt-6 border-l-2 border-[#c8ff55] pl-5"><h3 className="font-bold">[{s.ref}] {s.title}</h3><p className="mt-1 text-xs text-white/45">Original text · character {s.offset+1}</p><blockquote className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-white/70">{s.excerpt}</blockquote></article>)}
      </div>
     </section>
    </div>:view==='members'?<section className="mt-8 max-w-3xl"><h2 className="text-2xl font-bold">Team access</h2>
     <p className="mt-3 text-sm leading-6 text-white/60">Viewers search and ask. Editors also upload, index and delete. Owners manage invitations and view activity. Revoking an invitation also invalidates its existing sessions.</p>
     <ul className="mt-6">{members.map(m=><li key={m.id} className="flex items-center justify-between gap-5 border-t border-white/15 py-4"><div><b>{m.name}</b><p className="text-sm text-white/55">{m.role} · {m.revoked?'Revoked':'Active'}</p></div>{!m.revoked&&m.id!==workspace.memberId&&<button disabled={busy} className={button} onClick={()=>{if(window.confirm(`Revoke access for ${m.name}?`))void run(async()=>{await action({action:'revoke',id:m.id});await loadView('members');});}}>Revoke</button>}</li>)}</ul>
     <form className="mt-6 border-t border-white/20 pt-6" onSubmit={e=>{e.preventDefault();void run(async()=>{const j=await action({action:'invite',name:memberName,role});setInvitation(j.key);setMemberName('');await loadView('members');});}}>
      <label htmlFor="member" className="text-sm">Member name</label><input id="member" required maxLength={100} disabled={busy} value={memberName} onChange={e=>setMemberName(e.target.value)} className={field}/>
      <label htmlFor="role" className="mt-4 block text-sm">Role</label><select id="role" disabled={busy} value={role} onChange={e=>setRole(e.target.value as Role)} className={field+' bg-[#101418]'}><option value="viewer">Viewer</option><option value="editor">Editor</option><option value="owner">Owner</option></select>
      <button disabled={busy} className={'mt-4 '+button}>Create invitation</button>
     </form>
     {invitation&&<div className="mt-6 border border-[#c8ff55]/40 p-5"><b>Copy this key now</b><p className="mt-2 text-sm text-white/60">This is shown once. Share it privately with the intended member.</p><code className="mt-4 block break-all text-sm">{invitation}</code><button className={'mt-4 '+button} onClick={()=>void run(async()=>{await navigator.clipboard.writeText(invitation);})}>Copy key</button><button className="ml-5 text-sm underline" onClick={()=>setInvitation('')}>Hide key</button></div>}
    </section>:<section className="mt-8"><h2 className="text-2xl font-bold">Activity</h2><p className="mt-3 text-sm text-white/60">Latest 50 events. Source text, questions and access keys are excluded.</p><div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-white/50"><tr><th className="py-3">Time</th><th>Event</th><th>Actor</th><th>Status</th></tr></thead><tbody>{history.map(h=><tr key={h.id} className="border-t border-white/15"><td className="py-4 pr-4">{new Date(h.at).toLocaleString()}</td><td className="pr-4">{h.event}</td><td className="pr-4 font-mono text-xs">{h.actor==='root'?'Workspace owner':h.actor.slice(0,8)}</td><td>{h.status}</td></tr>)}</tbody></table></div></section>}
   </>}
  </div>
 </main>;
}
