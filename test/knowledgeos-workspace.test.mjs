import test from 'node:test';
import assert from 'node:assert/strict';
import {workspaces,issue,verify,validateDocument,retrieve} from '../lib/knowledgeos/core.ts';
process.env.KNOWLEDGEOS_SESSION_SECRET='s'.repeat(50);
const a={id:'alpha',name:'Alpha',key:'a'.repeat(50)},b={id:'beta',name:'Beta',key:'b'.repeat(50)};
test('workspace configuration rejects path traversal, weak keys, and duplicate identities',()=>{
 for(const rows of [[{...a,id:'../beta'}],[{...a,key:'weak'}],[a,a],[a,{...b,key:a.key}]]) assert.throws(()=>workspaces(JSON.stringify(rows)));
 assert.deepEqual(workspaces(JSON.stringify([a,b])),[a,b]);
});
test('sessions are signed, expire, and are revoked on key rotation',()=>{
 const token=issue(a,1000);assert.equal(verify(token,[a,b],1001)?.id,'alpha');
 assert.equal(verify(token+'x',[a,b],1001),null);
 assert.equal(verify(token,[a,b],1000+8*3600000),null);
 assert.equal(verify(token,[{...a,key:'new'.repeat(20)},b],1001),null);
 assert.equal(verify(token,[b],1001),null);
});
test('invalid document bodies are rejected',()=>{
 for(const d of [null,{}, {title:'x',text:''},{title:'x',text:'x'.repeat(100001)},{title:'x',text:'a\x00b'}])assert.throws(()=>validateDocument(d));
 assert.deepEqual(validateDocument({title:' Policy ',text:' Hello '}),{title:'Policy',text:'Hello'});
});
test('retrieval returns original passages, deduplicates sources, and refuses no evidence',()=>{
 const doc={id:'a',title:'Handbook',text:'Vacation requests require manager approval. '.repeat(40),createdAt:'2026-01-01'};
 const r=retrieve('vacation requests',[doc]);assert.equal(r.sources.length,1);assert.ok(doc.text.includes(r.sources[0].excerpt));
 assert.equal(retrieve('salary compensation',[doc]).sources.length,0);
 assert.equal(retrieve('what is company policy',[doc]).sources.length,0);
 assert.equal(retrieve('vacation requests',[]).sources.length,0);
});
