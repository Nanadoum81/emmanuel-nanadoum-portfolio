export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://emmanuel-nanadoum.vercel.app";

export const person = {
  name: "Emmanuel Nanadoum",
  role: "AI Consultant / Solutions Engineer",
  roles: ["AI Consultant", "Solutions Engineer", "Sales Engineer"],
  focus: "AI, CRM & Automation",
  location: "Phoenix, Arizona",
  availability: "Remote / Hybrid",
  email: "nanadoum81@gmail.com",
  phone: "602-810-1271",
  phoneHref: "tel:+16028101271",
  linkedin: "https://www.linkedin.com/in/emmanuel-nanadoum-7971b7a8",
  resume: "/Emmanuel_Nanadoum_Sales_Engineer_Resume.pdf",
  summary:
    "Customer-facing technical and sales professional with 8+ years of consultative selling and 4+ years designing CRM, automation, web, and AI-enabled solutions.",
};

export const mailto = (subject = "Role conversation") =>
  `mailto:${person.email}?subject=${encodeURIComponent(subject)}`;

export type Tally = "live" | "demo" | "inactive" | "preview";

export const tallyLabel: Record<Tally, string> = {
  live: "Live",
  demo: "Demo data",
  inactive: "Not activated",
  preview: "Preview",
};

/** The seven-step motion Emmanuel runs on every engagement. */
export const runSheet = [
  {
    step: "Discovery",
    line: "Find the real problem behind the request.",
    detail:
      "Consultative questioning with owners and operators: where leads come from, where they stall, what the team already uses, what a win looks like.",
  },
  {
    step: "Requirements",
    line: "Turn pain into something buildable.",
    detail:
      "Business goals mapped to functional requirements, integration needs, data ownership, and constraints, written down so everyone agrees on scope.",
  },
  {
    step: "Solution architecture",
    line: "Design the connected system, not a feature.",
    detail:
      "Workflow diagrams and integration maps across CRM, voice, SMS, web, APIs and webhooks, with the tradeoffs named before anything is built.",
  },
  {
    step: "Demo / POC",
    line: "Show it working on the customer's own business.",
    detail:
      "A live proof of concept built around the prospect's name, services and journey, so the conversation is about their system, not a slide.",
  },
  {
    step: "Technical validation",
    line: "Prove it holds up.",
    detail:
      "Test calls, test forms, simulated pipeline runs, provider health checks and honest labels on anything that is sample data or not yet activated.",
  },
  {
    step: "Implementation",
    line: "Carry the design into production.",
    detail:
      "Configuration, testing, launch, troubleshooting and post-launch tuning, coordinating technical and non-technical stakeholders.",
  },
  {
    step: "Enablement",
    line: "Hand it over so it keeps working.",
    detail:
      "Training, documentation and clear ownership, so the practice or team runs the system without depending on the person who built it.",
  },
] as const;

export const capabilities = [
  {
    group: "Pre-sales & discovery",
    items: ["Consultative discovery", "Needs analysis", "Solution mapping", "Technical demos", "POCs", "Objection handling", "Value articulation", "Proposal support"],
  },
  {
    group: "Solution design",
    items: ["Workflow architecture", "Integration maps", "Implementation planning", "Technical documentation", "Stakeholder communication", "Presentations"],
  },
  {
    group: "Technical foundations",
    items: ["REST APIs", "Webhooks", "SQL", "Python", "HTML / CSS / JavaScript", "Supabase", "AWS fundamentals", "Troubleshooting"],
  },
  {
    group: "Platforms",
    items: ["GoHighLevel", "HubSpot", "Salesforce", "Twilio voice / SMS", "ElevenLabs", "Vercel", "Jira", "Git / GitHub"],
  },
] as const;

/** Patch bay: what each build actually connects. Only integrations verified in the live builds. */
export const patchBay = [
  { source: "VYBE Voice", targets: ["ElevenLabs Scribe", "ElevenLabs TTS", "Supabase", "Vercel Functions"] },
  { source: "Cactus revenue system", targets: ["AI voice line", "LeadConnector booking", "CRM pipeline", "SMS + email"] },
  { source: "Palmer & Herman system", targets: ["Web form → CRM", "Missed-call text-back", "12-stage pipeline", "Review requests"] },
  { source: "Canham growth system", targets: ["Local search", "Lead capture", "Follow-up", "Reputation workflow"] },
] as const;

export const experience = [
  {
    role: "Principal Consultant — CRM, AI Automation & Technical Solutions",
    org: "Blair Digital Studios",
    where: "Remote",
    when: "2020 – Present",
    points: [
      "Lead customer discovery and requirements conversations, identify operational pain points, and map business goals to practical CRM, automation, web and AI-enabled solutions.",
      "Build and present proof-of-concept solutions using GoHighLevel, Twilio voice/SMS, AI voice workflows, REST APIs, webhooks, Supabase and modern web tools.",
      "Translate technical capabilities into customer-facing value through solution diagrams, scopes, proposals, implementation plans and clear explanations of integrations and tradeoffs.",
      "Own the handoff from solution design into configuration, testing, launch, training, troubleshooting and post-launch optimization.",
    ],
  },
  {
    role: "Online Experience Advisor",
    org: "DriveTime Automotive",
    where: "Tempe, AZ",
    when: "Jul 2026 – Sep 2026",
    points: [
      "Guided customers through complex digital vehicle, financing and documentation workflows using consultative discovery and clear product explanations.",
      "Resolved objections and account issues and coordinated escalations when technical or operational support was needed, with accurate CRM and case documentation.",
    ],
  },
  {
    role: "Sales Representative",
    org: "A Better Way Wholesale Autos",
    where: "Naugatuck, CT",
    when: "Sep 2017 – 2025",
    points: [
      "Managed a high-volume, high-ticket pipeline from discovery through close, matching customer needs to vehicle and financing options.",
      "Delivered product presentations, handled objections, and coordinated finance, service and operations to remove barriers to purchase; consistently ranked among top performers.",
    ],
  },
] as const;

export const education = [
  "B.S. Cybersecurity & Information Assurance — Western Governors University (in progress)",
  "Software Engineering Training — TripleTen",
  "HubSpot Customer Success & Service Hub · Salesforce Trailhead · SQL fundamentals · AWS / cloud fundamentals",
] as const;
