// Single source for the résumé. Every claim here is either from Emmanuel's own résumés
// or verified against the live builds (2026-09-30). Do not add metrics that aren't real.

export const resume = {
  name: "Emmanuel Nanadoum",
  headline: "Solutions Engineer | Sales Engineer | AI, CRM & Automation",
  contact: [
    "Phoenix, AZ (Remote / Hybrid)",
    "602-810-1271",
    "nanadoum81@gmail.com",
    "linkedin.com/in/emmanuel-nanadoum-7971b7a8",
  ],
  portfolio: { label: "Portfolio & live demos", url: "https://emmanuel-nanadoum.vercel.app" },

  summary:
    "Customer-facing technical and sales professional with 8+ years of consultative, high-ticket selling and 4+ years designing CRM, automation, web, and AI voice solutions. Leads discovery, turns business pain into technical requirements, builds proof-of-concept demos on the prospect's own business, and guides customers from evaluation through implementation. Portfolio: six live prospect demos and a deployed AI voice product.",

  skills: [
    ["Presales", "Technical discovery, needs analysis, solution mapping, technical demos, proof of concept (POC), technical validation, objection handling, value articulation, scoping and proposals"],
    ["Solution design", "Solution architecture, workflow and integration diagrams, implementation planning, technical documentation, stakeholder communication, customer training and enablement"],
    ["Technical", "REST APIs, webhooks, SQL, Python, JavaScript, HTML/CSS, serverless functions (Vercel), Supabase (Postgres, auth), AWS fundamentals, Git/GitHub, troubleshooting"],
    ["Platforms & AI", "GoHighLevel, HubSpot, Salesforce, Twilio (voice/SMS), ElevenLabs (speech-to-text, text-to-speech), Google Gemini API, Web Speech API, AI voice agents, CRM automation, Jira"],
  ],

  experience: [
    {
      role: "Principal Consultant, CRM, AI Automation & Technical Solutions",
      org: "Blair Digital Studios",
      where: "Remote",
      when: "2020 – Present",
      bullets: [
        "Lead discovery and public-information revenue-leak audits for small practices (chiropractic, med spa), pinpoint where leads and revenue leak, and map goals to CRM, automation, web, and AI voice solutions.",
        "Build proof-of-concept demos on each prospect's own brand: six live prospect demos, including a revenue system with a live AI voice receptionist, test patient form, and 13-step patient journey.",
        "Design reusable solution architecture customized per client: a 12-stage CRM pipeline with tagged lead routing, missed-call text-back, 24-hour and 2-hour reminders, no-show recovery, and review requests.",
        "Present solution diagrams, scopes, and implementation plans with clear tradeoffs, then own handoff into configuration, testing, launch, and training using GoHighLevel, Twilio, REST APIs, and webhooks.",
      ],
    },
    {
      role: "Sales Representative",
      org: "A Better Way Wholesale Autos",
      where: "Naugatuck, CT",
      when: "Sep 2017 – 2025",
      bullets: [
        "Managed a high-volume, high-ticket pipeline from discovery through close, matching needs to vehicle and financing options.",
        "Delivered product presentations, handled objections, and coordinated finance, service, and operations to close deals.",
        "Built repeat and referral business through CRM follow-up and structured outreach; consistently a top performer.",
        "Balanced revenue goals, customer satisfaction, and documentation accuracy across complex multi-step transactions.",
      ],
    },
  ],

  projects: [
    {
      name: "VYBE, AI passenger experience platform",
      link: "vybe-app-blue.vercel.app",
      bullets: [
        "Designed and deployed a voice concierge that keeps ride context (destination, trip length, passengers, mood): browser audio → ElevenLabs Scribe → context-aware response → ElevenLabs speech, on Vercel serverless functions.",
        "Supabase for auth, shared rides, and saved setups; provider keys kept server-side; Google Places/Routes recommendations integrated behind production credentials.",
      ],
    },
    {
      name: "AI voice receptionist, browser voice agent",
      link: "emmanuel-nanadoum.vercel.app/receptionist",
      bullets: [
        "Built a two-way voice receptionist that runs in the browser: Web Speech API for listening and speaking, Google Gemini for replies, plus a demo mode that runs a sample practice's front desk.",
        "Guardrails in the system prompt (discloses it is AI; no prices, results, or medical advice; never claims a booking), per-IP rate limiting, and automatic fallback across Gemini models.",
      ],
    },
  ],

  education: [
    "B.S. Cybersecurity & Information Assurance, WGU (in progress) · Software Engineering Training, TripleTen",
    "HubSpot Customer Success & Service Hub · Salesforce Trailhead · SQL Fundamentals · AWS / Cloud Fundamentals",
  ],
};
