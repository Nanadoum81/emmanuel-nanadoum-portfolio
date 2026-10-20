import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
export async function extractPDF(base64:string):Promise<string>{
 if(!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)||base64.length>2800000)throw Error('invalid_pdf');
 const bytes=Buffer.from(base64,'base64');
 if(bytes.length>2000000||bytes.subarray(0,5).toString()!=='%PDF-')throw Error('invalid_pdf');
 const {getDocument}=await import('pdfjs-dist/legacy/build/pdf.mjs');
 const packageRoot=dirname(createRequire(process.cwd()+'/package.json').resolve('pdfjs-dist/package.json'));
 const task=getDocument({standardFontDataUrl:join(packageRoot,'standard_fonts/'),cMapUrl:join(packageRoot,'cmaps/'),cMapPacked:true,data:new Uint8Array(bytes),useWorkerFetch:false,disableFontFace:true,useSystemFonts:false,isOffscreenCanvasSupported:false,isImageDecoderSupported:false,maxImageSize:0,stopAtErrors:true});
 try{
  const pdf=await task.promise;if(pdf.numPages>50)throw Error('pdf_pages');
  let text='';
  for(let p=1;p<=pdf.numPages;p++){
   const page=await pdf.getPage(p),content=await page.getTextContent();
   text+=`\n\n[Page ${p}]\n`+content.items.map(item=>'str' in item?item.str+('hasEOL' in item&&item.hasEOL?'\n':' '):'').join('');
   if(Buffer.byteLength(text)>100000)throw Error('pdf_text_limit');page.cleanup();
  }
  if(text.replace(/\[Page \d+\]/g,'').trim().length<10)throw Error('pdf_no_text');
  return text.trim();
 }catch(e){if(e instanceof Error&&['pdf_pages','pdf_text_limit','pdf_no_text'].includes(e.message))throw e;throw Error('invalid_pdf');}
 finally{await task.destroy();}
}
