// Applies post-mirror fixes and packages a mirrored demo for Vercel.
// Usage: node demos/patch.mjs <slug>
import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
const here = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname));
const root = path.join(here, slug);
const site = path.join(root, "site");
if (!fs.existsSync(site)) throw new Error(`no mirror for ${slug}`);

// Replacements run on HTML and JS alike so server HTML and client hydration stay identical.
const common = [
  // Form submissions no longer go to GoHighLevel; they land on this deployment's own endpoint.
  ["https://backend.leadconnectorhq.com/external-tracking/events", "/api/demo-lead"],
];

const perSite = {
  cactus: [
    ["https://api.leadconnectorhq.com/widget/bookings/blair-chiro-revenue-demo", "mailto:nanadoum81@gmail.com?subject=Blair%20Revenue%20System%20walkthrough"],
    ["OPENS BLAIR DIGITAL STUDIOS BOOKING CALENDAR", "EMAILS BLAIR DIGITAL STUDIOS"],
    ["Opens Blair Digital Studios booking calendar", "Emails Blair Digital Studios"],
    // The GHL phone demo line is retired; the AI receptionist now runs in the browser.
    ["tel:+18607434823", "https://emmanuel-nanadoum.vercel.app/receptionist?demo=1"],
    ["(860) 743-4823", "Talk in your browser"],
    ["Call the number. Pretend you&#x27;re a new patient.", "Talk to it. Pretend you&#x27;re a new patient."],
    ["Call the number. Pretend you're a new patient.", "Talk to it. Pretend you're a new patient."],
    ["Call the number and pretend you're a new patient.", "Talk to it and pretend you're a new patient."],
    ["Call AI Receptionist", "Talk to AI Receptionist"],
    ["Connected Number — Test Call Required", "Live in your browser — no phone needed"],
    ["CONNECTED — TEST CALL REQUIRED", "LIVE IN YOUR BROWSER"],
    ["Test Call Required", "Live in your browser"],
    ["AI Voice Demo Line", "AI Voice Demo"],
    ["Demo number is separate from the public Cactus line", "Runs separately from the public Cactus line"],
  ],
  medspa: [
    ["tel:{{location.phone}}", "#consultation-template"],
    ["mailto:{{location.email}}", "#consultation-template"],
    ["{{location.phone}}", "Your practice phone"],
    ["{{location.email}}", "Your practice email"],
    ["{{location.address}}", "Your practice address"],
    ["(000) 000-0000", "Your practice phone"],
    ["{{location.website}}", "Your practice website"],
    ["https://api.leadconnectorhq.com/widget/booking/qJhhEGOesVC0CB4nXbzL", "/_template/booking.html"],
  ],
};

// Pattern fixes: template call/email links go to the site's own pages instead of dialing placeholder text.
const perSiteRegex = {
  medspa: [
    [/`tel:\$\{(\w+)\.location\.phone\}`/g, "`/consultation`"],
    [/`mailto:\$\{(\w+)\.location\.email\}`/g, "`/contact`"],
  ],
};

const rules = [...common, ...(perSite[slug] ?? [])];
const counts = Object.fromEntries(rules.map(([a]) => [a, 0]));
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

for (const f of walk(site)) {
  if (!/\.(html|js|css)$/.test(f)) continue;
  let s = fs.readFileSync(f, "utf8");
  const before = s;
  for (const [a, b] of rules) {
    const n = s.split(a).length - 1;
    if (n) { counts[a] += n; s = s.split(a).join(b); }
  }
  for (const [re, b] of perSiteRegex[slug] ?? []) {
    const n = (s.match(re) || []).length;
    if (n) { counts[String(re)] = (counts[String(re)] || 0) + n; s = s.replace(re, b); }
  }
  if (slug === "medspa" && f.endsWith(".html") && !s.includes('id="blair-template-note"')) {
    // A quiet notice appended after hydration so React never sees it in its tree.
    const note = `<script id="blair-template-note">(function(){function add(){if(document.getElementById("blair-template-banner"))return;var d=document.createElement("div");d.id="blair-template-banner";d.setAttribute("role","note");d.textContent="Template preview by Blair Digital Studios — contact details are placeholders.";d.style.cssText="position:fixed;left:0;right:0;bottom:0;z-index:2147483000;padding:8px 16px;background:rgba(20,17,14,.92);color:#efe7da;font:500 12.5px/1.4 system-ui,-apple-system,sans-serif;letter-spacing:.02em;text-align:center";document.body.appendChild(d)}if(document.readyState==="complete")setTimeout(add,300);else addEventListener("load",function(){setTimeout(add,300)})})();</script>`;
    s = s.replace("</body>", `${note}</body>`);
  }
  if (s !== before) fs.writeFileSync(f, s);
}

