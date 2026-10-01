# Emmanuel Nanadoum — Solutions Engineering Portfolio

Live site: **https://emmanuel-nanadoum.vercel.app**

A proposal-style portfolio for AI Consultant / Solutions Engineer / Sales Engineer roles. Each case study follows the pre-sales path: problem → discovery → requirements → architecture → working demo → integrations → tradeoffs → handoff.

## What's in this repo

| Path | What it is |
| --- | --- |
| `app/(portfolio)/` | Recruiter-facing site: home, case studies (`/work/[slug]`), about, contact, résumé |
| `app/solutions/` | Client-facing solution lab: one page per practice demo (noindex) |
| `app/(portfolio)/receptionist/` + `app/api/receptionist/` | Browser AI receptionist: Web Speech API for listening and speaking, Google Gemini for replies, guarded system prompt, rate limit, model fallback |
| `app/api/leads/` | Saves demo-site form submissions as private JSON in Vercel Blob (optional email copy via Resend) |
| `lib/work.ts`, `lib/demos.ts`, `lib/site.ts` | All case-study, demo and profile content in one place |
| `demos/` | Static mirrors of six prospect demo sites, each deployed as its own Vercel project, plus the scripts that mirror, patch and test them |
| `resume/` | Generates the one-page résumé PDF and DOCX from `content.mjs` |
| `_capture/` | Playwright QA scripts: screenshots, accessibility (axe), link checks |

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · GSAP (tablet/desktop only) · Vercel (hosting, Analytics, Blob) · Google Gemini · Web Speech API

## Run locally

```bash
npm install
npm run dev
```

The receptionist needs `GEMINI_API_KEY`; lead saving needs `BLOB_READ_WRITE_TOKEN`. Without them the rest of the site still runs; the receptionist shows an offline state and lead saving returns an error.

## Honesty rules

Practice demos are prospect demos built from public information before engagement. Dashboard numbers are labeled sample data, and anything not activated is labeled as such.
