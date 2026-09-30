// Mirrors a GHL AI Studio (TanStack Start) site into a static folder that runs without GHL.
// Usage: node demos/mirror.mjs <slug> <origin>
//   e.g. node demos/mirror.mjs cactus https://cactus-chiro.vibepreview.app
import fs from "node:fs";
import path from "node:path";
import { chromium } from "/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs";

const [slug, origin] = process.argv.slice(2);
if (!slug || !origin) throw new Error("usage: node demos/mirror.mjs <slug> <origin>");
const here = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname));
const out = path.join(here, slug, "site");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const FS_HOST = "https://vibe.filesafe.space/";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
const files = new Map(); // local path -> Buffer
const external = new Set(); // non-asset calls we can't mirror (server functions etc.)
const pagesSeen = new Set();

const localFor = (url) => {
  const u = new URL(url);
  if (url.startsWith(FS_HOST)) return "/_fs/" + u.pathname.replace(/^\//, "");
  if (u.origin === origin) return u.pathname;
  return null;
};

const b = await chromium.launch({ channel: "chrome" });
const ctx = await b.newContext({ userAgent: UA, viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on("response", async (r) => {
  const url = r.url();
  const req = r.request();
  const type = req.resourceType();
  if (type === "document") return;
  const lp = localFor(url);
  if (!lp) return;
  if (req.method() !== "GET" || /_serverFn|\/api\//.test(url)) { external.add(`${req.method()} ${url}`); return; }
  if (r.status() !== 200) return;
  try { files.set(lp, await r.body()); } catch {}
});

const queue = ["/"];
while (queue.length && pagesSeen.size < 40) {
  const p = queue.shift();
  if (pagesSeen.has(p)) continue;
  pagesSeen.add(p);
  const resp = await page.goto(origin + p, { waitUntil: "networkidle", timeout: 60000 }).catch(() => null);
  if (!resp || resp.status() !== 200) { console.log("skip", p, resp?.status()); continue; }
  const html = await resp.text();
  if (!html.includes("<html")) { console.log("non-html", p); continue; }
  const file = p === "/" ? "/index.html" : `${p.replace(/\/$/, "")}/index.html`;
  files.set(file, Buffer.from(html));
  // scroll to trigger lazy images / sections
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(600);
  const links = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")));
  for (const l of links) {
    if (!l || !l.startsWith("/") || l.startsWith("//")) continue;
    const clean = l.split("#")[0].split("?")[0] || "/";
    if (!pagesSeen.has(clean) && !/\.(pdf|png|jpg|svg|ico|xml|txt)$/.test(clean)) queue.push(clean);
  }
  console.log("page", p, html.length);
}

// Pull every asset referenced from HTML/JS/CSS (lazy chunks, images, fonts) until closed.
const refRe = /(?:https:\/\/vibe\.filesafe\.space\/[^"'()\s\\`]+|\/assets\/[A-Za-z0-9._-]+\.(?:js|css|png|jpe?g|webp|svg|gif|avif|woff2?|ttf|mp4|webm|ico))/g;
const fetchAsset = async (lp, url) => {
  const r = await ctx.request.get(url, { headers: { "user-agent": UA } }).catch(() => null);
  if (r && r.ok()) { files.set(lp, await r.body()); return true; }
  return false;
};
let changed = true;
while (changed) {
  changed = false;
  for (const [lp, buf] of [...files]) {
    if (!/\.(html|js|css)$/.test(lp)) continue;
    for (const m of buf.toString("utf8").matchAll(refRe)) {
      const ref = m[0];
      const url = ref.startsWith("http") ? ref : origin + ref;
      const local = localFor(url);
      if (!local || files.has(local)) continue;
      if (await fetchAsset(local, url)) changed = true;
      else console.log("missing", ref);
    }
  }
}
for (const p of ["/favicon.ico", "/robots.txt", "/manifest.json", "/site.webmanifest"]) if (!files.has(p)) await fetchAsset(p, origin + p);

// Rewrite GHL-hosted media to local paths.
for (const [lp, buf] of files) {
  if (!/\.(html|js|css|json|webmanifest)$/.test(lp)) continue;
  files.set(lp, Buffer.from(buf.toString("utf8").split(FS_HOST).join("/_fs/")));
}
for (const [lp, buf] of files) {
  const dest = path.join(out, lp);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
}
fs.writeFileSync(path.join(here, slug, "mirror-report.json"), JSON.stringify({ origin, mirroredAt: new Date().toISOString(), pages: [...pagesSeen], files: files.size, externalCalls: [...external] }, null, 2));
console.log(`done ${slug}: ${pagesSeen.size} pages, ${files.size} files, external calls: ${external.size}`);
await b.close();