// Leftover GoHighLevel references (should be none that matter).
const leftovers = new Set();
for (const f of walk(site)) {
  if (!/\.(html|js|css)$/.test(f)) continue;
  for (const m of fs.readFileSync(f, "utf8").matchAll(/https?:\/\/[a-z0-9.-]*(leadconnectorhq|filesafe\.space|msgsndr|gohighlevel)[^"'`\s)]*/g)) leftovers.add(m[0]);
  if (slug === "medspa") for (const m of fs.readFileSync(f, "utf8").matchAll(/\{\{location\.[a-z]+\}\}/g)) leftovers.add(m[0]);
}

// MedSpa: a neutral stand-in for the GHL booking calendar embed.
if (slug === "medspa") {
  fs.mkdirSync(path.join(site, "_template"), { recursive: true });
  fs.writeFileSync(path.join(site, "_template", "booking.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Booking calendar preview</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f6f2ec;color:#2a241f;font:15px/1.55 system-ui,-apple-system,sans-serif}.b{max-width:420px;padding:32px;text-align:center}h1{font:500 22px/1.2 Georgia,serif;margin:0 0 10px}p{margin:0;color:#6b6259}</style></head><body><div class="b"><h1>Booking calendar preview</h1><p>In a live deployment, the practice's scheduling calendar appears here so new patients can choose a consultation time.</p></div></body></html>`);
}

// Vercel packaging: static site + a tiny endpoint that forwards demo form posts to the portfolio's /api/leads.
fs.mkdirSync(path.join(site, "api"), { recursive: true });
fs.writeFileSync(
  path.join(site, "api", "demo-lead.js"),
  `// Receives demo form submissions (formerly sent to GoHighLevel) and forwards them to the
// portfolio's /api/leads, which saves them privately. Always answers 204 so the form behaves normally.
const DEMO = ${JSON.stringify(slug)};
const LEADS_URL = "https://emmanuel-nanadoum.vercel.app/api/leads";
const MAX_BODY = 2 * 1024 * 1024;

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error("body too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Keep the lead small: drop uploaded files and long base64 strings.
function slim(event) {
  if (!event || typeof event !== "object" || !event.formData) return event;
  const formData = {};
  for (const [k, v] of Object.entries(event.formData)) {
    if (typeof v === "string" && v.length > 2000) formData[k] = "[omitted: " + v.length + " chars]";
    else if (v && typeof v === "object") formData[k] = "[file omitted]";
    else formData[k] = v;
  }
  return { ...event, formData };
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).end(); return; }
  try {
    const type = String(req.headers["content-type"] || "");
    const body = await readBody(req);
    let event = null;
    if (type.includes("multipart/form-data") || type.includes("urlencoded")) {
      const form = await new Request("http://local", { method: "POST", headers: { "content-type": type }, body }).formData();
      const raw = form.get("event");
      event = typeof raw === "string" ? JSON.parse(raw) : null;
    } else if (body.length) {
      event = JSON.parse(body.toString("utf8"));
    }
    const r = await fetch(LEADS_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ demo: DEMO, ip: String(req.headers["x-forwarded-for"] || ""), page: String(req.headers.referer || ""), event: slim(event) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error("lead forward failed", r.status);
  } catch (err) {
    console.error("lead forward error", err instanceof Error ? err.message : "unknown");
  }
  res.status(204).end();
}
`
);
fs.writeFileSync(
  path.join(site, "vercel.json"),
  JSON.stringify(
    {
      $schema: "https://openapi.vercel.sh/vercel.json",
      cleanUrls: true,
      trailingSlash: false,
      headers: [
        { source: "/assets/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
        { source: "/_fs/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      ],
    },
    null,
    2
  )
);
if (!fs.existsSync(path.join(site, "404.html"))) {
  fs.writeFileSync(path.join(site, "404.html"), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found</title><body style="font-family:system-ui;padding:48px;max-width:640px;margin:auto"><h1>Page not found</h1><p><a href="/">Go to the home page</a></p></body>`);
}
console.log(JSON.stringify({ slug, replacements: counts, leftovers: [...leftovers] }, null, 2));
