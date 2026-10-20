import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

export type Workspace = { id: string; name: string; key: string; memberId?: string; role?: Role };
export type Role = 'owner' | 'editor' | 'viewer';
export const canManage = (w: Workspace) => (w.role || 'owner') !== 'viewer';
export const isOwner = (w: Workspace) => (w.role || 'owner') === 'owner';
export type Document = { id: string; title: string; text: string; createdAt: string; index?: { model: string; chunks: { offset: number; vector: number[] }[] }; };
export const COOKIE = 'knowledgeos_session';
export const REFUSAL = "I can't verify that from the current knowledge base.";
export function workspaces(raw = process.env.KNOWLEDGEOS_WORKSPACES): Workspace[] {
  if (!raw) return [];
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows) || !rows.length) throw new Error('invalid workspace configuration');
  const ids = new Set(), keys = new Set();
  return rows.map(row => {
    if (!row || typeof row.id !== 'string' || !/^[a-z0-9-]{1,60}$/.test(row.id) || typeof row.name !== 'string' || !row.name.trim() || typeof row.key !== 'string' || row.key.length < 43 || ids.has(row.id) || keys.has(row.key)) throw new Error('invalid workspace configuration');
    ids.add(row.id); keys.add(row.key); return row as Workspace;
  });
}
function digest(value: string) { return createHash('sha256').update(value).digest(); }
export function equal(a: string, b: string) { return timingSafeEqual(digest(a), digest(b)); }
function secret() {
  const value = process.env.KNOWLEDGEOS_SESSION_SECRET;
  if (!value || value.length < 43) throw new Error('session configuration required');
  return value;
}
export function issue(workspace: Workspace, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ id: workspace.id, memberId: workspace.memberId || 'root', exp: now + 8 * 3600000, version: digest(workspace.key).toString('hex') })).toString('base64url');
  return payload + '.' + createHmac('sha256', secret()).update(payload).digest('base64url');
}
export function verify(token: string, rows: Workspace[], now = Date.now()): Workspace | null {
  try {
    if (token.length > 1024) return null;
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra || !equal(signature, createHmac('sha256', secret()).update(payload).digest('base64url'))) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (typeof data.exp !== 'number' || data.exp <= now || data.exp > now + 8 * 3600000) return null;
    return rows.find(w => w.id === data.id && (w.memberId || 'root') === (data.memberId || 'root') && data.version === digest(w.key).toString('hex')) || null;
  } catch { return null; }
}
export function validateDocument(input: unknown): { title: string; text: string } {
  const d = input as {title?: unknown; text?: unknown};
  if (!d || typeof d.title !== 'string' || !d.title.trim() || d.title.length > 160 || typeof d.text !== 'string' || !d.text.trim() || Buffer.byteLength(d.text) > 100000 || /\x00/.test(d.text)) throw new Error('Use a title and a nonempty UTF-8 text document up to 100 KB.');
  return {title: d.title.trim(), text: d.text.trim()};
}
const stop = new Set('the a an and or to of is are was were what how when where why can should do does did for in on from with this that it i my our we you your company policy please tell me about'.split(' '));
function tokens(s: string) { return [...new Set(s.toLowerCase().match(/[\p{L}\p{N}]{2,}/gu) || [])].filter(t => !stop.has(t)); }
export function retrieve(question: string, docs: Document[]) {
  const terms = tokens(question);
  if (!terms.length) return {answer: REFUSAL, sources: []};
  const passages = docs.flatMap(d => {
    // Overlapping windows retain complete original text rather than generated claims.
    const out: {documentId: string; title: string; excerpt: string; offset: number; score: number}[] = [];
    for (let start = 0; start < d.text.length; start += 650) {
      const excerpt = d.text.slice(start, start + 900);
      const words = new Set(tokens(excerpt));
      const matches = terms.filter(t => words.has(t)).length;
      const coverage = matches / terms.length;
      if (matches >= Math.min(2, terms.length) && coverage >= 0.5) out.push({documentId:d.id,title:d.title,excerpt,offset:start,score:coverage});
    }
    return out;
  }).sort((a,b) => b.score - a.score);
  const sources = passages.filter((p,i,all) => all.findIndex(q => q.documentId === p.documentId) === i).slice(0,3).map((p,i) => ({...p,ref:`S${i+1}`}));
  return {answer: sources.length ? 'Matching passages are shown below. These are verbatim document excerpts; check them before using them as an answer.' : REFUSAL, sources};
}

export function sessionIdentity(token: string): {id:string;memberId:string}|null {
 try {
  const [payload,signature,extra]=token.split('.');
  if(token.length>1024||!payload||!signature||extra||!equal(signature,createHmac('sha256',secret()).update(payload).digest('base64url')))return null;
  const d=JSON.parse(Buffer.from(payload,'base64url').toString());
  if(!/^[a-z0-9-]{1,60}$/.test(d.id)||!validId(d.memberId)||typeof d.exp!=='number'||d.exp<=Date.now())return null;
  return {id:d.id,memberId:d.memberId};
 }catch{return null;}
}
export function validId(id: unknown): id is string {return typeof id==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);}
export function keyHash(key: string) {return digest(key).toString('hex');}
