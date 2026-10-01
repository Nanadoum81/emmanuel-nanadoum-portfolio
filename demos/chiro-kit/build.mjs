// Blair chiropractic demo kit: one practice file in, a complete Cactus-pattern site out.
// Usage: node demos/chiro-kit/build.mjs <practice-slug>   → demos/chiro-kit/dist/<slug>/
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const slug = process.argv[2];
if (!slug) throw new Error("usage: node build.mjs <practice-slug>");
const P = (await import(pathToFileURL(path.join(here, "practices", slug, "practice.mjs")))).default;
const out = path.join(here, "dist", slug);
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "img"), { recursive: true });
fs.mkdirSync(path.join(out, "assets"), { recursive: true });
fs.mkdirSync(path.join(out, "api"), { recursive: true });

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const T = P.theme;
const addr = `${P.address.street}, ${P.address.city}, ${P.address.state} ${P.address.zip}`;
const dirs = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`;
const img = (name, alt, cls = "", attrs = "") => {
  const f = path.join(here, "practices", slug, "img", `${name}.jpg`);
  const buf = fs.readFileSync(f);
  // JPEG SOF0/SOF2 dimensions
  let i = 2, w = 0, h = 0;
  while (i < buf.length) {
    const m = buf[i + 1], len = buf.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xc3) { h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break; }
    i += 2 + len;
  }
  return `<img src="img/${name}.jpg" width="${w}" height="${h}" alt="${esc(alt)}" class="${cls}" loading="lazy" decoding="async" ${attrs}>`;
};

// Small authored icon set (24px grid, 1.6 stroke).
const I = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  msg: '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14.9-3.5M4 4v4h4M4 13a8 8 0 0 0 14.9 3.5M20 20v-4h-4"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  send: '<path d="M4 12l16-8-6 16-2-7z"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  missed: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2M16 3l5 5M21 3l-5 5"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
};
const icon = (n, cls = "i") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

const NAV = [["/", "Home"], ["/care", "Care"], ["/doctors", "The doctors"], ["/new-patients", "New patients"], ["/visit", "Visit"]];
const fmtM = (m) => { const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}${mm ? ":" + String(mm).padStart(2, "0") : ""}`; };
const DN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hoursSummary = (() => {
  if (!P.hours) return "Call for current office hours";
  const groups = new Map();
  for (const d of [1, 2, 3, 4, 5, 6, 0]) { const k = (P.hours[d] || []).map(([a, b]) => `${fmtM(a)}–${fmtM(b)}`).join(" &amp; ") || "closed"; groups.set(k, [...(groups.get(k) || []), DN[d]]); }
  return [...groups].map(([k, ds]) => `${ds.join(", ")} ${k}`).join(" · ");
})();

const head = (title, desc) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(P.tagline || desc)}">
<meta name="robots" content="noindex">
<meta name="theme-color" content="${T.brand}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${T.fontsHref || `https://fonts.googleapis.com/css2?family=${T.display.replace(/ /g, "+")}:ital,opsz,wght@${T.displayWeights}&family=${T.body.replace(/ /g, "+")}:wght@${T.bodyWeights}&display=swap`}" rel="stylesheet">
<style>:root{--bg:${T.bg};--surface:${T.surface};--sand:${T.sand};--sand-2:${T.sand2};--ink:${T.ink};--ink-2:${T.ink2};--rule:${T.rule};--brand:${T.brand};--brand-deep:${T.brandDeep};--brand-ink:${T.brandInk};--accent:${T.accent};--accent-soft:${T.accentSoft};--display:"${T.display}",Georgia,serif;--body:"${T.body}",system-ui,sans-serif;--radius:${T.radius}}</style>
<link rel="stylesheet" href="assets/site.css">
<script>window.PRACTICE=${JSON.stringify({ name: P.name, kind: P.kind, phone: P.phone, tel: P.tel, key: P.practiceKey, hours: P.hours, tz: P.timezone, slug: P.slug, monogram: P.monogram, addr })};</script>
<script src="assets/site.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>`;

