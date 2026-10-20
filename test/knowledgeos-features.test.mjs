import test from 'node:test';
import assert from 'node:assert/strict';
import {canManage,isOwner,issue,verify} from '../lib/knowledgeos/core.ts';
import {validateAnswer,splitText} from '../lib/knowledgeos/ai.ts';
import {extractPDF} from '../lib/knowledgeos/pdf.ts';
import {makePDF} from './helpers/pdf-fixture.mjs';
test('roles enforce read, document management, and owner boundaries',()=>{
 for(const role of ['owner','editor','viewer']){const w={id:'a',name:'A',key:'x'.repeat(50),role};assert.equal(canManage(w),role!=='viewer');assert.equal(isOwner(w),role==='owner');}
});
test('member sessions cannot become root or another member',()=>{
 process.env.KNOWLEDGEOS_SESSION_SECRET='s'.repeat(50);
 const root={id:'a',name:'A',key:'x'.repeat(50)},member={...root,memberId:'12345678-1234-4123-8123-123456789abc',role:'viewer'};
 const token=issue(member);assert.equal(verify(token,[root]),null);assert.equal(verify(token,[{...member,memberId:'another'}]),null);assert.equal(verify(token,[member])?.role,'viewer');
});
test('AI output rejects invented quotes, invalid citations and malformed output',()=>{
 const source={ref:'S1',documentId:'a',title:'Policy',excerpt:'The release captain approves production launches.',offset:0,score:1};
 const valid={supported:true,claims:[{text:'The release captain approves launches.',source:1,quote:source.excerpt}]};
 assert.match(validateAnswer(JSON.stringify(valid),[source]).answer,/\[S1\]/);
 for(const value of [{...valid,claims:[{...valid.claims[0],source:2}]},{...valid,claims:[{...valid.claims[0],quote:'Invented approval policy.'}]},{supported:true,claims:[]},{supported:true,claims:[{text:45,source:1,quote:source.excerpt}]}])assert.equal(validateAnswer(JSON.stringify(value),[source]),null);
 assert.equal(validateAnswer('not json',[source]),null);
 assert.equal(validateAnswer('{"supported":false}',[source]).sources.length,0);
});
test('index windows cover the entire source without modifying evidence',()=>{
 const text='abcdefghij'.repeat(1000),chunks=splitText(text);assert.equal(chunks[0].offset,0);assert.ok(chunks.at(-1).offset+chunks.at(-1).text.length>=text.length);for(const c of chunks)assert.equal(c.text,text.slice(c.offset,c.offset+1500));
});
test('real PDF parser extracts page-numbered text and rejects invalid/scanned documents',async()=>{
 const text=await extractPDF(makePDF());assert.match(text,/\[Page 1\]/);assert.match(text,/release captain approves production launches/);
 await assert.rejects(extractPDF('not-a-pdf'),/invalid_pdf/);
 await assert.rejects(extractPDF(makePDF('')),/pdf_no_text/);
});
