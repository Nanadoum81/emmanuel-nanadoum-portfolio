import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
import fs from 'fs';
const axe = fs.readFileSync(decodeURIComponent(new URL('../node_modules/axe-core/axe.min.js', import.meta.url).pathname), 'utf8');
const BASE = process.argv[2] || 'http://localhost:3200';
const pages = ['/', '/work', '/work/vybe', '/work/palmer-herman', '/about', '/contact', '/resume', '/solutions', '/solutions/cactus', '/solutions/palmer-herman'];
const b = await chromium.launch({ channel: 'chrome' });
for (const [w,h] of [[1440,900],[390,844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  for (const path of pages) {
    await p.goto(BASE + path, { waitUntil: 'networkidle' });
    await p.addScriptTag({ content: axe });
    const r = await p.evaluate(async () => { const res = await window.axe.run(document, { runOnly: ['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice'] }); return res.violations.map(v => `${v.impact} ${v.id} (${v.nodes.length}): ${v.nodes.slice(0,2).map(n=>n.target.join(' ')+ ' :: ' + (n.failureSummary||'').split('\n')[1]?.slice(0,120)).join(' | ')}`); });
    if (r.length) console.log(`[${w}] ${path}\n  ` + r.join('\n  '));
  }
  await p.close();
}
await b.close(); console.log('done');
