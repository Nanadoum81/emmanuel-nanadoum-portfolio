// Builds the résumé as PDF (Chrome print) and DOCX from resume/content.mjs.
// Usage: node resume/build.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs";
import * as docx from "/Users/emmanuel_nanadoum/Desktop/resumes2026/node_modules/docx/dist/index.mjs";
import { resume as r } from "./content.mjs";

const here = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname));
const root = path.resolve(here, "..");
const BASE = "Emmanuel_Nanadoum_Solutions_Engineer_Resume";
const outPdf = path.join(root, "public", `${BASE}.pdf`);
const outDocx = path.join(root, "public", `${BASE}.docx`);
const outHtml = path.join(here, `${BASE}.html`);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const href = (c) =>
  c.includes("@") ? `mailto:${c}` : c.startsWith("linkedin") ? `https://www.${c}` : c.includes(".vercel.app") ? `https://${c}` : /^\d{3}-/.test(c) ? `tel:+1${c.replace(/-/g, "")}` : null;
const link = (c) => (href(c) ? `<a href="${href(c)}">${esc(c)}</a>` : esc(c));

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${r.name} — Résumé</title>
<style>
  @page { size: Letter; margin: 0.4in 0.5in 0.32in; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; color: #16181c; font-size: 9.3pt; line-height: 1.24; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  a { color: inherit; text-decoration: none; }
  h1 { font-size: 21pt; letter-spacing: -0.2pt; margin: 0; line-height: 1.05; }
  .headline { color: #1d3fcf; font-weight: 700; font-size: 10.6pt; margin-top: 3pt; }
  .contact { margin-top: 4pt; color: #3d4047; font-size: 9pt; }
  .contact span + span::before { content: " | "; color: #9a9ca3; }
  .portfolio { margin-top: 2.5pt; font-size: 9.6pt; }
  .portfolio b { color: #16181c; }
  .portfolio a { color: #1d3fcf; font-weight: 700; }
  .contact a[href^="mailto:"], .contact a[href*="linkedin.com"] { color: #1d3fcf; text-decoration: underline; text-underline-offset: 1.5pt; }
  h2 { font-size: 9.2pt; letter-spacing: 1pt; text-transform: uppercase; color: #1d3fcf; margin: 7pt 0 3pt; padding-bottom: 2pt; border-bottom: 0.75pt solid #c9c8c2; }
  header { border-bottom: 1.4pt solid #16181c; padding-bottom: 6pt; }
  p { margin: 0; }
  .skills div { margin: 1.6pt 0; }
  .skills b { font-weight: 700; }
  .job { margin-top: 5.5pt; }
  .job:first-of-type { margin-top: 0; }
  .row { display: flex; justify-content: space-between; gap: 12pt; align-items: baseline; }
  .role { font-weight: 700; font-size: 10pt; }
  .when { font-weight: 700; white-space: nowrap; font-size: 9.2pt; }
  .org { color: #3d4047; }
  ul { margin: 2pt 0 0; padding-left: 12pt; }
  li { margin: 0.9pt 0; padding-left: 1pt; }
  li::marker { color: #1d3fcf; }
  .edu div { margin: 1.4pt 0; }
</style></head><body>
<header>
  <h1>${esc(r.name.toUpperCase())}</h1>
  <div class="headline">${esc(r.headline)}</div>
  <div class="contact">${r.contact.map((c) => `<span>${link(c)}</span>`).join("")}</div>
  <div class="portfolio"><b>${esc(r.portfolio.label)}:</b> <a href="${r.portfolio.url}">${esc(r.portfolio.url)}</a></div>
</header>
<h2>Summary</h2>
<p>${esc(r.summary)}</p>
<h2>Skills</h2>
<div class="skills">${r.skills.map(([k, v]) => `<div><b>${esc(k)}:</b> ${esc(v)}</div>`).join("")}</div>
<h2>Experience</h2>
${r.experience
  .map(
    (e) => `<div class="job"><div class="row"><span class="role">${esc(e.role)}</span><span class="when">${esc(e.when)}</span></div>
<div class="org">${esc(e.org)} | ${esc(e.where)}</div>
<ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>`
  )
  .join("")}
<h2>Projects</h2>
${r.projects
  .map(
    (p) => `<div class="job"><div class="row"><span class="role">${esc(p.name)}</span><span class="when"><a href="https://${p.link}">${esc(p.link)}</a></span></div>
<ul>${p.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>`
  )
  .join("")}
<h2>Education &amp; Development</h2>
<div class="edu">${r.education.map((e) => `<div>${esc(e)}</div>`).join("")}</div>
</body></html>`;

fs.writeFileSync(outHtml, html);

// ---------- PDF ----------
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.emulateMedia({ media: "print" });
await page.pdf({ path: outPdf, format: "Letter", printBackground: true, preferCSSPageSize: true, tagged: true, outline: false });
const pages = await page.evaluate(() => {
  const h = document.documentElement.scrollHeight;
  return h;
});
await browser.close();

// ---------- DOCX ----------
const { Document, Packer, Paragraph, TextRun, ExternalHyperlink, TabStopType, BorderStyle, AlignmentType, LevelFormat } = docx;
const BLUE = "1D3FCF";
const INK = "16181C";
const FONT = "Arial";
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size ?? 18, bold: o.bold, color: o.color ?? INK, underline: o.underline ? {} : undefined });
const hyper = (text, url, o = {}) => new ExternalHyperlink({ link: url, children: [run(text, o)] });
const heading = (text) =>
  new Paragraph({
    spacing: { before: 170, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "C9C8C2", space: 2 } },
    children: [run(text.toUpperCase(), { bold: true, color: BLUE, size: 19 })],
  });
const RIGHT = 10800 - 1 - 1500; // right tab for dates (twips), page 8.5in minus margins
const roleLine = (left, right, rightUrl) =>
  new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: 10800 }],
    spacing: { before: 90 },
    children: [run(left, { bold: true, size: 20 }), run("\t"), rightUrl ? hyper(right, rightUrl, { bold: true, size: 18 }) : run(right, { bold: true, size: 18 })],
  });
const bullet = (text) => new Paragraph({ numbering: { reference: "dots", level: 0 }, spacing: { after: 20 }, children: [run(text)] });

const contactRuns = [];
r.contact.forEach((c, i) => {
  if (i) contactRuns.push(run(" | ", { color: "9A9CA3", size: 18 }));
  const u = href(c);
  const web = u && !u.startsWith("tel:");
  contactRuns.push(u ? hyper(c, u, { size: 18, color: web ? BLUE : "3D4047", underline: web }) : run(c, { size: 18, color: "3D4047" }));
});

const doc = new Document({
  creator: r.name,
  title: `${r.name} — Résumé`,
  description: r.headline,
  numbering: {
    config: [{ reference: "dots", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 260, hanging: 200 } }, run: { color: BLUE } } }] }],
  },
  sections: [
    {
      properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 600, bottom: 520, left: 720, right: 720 } } },
      children: [
        new Paragraph({ children: [run(r.name.toUpperCase(), { bold: true, size: 42 })] }),
        new Paragraph({ spacing: { before: 40 }, children: [run(r.headline, { bold: true, color: BLUE, size: 21 })] }),
        new Paragraph({ spacing: { before: 60 }, children: contactRuns }),
        new Paragraph({
          spacing: { before: 20, after: 60 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: INK, space: 6 } },
          children: [run(`${r.portfolio.label}: `, { bold: true, size: 18 }), hyper(r.portfolio.url, r.portfolio.url, { bold: true, size: 18, color: BLUE })],
        }),
        heading("Summary"),
        new Paragraph({ children: [run(r.summary)] }),
        heading("Skills"),
        ...r.skills.map(([k, v]) => new Paragraph({ spacing: { after: 30 }, children: [run(`${k}: `, { bold: true }), run(v)] })),
        heading("Experience"),
        ...r.experience.flatMap((e) => [
          roleLine(e.role, e.when),
          new Paragraph({ children: [run(`${e.org} | ${e.where}`, { color: "3D4047" })] }),
          ...e.bullets.map(bullet),
        ]),
        heading("Projects"),
        ...r.projects.flatMap((p) => [roleLine(p.name, p.link, `https://${p.link}`), ...p.bullets.map(bullet)]),
        heading("Education & Development"),
        ...r.education.map((e) => new Paragraph({ spacing: { after: 20 }, children: [run(e)] })),
      ],
    },
  ],
});
fs.writeFileSync(outDocx, await Packer.toBuffer(doc));
console.log("wrote", path.relative(root, outPdf), path.relative(root, outDocx), "html height px", pages);
