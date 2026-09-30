import { chromium } from '/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs';
const out = decodeURIComponent(new URL('./raw/', import.meta.url).pathname);
const targets = [
  ['vybe', 'https://vybe-app-blue.vercel.app/variation5/'],
  ['vybe-voice', 'https://vybe-app-blue.vercel.app/variation5/experience/'],
  ['cactus', 'https://cactus-chiro.vibepreview.app'],
  ['cactus-rs', 'https://cactus-chiro.vibepreview.app/revenue-system'],
  ['nelson', 'https://nelson-chiro.vibepreview.app'],
  ['palmer', 'https://palmer-chiropractic.vibepreview.app'],
  ['palmer-rs', 'https://palmer-chiropractic.vibepreview.app/revenue-system'],
  ['coyote', 'https://coyote-wellness.vibepreview.app'],
  ['canham', 'https://canham-compass.vibepreview.app'],
  ['canham-rs', 'https://canham-compass.vibepreview.app/revenue-system'],
  ['medspa', 'https://blair-medspa.vibepreview.com'],
];
const only = process.argv[2];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
for (const [name, url] of targets) {
  if (only && !only.split(',').includes(name)) continue;
  for (const [tag, vp, mobile] of [['d', { width: 1440, height: 900 }, false], ['m', { width: 390, height: 844 }, true]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile,
      userAgent: mobile ? undefined : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(3500);
      await page.screenshot({ path: `${out}${name}-${tag}.png` });
      // tall capture: scroll through to trigger lazy content, then fullpage
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < Math.min(h, 12000); y += 700) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(250); }
      await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
      await page.screenshot({ path: `${out}${name}-${tag}-full.png`, fullPage: true });
      console.log('ok', name, tag, h, await page.title());
    } catch (e) { console.log('FAIL', name, tag, e.message.split('\n')[0]); }
    await ctx.close();
  }
}
await browser.close();
