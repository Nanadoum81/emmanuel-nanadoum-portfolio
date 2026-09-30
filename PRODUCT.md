# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + React + TypeScript + Tailwind CSS + GSAP, deployed to its own Vercel project from its own GitHub repository. Chosen by the user's brief ("Next.js, React, TypeScript, Tailwind, GSAP"). Separate from the VYBE repository and deployment so VYBE production is never at risk (inferred default; the user did not pick a deploy option explicitly).

## Users

1. **Recruiters and hiring managers** for AI Consultant, Solutions Engineer, Sales Engineer, Solutions Consultant, Technical Presales, Implementation Consultant and customer-facing technical roles. They skim fast, often on a phone, and must understand within five seconds who Emmanuel is, what he targets, what he built, and how to contact him or download the resume.
2. **Prospective Blair Digital Studios clients** (small healthcare/wellness practices: chiropractors, med spas) who receive a direct link to their own live demo. They must not have to navigate a recruiter portfolio to find it.

## Product Purpose

A proof-first portfolio that shows Emmanuel can run discovery, understand a business problem, architect a solution, build and demo it, explain tradeoffs, and carry it into implementation. Success: a recruiter clicks a working demo or downloads the resume and reaches out; a prospect opens their demo and books a conversation.

## Positioning

Emmanuel Nanadoum — AI Consultant / Solutions Engineer / Sales Engineer (AI, CRM & Automation). 8+ years of consultative selling plus 4+ years designing CRM, automation, web and AI-enabled solutions. The through-line: Discovery → Requirements → Solution Architecture → Demo / POC → Technical Validation → Implementation → Customer Enablement. He does not "make websites"; he identifies revenue and process problems and designs connected systems that solve them — and every claim is backed by a live, clickable build.

## Operating Context

- Contact: Phoenix, Arizona · Remote / Hybrid · nanadoum81@gmail.com · 602-810-1271 · linkedin.com/in/emmanuel-nanadoum-7971b7a8
- Resume: `public/Emmanuel_Nanadoum_Sales_Engineer_Resume.pdf` (source: ~/Downloads/Emmanuel_Nanadoum_Sales_Engineer_Resume_Updated.pdf, 2026-09-29; the "Interview_Optimized" filename named in the brief does not exist on disk — this file carries the exact positioning language from the brief).
- Current role on resume: Principal Consultant — CRM, AI Automation & Technical Solutions, Blair Digital Studios (2020–present). Prior: Online Experience Advisor, DriveTime Automotive (Jul–Sep 2026); Sales Representative, A Better Way Wholesale Autos (2017–2025). Education: B.S. Cybersecurity & Information Assurance, WGU (in progress); TripleTen Software Engineering training; HubSpot, Salesforce Trailhead, SQL, AWS fundamentals.

## Capabilities and Constraints

- Core competencies (from resume): discovery, needs analysis, solution mapping, technical demos, POCs, objection handling, workflow architecture, REST APIs, webhooks, CRM automation, AI voice, implementation planning, SQL, Python, HTML/CSS/JS, Supabase, Twilio, GoHighLevel, HubSpot, Salesforce, Jira, Git/GitHub, AWS fundamentals, troubleshooting, documentation.
- VYBE production health (verified 2026-09-30 via /api/health): Supabase ✓, ElevenLabs ✓, Google Places/Routes ✗ (not configured), OpenAI/AI Gateway ✗ (not configured). Live voice path: browser MediaRecorder → /api/voice-stt (ElevenLabs Scribe; Web Speech API fallback) → /api/voice-live (ride context + history) → /api/voice-tts (ElevenLabs). Route-aware, provider-grounded recommendations are architected but require production Google credentials — never present them as live.
- Cactus revenue system has a live AI receptionist demo line (860-743-4823). Palmer & Herman's AI voice receptionist is explicitly "not yet activated". All revenue-system dashboards use labeled sample/demo data.
- Nelson and Coyote have no /revenue-system route (404).

## Brand Commitments

- VYBE Variation 5 is locked: deep black / midnight navy, cyan, electric blue, violet, subtle magenta, night-driving imagery. Present it faithfully; never restyle it.
- Each client build (Cactus, Nelson, Palmer & Herman, Coyote, Canham, Blair MedSpa) is its own locked visual source of truth. Show them as they are (real screenshots, live links); never merge them into the portfolio's own style.
- The portfolio must not look AI-generated: no fake dashboards, gradient blobs, pill-chip overload, six-card grids, numbered circles, neon purple, generic stock.

## Evidence on Hand

- Live: VYBE site https://vybe-app-blue.vercel.app/variation5/ and VYBE Voice https://vybe-app-blue.vercel.app/variation5/experience/
- Live client builds: blair-demo-cactus.vercel.app (+ /revenue-system), blair-demo-nelson.vercel.app, blair-demo-palmer.vercel.app (+ /revenue-system), blair-demo-coyote.vercel.app, blair-demo-canham.vercel.app (+ /revenue-system), blair-demo-medspa.vercel.app
- Real screenshots captured 2026-09-30 in `_capture/raw/` (desktop 1440 and mobile 390).
- The five chiropractic builds are prospect demos built from public information; the user said on 2026-09-30 they are "about to be clients" but none had signed yet (the Cactus README: "Not affiliated with, endorsed by, or operated on behalf of the practice"). Describe them as spec or prospect demos, never as clients, unless the user confirms an engagement. Blair MedSpa is a template with `{{location.*}}` placeholders.
- Absent and never to be fabricated: client results, revenue numbers, conversion rates, testimonials, client logos, "trusted by" rows, certifications beyond the resume, employer claims beyond the resume.

## Product Principles

1. Proof before claims — every capability links to something that runs.
2. Show the thinking — each case study walks problem → discovery → architecture → demo → tradeoffs → handoff.
3. Honest status — say what is live, what is demo data, and what is not yet activated.
4. Two audiences, two doors — recruiter pages speak to hiring; client demo pages speak to the practice owner.
5. Locked references are respected, not reinterpreted.

## Accessibility & Inclusion

WCAG 2.2 AA: keyboard usable, visible focus, sufficient contrast, semantic landmarks, prefers-reduced-motion respected for all GSAP motion.
