# LinkedIn Projects — copy-paste entries

Where to add: LinkedIn profile → **Add profile section → Recommended → Add projects**.
For each entry, fill **Project name**, **Description**, **Skills** (LinkedIn allows 5), **Associated with**, **Start/End date**, and add the **Project URL / media link**.

**Order to add them in (most interview-relevant first):** 1 → 7. LinkedIn shows the newest-dated project first, so give #1 and #2 the latest dates.

**Dates:** use the months you actually built each one. I don't have your build dates, so they aren't filled in. The live captures are from September 2026.

**Associated with:** *Principal Consultant — Blair Digital Studios* for #1 and #3–#7. Use no association (or your own name) for #2 (VYBE).

**Honesty note:** the chiropractic builds are described as **prospect demos** built from public information before any engagement. Once a practice signs, change its entry to client work (for example, "Built for Cactus Chiropractic").

**Links:** point to your portfolio's `/work/...` pages or `/solutions`, not `/solutions/<practice>`. Those individual client pages are hidden from crawlers, so LinkedIn would show a link without a preview image.

---

## 1. Solutions Engineering Portfolio & Live Demo Library

**Project URL:** https://emmanuel-nanadoum.vercel.app

**Skills:** Solution Architecture · Pre-sales · Technical Demonstrations · Next.js · Customer Discovery

**Description:**
A proposal-style portfolio that shows how I work as a Solutions Engineer: discovery → requirements → solution architecture → working demo → implementation. Every exhibit links to a live build, and each case study walks through the business problem, discovery, requirements, architecture, integration points, tradeoffs and handoff.

Includes a client-facing solution lab: six live demos a practice owner can open directly, each labeled honestly as live, sample data, or not activated.

Built with Next.js, TypeScript, Tailwind CSS and GSAP, and deployed on Vercel with analytics on résumé, demo and contact clicks. Lighthouse 100/100/100/100 on desktop; zero WCAG 2.2 AA violations in automated testing.

---

## 2. VYBE — AI Passenger Experience Platform (Voice Concierge)

**Project URL:** https://vybe-app-blue.vercel.app/variation5/experience/  *(add https://vybe-app-blue.vercel.app/variation5/ as a second link)*

**Skills:** Artificial Intelligence (AI) · Speech Recognition · Supabase · REST APIs · Product Discovery

**Description:**
VYBE connects the people in a car with music, food, places and experiences that fit the ride. I took it from product discovery to a deployed voice concierge.

• Discovery reduced the problem to four in-car decisions (hear, eat, see, do) and four context inputs: destination, trip length, passengers and mood.
• Live voice pipeline: browser audio → ElevenLabs Scribe transcription → context-aware response using the ride context and recent turns → ElevenLabs speech, all on Vercel serverless functions.
• Supabase for auth, shared rides with join codes, and saved ride setups. Every provider key stays server-side, and a health endpoint reports which integrations are live.
• Route-aware recommendations (Google Places/Routes) are integrated and gated behind production credentials. Recommendations must come from real provider data, never invented venues.

Try the live voice demo at the link.

---

## 3. AI Patient Acquisition System — Chiropractic Sales Demo

**Project URL:** https://emmanuel-nanadoum.vercel.app/work/cactus

**Skills:** Sales Engineering · Customer Relationship Management (CRM) · Workflow Automation · GoHighLevel · Voice AI

**Description:**
A two-layer proof of concept built to pitch a chiropractic practice in Peoria, AZ. It is a prospect demo built from public information before engagement.

Layer one is a patient website in the practice's own brand. Layer two is a revenue-system page where the owner can call a two-way AI receptionist on a dedicated demo line (kept separate from the practice's real number), submit a test patient form, and walk a 13-step patient journey:

call or web inquiry → instant response → CRM contact → pipeline → booking → SMS and email confirmation → reminders → show/no-show → follow-up → review request → reactivation → reporting.

Every dashboard number is labeled as sample data. The case study covers discovery, requirements, integration points, tradeoffs and go-live scope.