const header = (active) => `
<header class="top">
  <div class="top-in">
    <a class="brand" href="/" aria-label="${esc(P.name)} home">
      <span class="mark" aria-hidden="true">${esc(P.monogram)}</span>
      <span class="brand-t"><b>${esc(P.name)}</b><small>${esc(P.kind)} · ${esc(P.city)}</small></span>
    </a>
    <nav class="nav" aria-label="Main">${NAV.map(([h, l]) => `<a href="${h}"${h === active ? ' aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
    <div class="top-act">
      <p class="status" data-status><span class="dot" aria-hidden="true"></span><span data-status-text>Hours</span></p>
      <a class="tel" href="tel:${P.tel}">${icon("phone")}<span>${esc(P.phone)}</span></a>
      <a class="btn btn-brand" href="/new-patients#book">Book online</a>
    </div>
  </div>
</header>`;

const footer = () => `
<section class="cta-band">
  <div class="wrap cta-in">
    <h2 class="h2">Ready when you are.</h2>
    <p>Pick a time online in under a minute, or call the office.</p>
    <div class="cta-act"><a class="btn btn-light" href="/new-patients#book">${icon("cal")}Book online</a><a class="btn btn-ghost-light" href="tel:${P.tel}">${icon("phone")}Call ${esc(P.phone)}</a></div>
  </div>
</section>
<footer class="foot">
  <div class="wrap foot-grid">
    <div><p class="foot-brand"><span class="mark" aria-hidden="true">${esc(P.monogram)}</span>${esc(P.name)}</p><p class="muted">${esc(P.kind)} in ${esc(P.region)} since ${P.founded}.</p></div>
    <div><h3>Explore</h3><ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul></div>
    <div><h3>The office</h3><p>${esc(P.address.street)}<br>${esc(P.address.city)}, ${esc(P.address.state)} ${esc(P.address.zip)}</p><p><a href="tel:${P.tel}">${esc(P.phone)}</a>${P.fax ? `<br>Fax ${esc(P.fax)}` : ""}</p></div>
    <div><h3>Hours</h3><p>${hoursSummary}</p><p class="muted small">Call to confirm.</p></div>
  </div>
  <div class="wrap foot-legal">
    <p>© ${new Date().getFullYear()} ${esc(P.legal)}.</p>
    <p class="muted">Prospect demo by Blair Digital Studios, built from public information and not yet approved by the practice. ${esc(P.photoNote)}</p>
    <a class="sys-link" href="/revenue-system">${icon("layers")}See the system behind this site</a>
  </div>
</footer>
<div class="mbar" aria-label="Quick actions"><a href="tel:${P.tel}">${icon("phone")}Call</a><a class="go" href="/new-patients#book">${icon("cal")}Book online</a></div>
<div data-frontdesk></div>
<div data-owner></div>
</body></html>`;

const page = (file, active, title, desc, body) =>
  fs.writeFileSync(path.join(out, file), head(title, desc) + header(active) + `\n<main id="main">${body}</main>` + footer());

const reviewsBlock = (n = 6) => !P.reviews?.length ? "" : `
<section class="band" aria-labelledby="rv">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2" id="rv">${P.rating ? `Rated ${P.rating.value} by patients on ${P.rating.source}` : "What patients say"}</h2>
      ${P.rating ? `<p class="stars" aria-label="${P.rating.value} out of 5 stars">${icon("star", "i star")}${icon("star", "i star")}${icon("star", "i star")}${icon("star", "i star")}${icon("star", "i star")}<span>${P.rating.value} · ${P.rating.count} reviews</span></p>` : ""}
    </div>
    <div class="reviews">${P.reviews.slice(0, n).map((r, i) => `<figure class="review${i === 0 ? " lead" : ""}"><blockquote><p>“${esc(r.text)}”</p></blockquote><figcaption>${esc(r.by)}${r.meta ? ` <span>· ${esc(r.meta)}</span>` : ""}</figcaption></figure>`).join("")}</div>
    <p class="fine">Quoted from ${P.rating?.source || "public"} reviews, lightly shortened. Individual experiences vary.</p>
  </div>
</section>`;

const hoursBlock = () => `
<div class="hours-card" data-hours>
  <h3 class="h3">Office hours</h3>
  <p class="hours-now" data-hours-now></p>
  <div class="week" data-week></div>
  <p class="fine">${esc(P.hours ? P.hoursNote : "Call the office for current hours. Online booking shows demo availability.")}</p>
</div>`;

const bookingBlock = () => `
<section class="band sand" id="book" aria-labelledby="bk">
  <div class="wrap book-grid">
    <div class="book-copy">
      <h2 class="h2" id="bk">Book your visit online</h2>
      <p class="lede">Choose a day and time that works. You'll get a text confirming your request right away, and reminders before your visit.</p>
      <ul class="ticks">
        <li>${icon("check")}Instant text confirmation</li>
        <li>${icon("check")}Reminders 24 hours and 2 hours before</li>
        <li>${icon("check")}Add it to your calendar in one tap</li>
      </ul>
      <p class="muted">Rather talk to someone? Call <a href="tel:${P.tel}">${esc(P.phone)}</a>.</p>
    </div>
    <div class="booker" data-booking aria-live="polite"></div>
  </div>
</section>`;

// ---------- Home ----------
page("index.html", "/", `${P.name} ${P.kind} · ${P.region}`, `${P.kind} in ${P.region} since ${P.founded}. Book online or call ${P.phone}.`, `
<section class="hero${P.heroVariant === "full" ? " hero-full" : ""}">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="hero-place">${icon("pin")}${esc(P.heroPlace || `${P.address.street}, ${P.region}`)}</p>
      <h1 class="h1">${esc(P.hero.title)}</h1>
      <p class="lede">${esc(P.hero.lede)}</p>
      <div class="hero-act">
        <a class="btn btn-brand btn-lg" href="/new-patients#book">${icon("cal")}Book online</a>
        <a class="btn btn-line btn-lg" href="tel:${P.tel}">${icon("phone")}${esc(P.phone)}</a>
      </div>
      <div class="next-slots" data-next-slots></div>
      <p class="hero-proof">${P.rating ? `<span class="stars-s" aria-hidden="true">${icon("star", "i star").repeat(5)}</span>` : ""}${P.rating ? `<b>${P.rating.value}</b> on ${P.rating.source}` : ""}${P.founded ? ` · Since ${P.founded}` : ""}${P.doctors.length > 1 ? ` · ${P.doctors.length === 2 ? "Two" : P.doctors.length} doctors` : ""}</p>
    </div>
    <div class="hero-media">
      ${img(P.hero.img, P.hero.alt, "hero-img", 'fetchpriority="high" loading="eager"')}
      <div class="hero-chip" aria-hidden="true">${icon("msg")}<span><b>Text confirmations</b><small>sent the moment you book</small></span></div>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="why">
  <div class="wrap intro">
    <h2 class="statement" id="why">${esc(P.intro)}</h2>
    <dl class="facts">${(P.homeFacts || []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
  </div>
</section>

<section class="band" aria-labelledby="care-h">
  <div class="wrap">
    <div class="sec-head"><h2 class="h2" id="care-h">What we help with</h2><a class="link" href="/care">All care ${icon("arrow")}</a></div>
    <div class="care-trio">${P.conditions.filter((c) => c.img).map((c) => `
      <a class="care-tile" href="/care">
        ${img(c.img, c.title, "care-img")}
        <span class="care-t"><b>${esc(c.title)}</b><small>${esc(c.text)}</small></span>
      </a>`).join("")}
    </div>
  </div>
</section>

<section class="band sand" aria-labelledby="doc-h">
  <div class="wrap split">
    <div class="split-media">${img("consult", "A chiropractor explaining the spine to a patient with a spine model", "round")}</div>
    <div>
      <h2 class="h2" id="doc-h">${esc(P.doctorsHomeTitle || (P.doctors.length > 1 ? `Meet the doctors` : `Meet ${P.doctors[0].name}`))}</h2>
      <p class="lede">${esc(P.doctorsIntro)}</p>
      <ul class="doc-mini">${P.doctors.map((d) => `<li><span class="mark sm" aria-hidden="true">${esc(d.short.replace("Dr. ", "")[0])}</span><span><b>${esc(d.name)}</b><small>${d.quote ? `“${esc(d.quote.text.split(". ").slice(-1)[0])}”` : esc(d.facts?.[0]?.[1] || "Doctor of Chiropractic")}</small></span></li>`).join("")}</ul>
      <a class="btn btn-line" href="/doctors">${P.doctors.length > 1 ? "Meet the doctors" : `Meet ${esc(P.doctors[0].short)}`} ${icon("arrow")}</a>
    </div>
  </div>
</section>

<section class="band" aria-labelledby="fv-h">
  <div class="wrap">
    <h2 class="h2" id="fv-h">Your first visit, step by step</h2>
    <ol class="steps">${P.firstVisit.map((s) => `<li><h3 class="h3">${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
  </div>
</section>

<section class="band feature" aria-labelledby="ft-h">
  <div class="wrap split rev">
    <div>
      <h2 class="h2" id="ft-h">${esc(P.featured.title)}</h2>
      <p class="lede">${esc(P.featured.text)}</p>
      <a class="btn btn-brand" href="/new-patients#book">${icon("cal")}Book a visit</a>
    </div>
    <div class="split-media">${img(P.featured.img, P.featured.alt, "round")}</div>
  </div>
</section>

${reviewsBlock(5)}

<section class="band sand" aria-labelledby="tb-h">
  <div class="wrap split">
    <div>
      <h2 class="h2" id="tb-h">Missed us on the phone? We text you back.</h2>
      <p class="lede">When the front desk is with a patient, you won't get a busy signal and silence. A text arrives within seconds so you can book without calling twice.</p>
      <p class="muted">Try it: tap “Call the office” on the phone.</p>
    </div>
    <div data-textback></div>
  </div>
</section>

<section class="band" aria-labelledby="vh">
  <div class="wrap visit-grid">
    <div>
      <h2 class="h2" id="vh">${esc(P.address.street)}, ${esc(P.address.city)}</h2>
      <p class="lede">${esc(P.access)} Easy to find, easy to get into.</p>
      <div class="visit-act"><a class="btn btn-line" href="${dirs}" target="_blank" rel="noopener">${icon("pin")}Directions</a><a class="btn btn-line" href="tel:${P.tel}">${icon("phone")}${esc(P.phone)}</a></div>
    </div>
    ${hoursBlock()}
  </div>
</section>`);

// ---------- Care ----------
page("care.html", "/care", `Care · ${P.name}`, `What ${P.name} helps with and how the doctors treat.`, `
<section class="page-head"><div class="wrap">
  <h1 class="h1">Care, explained plainly</h1>
  <p class="lede">The reasons patients come in most, and the care the practice offers.</p>
</div></section>
<section class="band"><div class="wrap">
  <h2 class="h2">What brings people in</h2>
  <div class="cond-grid">${P.conditions.map((c) => `<article class="cond">${c.img ? img(c.img, c.title, "cond-img") : ""}<div><h3 class="h3">${esc(c.title)}</h3><p>${esc(c.text)}</p></div></article>`).join("")}</div>
</div></section>
<section class="band sand"><div class="wrap split">
  <div>
    <h2 class="h2">How the doctors treat</h2>
    <ul class="treat">${P.treatments.map((t) => `<li><h3 class="h3">${esc(t.title)}</h3><p>${esc(t.text)}</p></li>`).join("")}</ul>
  </div>
  <div class="split-media">${img(P.treatImg?.name || "tens", P.treatImg?.alt || "Electrical muscle stimulation pads on a patient's thigh", "round tall")}</div>
</div></section>
<section class="band"><div class="wrap">
  <p class="fine big">Chiropractic care is not a cure for disease, and results differ from person to person. For sudden or severe symptoms, call 911 or your doctor.</p>
</div></section>
${bookingBlock()}`);

// ---------- Doctors ----------
page("doctors.html", "/doctors", `The doctors · ${P.name}`, `Meet ${P.doctors.map((d) => d.name).join(" and ")}.`, `
<section class="page-head"><div class="wrap">
  <h1 class="h1">${esc(P.doctorsTitle || (P.doctors.length > 1 ? "The doctors" : P.doctors[0].name))}</h1>
  <p class="lede">${esc(P.doctorsIntro)}</p>
</div></section>
<section class="band"><div class="wrap docs">${P.doctors.map((d, i) => `
  <article class="doc">
    <div class="doc-photo">${img(fs.existsSync(path.join(here, "practices", slug, "img", `doctor-${i + 1}.jpg`)) ? `doctor-${i + 1}` : i === 0 ? "shoulder" : "care-hands", "Illustrative photo of chiropractic care", "")}<span class="ph-note">Portrait of ${esc(d.short)} to be photographed</span></div>
    <div class="doc-body">
      <h2 class="h2">${esc(d.name)}</h2>
      <dl class="facts tight">${d.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      ${d.quote ? `<blockquote class="doc-q"><p>“${esc(d.quote.text)}”</p><footer>${esc(d.quote.by)}</footer></blockquote>` : ""}
      <a class="btn btn-brand" href="/new-patients#book">${icon("cal")}Book with ${esc(d.short)}</a>
    </div>
  </article>`).join("")}
</div></section>
${reviewsBlock(4)}`);

// ---------- New patients ----------
page("new-patients.html", "/new-patients", `New patients · ${P.name}`, `Book your first visit at ${P.name} online.`, `
<section class="page-head"><div class="wrap">
  <h1 class="h1">New patients</h1>
  <p class="lede">Book online in under a minute. The office will text to confirm and remind you before your visit.</p>
</div></section>
${bookingBlock()}
<section class="band"><div class="wrap split">
  <div>
    <h2 class="h2">What to expect</h2>
    <ol class="steps v">${P.firstVisit.map((s) => `<li><h3 class="h3">${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join("")}</ol>
  </div>
  <div class="checklist">
    <h2 class="h3">What to bring</h2>
    <ul>${P.bring.map((b) => `<li>${icon("check")}${esc(b)}</li>`).join("")}</ul>
    <h2 class="h3">Insurance</h2>
    <p>${esc(P.insurance)}</p>
  </div>
</div></section>
<section class="band sand"><div class="wrap faq-wrap">
  <h2 class="h2">Questions people ask</h2>
  <div class="faq">${P.faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>
</div></section>`);

// ---------- Visit ----------
page("visit.html", "/visit", `Visit · ${P.name}`, `Hours, directions and contact details for ${P.name}.`, `
<section class="page-head"><div class="wrap">
  <h1 class="h1">Visit the office</h1>
  <p class="lede">${esc(addr)}. ${esc(P.access)}</p>
</div></section>
<section class="band"><div class="wrap visit-grid">
  <div class="contact-list">
    <a class="contact" href="tel:${P.tel}">${icon("phone")}<span><b>Call</b><small>${esc(P.phone)}</small></span></a>
    <a class="contact" href="${dirs}" target="_blank" rel="noopener">${icon("pin")}<span><b>Directions</b><small>${esc(addr)}</small></span></a>
    ${P.fax ? `<div class="contact">${icon("layers")}<span><b>Fax for records</b><small>${esc(P.fax)}, for physicians and attorneys</small></span></div>` : ""}
    <a class="contact" href="/new-patients#book">${icon("cal")}<span><b>Book online</b><small>Text confirmation in seconds</small></span></a>
  </div>
  ${hoursBlock()}
</div></section>
<section class="band sand"><div class="wrap split">
  <div>
    <h2 class="h2">Called and nobody picked up?</h2>
    <p class="lede">You'll get a text back within seconds with a way to book. Try it on the phone.</p>
  </div>
  <div data-textback></div>
</div></section>`);

// ---------- Revenue system (Blair sales demo) ----------
page("revenue-system.html", "", `Revenue system demo · ${P.name}`, `The Blair Chiropractor Revenue System, demonstrated on ${P.name}.`, `
<section class="rs-head"><div class="wrap rs-head-in">
  <div>
    <p class="rs-badge">Blair Digital Studios · Sales demo</p>
    <h1 class="h1">The Chiropractor Revenue System</h1>
    <p class="lede">Demonstrated on ${esc(P.name)}, ${esc(P.region)}. From the first call to the booked appointment, every opportunity is captured, followed up and tracked.</p>
  </div>
  <div class="rs-cta"><a class="btn btn-brand" href="/new-patients#book">${icon("cal")}Test the booking flow</a><button class="btn btn-line" type="button" data-open-frontdesk>${icon("bot")}Talk to the AI front desk</button></div>
</div></section>
<section class="band tight"><div class="wrap">
  <p class="demo-note">${icon("shield")}<span><b>Illustrative demo data.</b> Names, counts and metrics on this page are sample data, not results for ${esc(P.name)}. Your own test bookings from this browser appear in the pipeline so you can follow them through.</span></p>
  <div class="tabs" role="tablist" aria-label="Revenue system">
    ${[["journey", "Patient journey", "refresh"], ["modules", "System modules", "layers"], ["crm", "CRM pipeline", "user"], ["voice", "AI front desk", "bot"], ["flows", "Workflow demos", "bell"], ["reports", "Reporting", "chart"]].map(([id, l, ic], i) => `<button role="tab" id="t-${id}" aria-controls="p-${id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${icon(ic)}${l}</button>`).join("")}
  </div>
  <div class="panels" data-rs></div>
</div></section>
<section class="rs-close"><div class="wrap">
  <h2 class="h2">Want this running for your practice?</h2>
  <p class="lede">Blair Digital Studios builds and manages the website, AI front desk, CRM, follow-up and patient acquisition system as one connected service.</p>
  <a class="btn btn-light btn-lg" href="mailto:nanadoum81@gmail.com?subject=${encodeURIComponent(`Revenue system for ${P.name}`)}">Talk to Blair Digital Studios ${icon("arrow")}</a>
</div></section>`);

// ---------- assets ----------
for (const f of fs.readdirSync(path.join(here, "assets"))) fs.copyFileSync(path.join(here, "assets", f), path.join(out, "assets", f));
for (const f of fs.readdirSync(path.join(here, "practices", slug, "img"))) if (f.endsWith(".jpg")) fs.copyFileSync(path.join(here, "practices", slug, "img", f), path.join(out, "img", f));
fs.writeFileSync(path.join(out, "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${T.brand}"/><text x="32" y="40" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#fff">${esc(P.monogram)}</text></svg>`);
fs.writeFileSync(path.join(out, "vercel.json"), JSON.stringify({ $schema: "https://openapi.vercel.sh/vercel.json", cleanUrls: true, trailingSlash: false, headers: [{ source: "/img/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }] }, null, 2));
fs.copyFileSync(path.join(here, "lead-endpoint.js"), path.join(out, "api", "demo-lead.js"));
fs.writeFileSync(path.join(out, "api", "demo-lead.js"), fs.readFileSync(path.join(out, "api", "demo-lead.js"), "utf8").replace("__SLUG__", JSON.stringify(P.slug)));
console.log("built", path.relative(process.cwd(), out));