---

## 4. Reusable CRM Revenue System — 12-Stage Pipeline & Automation Simulator

**Project URL:** https://emmanuel-nanadoum.vercel.app/work/palmer-herman

**Skills:** Solution Architecture · CRM Automation · Workflow Design · Lead Management · Implementation Planning

**Description:**
How to reuse solution architecture without turning every client into the same template. This is a prospect demo for a two-doctor practice in Connecticut, built from public information before engagement.

• The system logic is reused: capture → conversation → schedule → remind → review.
• What gets customized per practice: pipeline stage names, lead tags, message copy in the practice's voice, and which modules launch first.
• Designed a 12-stage pipeline (New Lead → Completed / Reactivation / Lost) with explicit routing and stop conditions: website lead to confirmation, missed-call text-back after about a minute, a follow-up sequence that stops when the lead books, replies or opts out, 24-hour and 2-hour reminders, no-show recovery, and ungated review requests.
• Built a live simulator that runs demo contacts through each automation step by step.
• Staged rollout, with guardrails for the AI voice receptionist defined before activation: no diagnoses, no medical advice, escalate to staff.

---

## 5. Digital Revenue-Leak Audit & Connected Growth System

**Project URL:** https://emmanuel-nanadoum.vercel.app/work/blair-revenue-systems

**Skills:** Consultative Selling · Business Analysis · Solution Selling · Customer Discovery · Presentations

**Description:**
An owner-facing guided presentation and audit, built as a prospect demo for a Phoenix chiropractic practice.

The audit uses only publicly observable information and labels every finding as either verified, an opportunity to investigate, or a proposed solution. For example, missed calls are framed as an opportunity requiring the owner's confirmation, not an accusation.

The presentation maps an 11-stage journey (search → website → request → capture → CRM → follow-up → appointment → reminders → visit → reputation → reactivation). For each stage it covers what happens, why it matters and what gets implemented. It also includes a missed-call recovery simulation and a digital concierge scoped to non-clinical questions.

The consulting approach: find where revenue leaks before proposing technology, and treat honest labeling as part of the pitch.

---

## 6. Conversion-Focused Practice Websites (2 prospect builds)

**Project URL:** https://emmanuel-nanadoum.vercel.app/solutions

**Skills:** Web Design · Conversion Rate Optimization · Local SEO · HTML/CSS · User Experience (UX)

**Description:**
Two chiropractic practice websites built as prospect demos:
• A single-practice site built around how patients describe the problem.
• A multi-service site covering chiropractic, auto-accident care, massage and wellness, with a "what to expect" path for first visits.

Every page ends in one of two actions: request an appointment or call. The sites are mobile-first, with local directions and clear calls to action. The CRM and follow-up layer from the other demos can be added per practice.

---

## 7. Aesthetic Medicine Website Template (Multi-Location)

**Project URL:** https://emmanuel-nanadoum.vercel.app/solutions

**Skills:** Web Development · Templates · Conversion Rate Optimization · SMS Compliance · User Experience (UX)

**Description:**
A reusable med spa template built to move visitors from treatment interest to a booked consultation. It includes treatment pages (injectables, skin rejuvenation, laser, body contouring, medical skincare), plus membership, results and consultation flows, and privacy, terms and SMS-terms pages.

Address, phone and email are template variables (`{{location.*}}`) that each deployment fills with the practice's own details.

> ⚠️ Before adding #7, fill the placeholders on the live template (or put a visible "template preview" note on it). Right now every page shows `{{location.address}}` and "(000) 000-0000", and the Call and Email links don't work.

---

## Also update on LinkedIn
- **Contact info → Website:** https://emmanuel-nanadoum.vercel.app (type "Portfolio")
- **Featured section:** add the portfolio link and the VYBE Voice link
- **Headline:** Solutions Engineer | Sales Engineer | AI, CRM & Automation | Discovery → Demo → Implementation
- **About:** end with "Live demos and case studies: emmanuel-nanadoum.vercel.app"
