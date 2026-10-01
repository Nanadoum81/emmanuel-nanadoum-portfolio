import type { Tally } from "./site";

export type Shot = { src: string; alt: string; w: number; h: number; caption?: string };
export type Status = { label: string; tally: Tally; note: string };
export type Flow = { title: string; steps: { label: string; note?: string }[] };
export type Tradeoff = { choice: string; over: string; why: string };

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  kind: string;
  role: string;
  headline: string;
  summary: string;
  source: string;
  links: { label: string; href: string; primary?: boolean; event: string }[];
  cover: Shot;
  status: Status[];
  problem: string[];
  discovery: string[];
  requirements: string[];
  architecture: { intro: string; flows: Flow[] };
  demo: { intro: string; shots: Shot[] };
  technologies: string[];
  integrations: { from: string; to: string; note: string }[];
  tradeoffs: Tradeoff[];
  handoff: string[];
  demonstrates: string[];
  next: string;
};

const D = (src: string, alt: string, caption?: string): Shot => ({ src: `/shots/${src}.jpg`, alt, w: 2000, h: 1250, caption });

export const caseStudies: CaseStudy[] = [
  {
    slug: "vybe",
    title: "VYBE",
    client: "VYBE (Emmanuel's own product)",
    kind: "AI passenger experience platform",
    role: "Product discovery, requirements, solution architecture, build and demo",
    headline: "A ride that knows where it's going, who's in it, and what the car is in the mood for.",
    summary:
      "VYBE connects people × music × food × places × experiences around one shared ride context. The live site and VYBE Voice run on real APIs: ElevenLabs transcription and speech, Supabase for rides and saved VYBEs, and server-side functions that keep every provider key off the client.",
    source: "vybe-app-blue.vercel.app",
    links: [
      { label: "Try VYBE Voice", href: "https://vybe-app-blue.vercel.app/variation5/experience/", primary: true, event: "vybe_voice_click" },
      { label: "Full product site", href: "https://vybe-app-blue.vercel.app/variation5/", event: "vybe_site_click" },
    ],
    cover: D("vybe-d", "VYBE Variation 5 home page: night-driving city skyline with the headline More Than a Ride. It's a VYBE."),
    status: [
      { label: "Product site + VYBE Voice", tally: "live", note: "Deployed on Vercel, Variation 5 design locked." },
      { label: "ElevenLabs Scribe + TTS", tally: "live", note: "Reported connected by the production health endpoint." },
      { label: "Supabase", tally: "live", note: "Auth, rides, participants, saved VYBEs." },
      { label: "Google Places / Routes + generative model", tally: "inactive", note: "Wired server-side, awaiting production credentials. Route-aware generation is off in production." },
    ],
    problem: [
      "Passengers bounce between maps, music apps, restaurant searches and group chats. None of those tools know the ride: where the car is going, how long it takes, who is in it, or the mood.",
      "The result is a trip spent negotiating apps instead of sharing an experience, and suggestions that don't fit the time or place.",
    ],
    discovery: [
      "What decisions do people actually make in a car? Four keep recurring: what to hear, what to eat, what to see, what to do.",
      "What context changes the right answer? Destination, trip length, number of passengers and mood. Those became the ride's first-class inputs.",
      "Who owns the ride? A shared ride has to reflect the group, not whichever phone opened the app.",
    ],
    requirements: [
      "Ride context model: destination, trip length (15 min / 30–60 min / 1–3 hr / 3 hr+), passengers (1–4), mood (Hype, Chill, Romantic, Hungry, Explore, Surprise me).",
      "Shared rides: compact join codes and a QR flow so everyone connects to the same destination, mood and recommendations.",
      "Saved VYBEs so signed-in users can save and restore a ride setup.",
      "Voice that keeps the ride context across turns, with a typed fallback everywhere.",
      "Provider secrets server-side only; shared-ride membership through authenticated calls.",
      "Recommendations grounded in real provider results, never invented venues.",
    ],
    architecture: {
      intro:
        "A Vite + vanilla JavaScript front end carries the locked Variation 5 design. Vercel Functions sit between the browser and every provider, and Supabase holds identity and ride state.",
      flows: [
        {
          title: "VYBE Voice: live path",
          steps: [
            { label: "Microphone", note: "Browser MediaRecorder captures the request" },
            { label: "/api/voice-stt", note: "ElevenLabs Scribe transcription (Web Speech API fallback)" },
            { label: "/api/voice-live", note: "Transcript + ride context + recent turns" },
            { label: "Product action", note: "Food, music, stops, mood, group activity" },
            { label: "/api/voice-tts", note: "ElevenLabs speaks the response" },
          ],
        },
        {
          title: "Ride generation: credential-gated",
          steps: [
            { label: "Origin + destination" },
            { label: "Google Places (New)", note: "Resolve the destination" },
            { label: "Google Routes", note: "Compute route and duration" },
            { label: "Model ranking", note: "AI Gateway or OpenAI" },
            { label: "Supabase", note: "Store recommendations + saved VYBEs" },
          ],
        },
      ],
    },
    demo: {
      intro: "Set destination, trip length, crew and mood once, then talk. The same context stays with the conversation.",
      shots: [
        D("vybe-voice-panel", "VYBE Voice ride-context controls: destination, trip length, people and mood selectors above the voice orb.", "Ride context set once: destination, trip, people, mood."),
        D("vybe-voice-console", "VYBE Voice console with a Talk to VYBE button and prompt suggestions.", "The console notes that microphone audio is transcribed with ElevenLabs Scribe."),
        D("vybe-voice-d", "VYBE Voice landing: A concierge that already knows the ride.", "VYBE Voice landing inside the Variation 5 world."),
      ],
    },
    technologies: ["Vite", "JavaScript", "Vercel Functions", "Supabase", "ElevenLabs Scribe", "ElevenLabs TTS", "Web Speech API", "Google Places / Routes (gated)", "AI Gateway / OpenAI (gated)"],
    integrations: [
      { from: "Browser", to: "/api/voice-stt → ElevenLabs Scribe", note: "Base64 audio in, transcript out" },
      { from: "Browser", to: "/api/voice-live", note: "Message, last turns, ride context" },
      { from: "/api/voice-tts", to: "ElevenLabs", note: "Speech for the response" },
      { from: "/api/rides/join", to: "Supabase", note: "Authenticated shared-ride membership" },
      { from: "/api/health", to: "All providers", note: "Reports which services are configured" },
    ],
    tradeoffs: [
      { choice: "Grounded recommendations only", over: "Model-invented venues", why: "A wrong restaurant in a moving car costs trust. Generation stays off in production until real Places/Routes data backs it." },
      { choice: "Server-side functions for every provider", over: "Client SDKs", why: "Keys never reach the browser, and a health endpoint can report exactly what is connected." },
      { choice: "Scribe with a browser speech fallback", over: "One transcription path", why: "Higher accuracy where recording works; the demo still answers where it doesn't." },
      { choice: "Vanilla JS for the launch surface", over: "A heavier framework", why: "Full control of the locked Variation 5 visuals and a fast load; the cost is more hand-built state." },
    ],
    handoff: [
      "Release gates and mobile QA are written down in the repository, so the next build ships against the same checks.",
      "A health endpoint turns 'is it working?' into a one-line answer for anyone supporting the product.",
      "Mobile requirements (Expo / React Native, Spotify, VYBE+ subscriptions) are scoped as next phases, not presented as shipped.",
    ],
    demonstrates: [
      "Takes a fuzzy product idea through discovery to a requirements model a team can build against.",
      "Designs and ships real API integrations (speech in, reasoning, speech out) with keys kept server-side.",
      "Separates what is live from what is architected, and says so in the product itself.",
    ],
    next: "cactus",
  },
  {
    slug: "cactus",
    title: "Cactus Chiropractic",
    client: "Cactus Chiropractic, Peoria, AZ (prospect demo)",
    kind: "AI patient acquisition system (sales demo)",
    role: "Discovery, solution mapping, workflow architecture, live demo build",
    headline: "From the first ring to a booked visit, on the practice's own brand.",
    summary:
      "A two-layer demo: a patient website in Cactus's own identity, and a revenue-system page where the owner can talk to a live AI receptionist, submit a test patient form, and walk every stage of a connected patient journey.",
    source: "blair-demo-cactus.vercel.app",
    links: [
      { label: "Open revenue system", href: "https://blair-demo-cactus.vercel.app/revenue-system", primary: true, event: "demo_open_cactus_rs" },
      { label: "Patient website", href: "https://blair-demo-cactus.vercel.app", event: "demo_open_cactus" },
      { label: "Talk to the AI receptionist", href: "/receptionist?demo=1", event: "receptionist_open" },
    ],
    cover: D("cactus-rs-d", "Cactus Chiropractic revenue system page: The Chiropractor Revenue System with a talk-to-the-AI-receptionist panel."),
    status: [
      { label: "Patient website", tally: "live", note: "Published demo in the practice's brand." },
      { label: "AI receptionist", tally: "live", note: "Two-way voice conversation in the browser at /receptionist; the original phone demo line has been retired." },
      { label: "Pipeline, counts and reporting", tally: "demo", note: "Illustrative sample data, labeled on the page. No patient information." },
    ],
    problem: [
      "Small practices run the phones, the front desk and follow-up with the same two or three people. The moments that break are predictable: a call rings out during an adjustment, a web form waits until tomorrow, a no-show never hears back.",
      "The owner rarely sees where inquiries stall, because nothing connects the phone, the website, the calendar and follow-up into one record.",
    ],
    discovery: [
      "Start from the practice's positioning (gentle, unhurried care) so automation reads as attentiveness, not a call center.",
      "Map every way a new patient arrives (phone, web form) and every hand-off after it.",
      "Hard constraint: the demo must never touch the practice's public line or any real patient data.",
    ],
    requirements: [
      "Answer new-patient calls in real time with a two-way AI voice agent.",
      "Turn every call and form into a tracked contact with its source.",
      "Move each opportunity through a pipeline to a booked appointment.",
      "Automatic SMS + email confirmations and two-way SMS reminders.",
      "Log show / no-show and trigger follow-up, review requests and reactivation.",
      "Report every step, with sample data clearly labeled as sample data.",
    ],
    architecture: {
      intro: "One connected patient journey. A single prospect flows through every module without manual re-entry.",
      flows: [
        {
          title: "Patient journey in 13 steps",
          steps: [
            { label: "Call / web inquiry" },
            { label: "AI or instant SMS response" },
            { label: "Contact created" },
            { label: "CRM record" },
            { label: "Pipeline" },
            { label: "Appointment" },
            { label: "SMS + email confirmation" },
            { label: "Reminders" },
            { label: "Show / no-show" },
            { label: "Follow-up" },
            { label: "Review request" },
            { label: "Reactivation" },
            { label: "Reporting" },
          ],
        },
      ],
    },
    demo: {
      intro: "The prospect talks to the AI receptionist, pretends to be a new patient, then watches the journey that conversation would start.",
      shots: [
        D("cactus-d", "Cactus Chiropractic patient website hero: Gentle care. Time to listen.", "Patient-facing site in Cactus's own identity."),
        D("cactus-rs-journey", "Cactus revenue system: One connected patient journey, a grid of 13 journey steps.", "Every step is visible, so the demo sells the whole path."),
      ],
    },
    technologies: ["AI voice agent", "GoHighLevel CRM", "CRM pipeline", "Two-way SMS", "Email automation", "Web forms", "Reporting"],
    integrations: [
      { from: "Demo phone line", to: "AI voice agent", note: "Separate from the public practice line" },
      { from: "Website form", to: "CRM contact + opportunity", note: "Source recorded on creation" },
      { from: "Calendar", to: "Confirmations + reminders", note: "SMS and email on booking" },
      { from: "Appointment status", to: "Follow-up, review, reactivation", note: "Outcome drives the next workflow" },
    ],
    tradeoffs: [
      { choice: "A separate demo channel", over: "Forwarding the practice's real line", why: "The public line and real patients stay untouched; the owner still hears the real agent. It now runs in the browser, so no phone number is needed." },
      { choice: "Live voice agent", over: "A recorded sample call", why: "Harder to build, but it proves the product instead of describing it." },
      { choice: "Labeled sample data", over: "Plausible-looking results", why: "A fabricated number would be the first thing a sharp owner questions." },
      { choice: "One connected journey", over: "Separate point tools", why: "The value is in the hand-offs, so the demo shows the hand-offs." },
    ],
    handoff: [
      "Go-live scope if the practice moves forward: decide on number forwarding, connect the calendar, approve every message in the practice's voice, and set staff notifications.",
      "Train the front desk on the pipeline, then review reporting after the first weeks and tune follow-up timing.",
    ],
    demonstrates: [
      "Runs a sales demo on the prospect's own business instead of a generic slide.",
      "Designs an end-to-end workflow and makes each integration point visible.",
      "Builds trust by labeling exactly what is live and what is sample data.",
    ],
    next: "palmer-herman",
  },
  {
    slug: "palmer-herman",
    title: "Palmer & Herman Chiropractic",
    client: "Palmer & Herman Chiropractic, Naugatuck, CT (prospect demo)",
    kind: "Reusable solution architecture",
    role: "Discovery, routing design, workflow logic, rollout boundaries",
    headline: "Reuse the system logic. Never reuse the client.",
    summary:
      "The same patient-acquisition logic as Cactus, rebuilt around a two-doctor practice in Connecticut: its own pipeline stages, tags, message copy and phone number, and its own rollout plan for what goes live now and what waits.",
    source: "blair-demo-palmer.vercel.app",
    links: [
      { label: "Open revenue system", href: "https://blair-demo-palmer.vercel.app/revenue-system", primary: true, event: "demo_open_palmer_rs" },
      { label: "Patient website", href: "https://blair-demo-palmer.vercel.app", event: "demo_open_palmer" },
    ],
    cover: D("palmer-rs-d", "Palmer & Herman revenue system: Turn more inquiries into booked patient conversations."),
    status: [
      { label: "Patient website + revenue system", tally: "live", note: "Published demo in the practice's brand." },
      { label: "Live automation simulator", tally: "demo", note: "Runs demo contacts through the pipeline. No real patient records." },
      { label: "AI voice receptionist", tally: "inactive", note: "Designed and scripted, deliberately not activated." },
    ],
    problem: [
      "A second practice in the same category is where templates go wrong. Copy the first build and every client gets the same stages, the same messages, the same modules, whether they fit or not.",
      "Palmer & Herman is two doctors, a different state and a different phone, and it needs its own launch plan.",
    ],
    discovery: [
      "Separate what is structurally the same (how a lead becomes a patient) from what is specific (voice, stages, contact points, readiness).",
      "Decide what should go live first. The demo stages the rollout: capture, recovery, reminders and reviews now; AI voice later; reactivation only when staff choose to run it. A real engagement would confirm this in discovery.",
    ],
    requirements: [
      "Every website request lands in the CRM as a tagged lead with a pipeline opportunity.",
      "Missed calls get an automatic text-back after about a minute.",
      "A 12-stage pipeline from New Lead to Completed, Reactivation or Lost.",
      "Follow-up that stops the moment a lead books, replies, opts out or is marked lost.",
      "Reminders 24 hours and 2 hours before each visit with time, address and phone.",
      "Ungated review requests after completed visits. No incentives, no gating.",
    ],
    architecture: {
      intro: "Eleven connected components share one pipeline. Routing is explicit, so every stage change has a reason.",
      flows: [
        {
          title: "Website lead → confirmation",
          steps: [
            { label: "Form submitted" },
            { label: "Contact tagged ph-website-lead" },
            { label: "Stage: Appointment Requested" },
            { label: "Office notified" },
            { label: "Confirmation text + email" },
            { label: "Task if not booked" },
          ],
        },
        {
          title: "Missed call → conversation",
          steps: [
            { label: "Call missed" },
            { label: "Wait ~1 minute" },
            { label: "Text-back in the practice's voice" },
            { label: "Reply → Conversation Started" },
            { label: "Office notified" },
          ],
        },
      ],
    },
    demo: {
      intro: "The owner picks a scenario and watches a demo contact move through tags, messages, tasks and stage changes.",
      shots: [
        D("palmer-rs-pipeline", "Palmer & Herman 12-stage patient pipeline from New Lead to Lost / Not Interested.", "Twelve named stages, colour-coded by state."),
        D("palmer-rs-workflows", "Palmer & Herman automation logic by example: website lead, missed call, follow-up and reminder workflows.", "The actual message copy the practice would approve."),
        D("palmer-rs-sim", "Palmer & Herman live simulator: pick a scenario and run an automation end to end.", "The simulator runs demo contacts, never real records."),
        D("palmer-d", "Palmer & Herman patient website hero in deep green: Gentle care. Time to listen.", "Patient site: shared skeleton, the practice's own brand."),
      ],
    },
    technologies: ["CRM pipeline + tags", "Web form capture", "Missed-call text-back", "SMS + email sequences", "Task automation", "Review requests", "Automation simulator"],
    integrations: [
      { from: "Website form", to: "CRM", note: "Tag ph-website-lead + opportunity" },
      { from: "Phone system", to: "Missed-call workflow", note: "Text-back after ~1 minute" },
      { from: "Pipeline stage", to: "Messages + tasks", note: "Stage changes trigger the next step" },
      { from: "Appointment status", to: "No-show recovery / review", note: "No Show, Cancelled, Completed" },
    ],
    tradeoffs: [
      { choice: "Reuse at the logic layer", over: "Reuse at the brand layer", why: "Capture → conversation → schedule → remind → review is universal. Stage names, tags, copy and modules are not." },
      { choice: "Voice receptionist off at launch", over: "Shipping every module", why: "A staged rollout keeps the first launch simple and protects the patient experience." },
      { choice: "Manual reactivation", over: "Automatic win-back blasts", why: "Staff choose who hears from the practice after a long gap." },
      { choice: "Shared site skeleton", over: "A new layout per practice", why: "Both practices sell unhurried care, so structure is reused on purpose; identity, doctors, services and contacts are theirs." },
    ],
    handoff: [
      "Implementation boundaries are written into the demo: what is active, what is manual, what is future.",
      "Voice receptionist guardrails are defined before activation: no diagnoses, no medical advice, medical questions escalate to staff.",
      "Every message template carries the practice's own name and number, ready for approval.",
    ],
    demonstrates: [
      "Builds reusable solution architecture without flattening clients into one template.",
      "Designs explicit routing and stop conditions, the part that decides whether automation feels respectful.",
      "Scopes a rollout around the customer's readiness, not the product's feature list.",
    ],
    next: "blair-revenue-systems",
  },
  {
    slug: "blair-revenue-systems",
    title: "Blair Digital Studios",
    client: "Blair Digital Studios (Emmanuel's consulting practice)",
    kind: "Revenue systems for small practices",
    role: "Principal consultant, discovery through implementation",
    headline: "Not “I make websites.” I find where revenue leaks and design the system that closes it.",
    summary:
      "Blair Digital Studios is Emmanuel's consulting practice. Each engagement starts with an honest audit of how a practice is found, contacted and followed up with, then connects website, AI voice, CRM, booking, follow-up and reputation into one system.",
    source: "blair-demo-canham.vercel.app",
    links: [
      { label: "Open Canham growth system", href: "https://blair-demo-canham.vercel.app/revenue-system", primary: true, event: "demo_open_canham_rs" },
      { label: "Client solution lab", href: "/solutions", event: "solution_lab_click" },
    ],
    cover: D("canham-rs-d", "Canham Chiropractic owner experience: Your digital front door is only the beginning."),
    status: [
      { label: "Canham owner presentation + audit", tally: "live", note: "Guided presentation built on public information only." },
      { label: "Missed-call recovery simulation", tally: "demo", note: "Animated demonstration. No message is sent." },
      { label: "Six live prospect demos and reference builds", tally: "live", note: "Built for five prospective chiropractic clients, plus a med spa template." },
    ],
    problem: [
      "Small practices lose opportunities between systems: a search that finds thin information, a call nobody answers, a form nobody follows up, a happy patient never asked for a review.",
      "Most vendors sell one piece (a website, a phone tool, a CRM) and leave the owner to connect them.",
    ],
    discovery: [
      "A Digital Revenue Leak Audit built only from publicly observable information, stating that private systems were not accessed.",
      "Every finding is labeled as verified publicly, an opportunity to investigate, or a proposed solution. For example, missed calls are an operational opportunity that requires client confirmation, not an accusation.",
    ],
    requirements: [
      "An owned, fast, mobile-first website with clear calls to action.",
      "Lead capture from every channel into one CRM pipeline.",
      "AI voice or receptionist coverage, missed-call recovery and qualification.",
      "Booking, confirmations and reminders that protect the calendar.",
      "Approved SMS / email nurture, review requests and reactivation.",
      "Reporting the owner can read without a consultant in the room.",
    ],
    architecture: {
      intro: "Eleven stages from search to reactivation. Each one explains what happens, why it matters and what Blair implements.",
      flows: [
        {
          title: "Connected growth system",
          steps: [
            { label: "Local search" },
            { label: "Premium website" },
            { label: "Call / request" },
            { label: "Lead capture" },
            { label: "CRM" },
            { label: "Follow-up" },
            { label: "Appointment" },
            { label: "Reminders" },
            { label: "Visit" },
            { label: "Reputation" },
            { label: "Reactivation" },
          ],
        },
      ],
    },
    demo: {
      intro: "The owner sees their own practice audited honestly, then watches a missed call become a recovered opportunity.",
      shots: [
        D("canham-rs-audit", "Canham Digital Revenue Leak Audit: Limited owned digital presence, labeled as an opportunity to investigate.", "Findings are labeled: verified, to investigate, or proposed."),
        D("canham-rs-journey", "Canham connected system: one journey from search to reactivation, stage by stage.", "What happens, why it matters, what Blair implements."),
        D("canham-rs-missed", "Canham missed-call recovery simulation with a phone mockup and a recovery sequence.", "Simulated end to end; no message is actually sent."),
      ],
    },
    technologies: ["GoHighLevel", "Twilio voice / SMS", "AI voice workflows", "REST APIs", "Webhooks", "Supabase", "HubSpot / Salesforce familiarity", "Modern web stack"],
    integrations: [
      { from: "Website + phone", to: "CRM pipeline", note: "Every channel feeds one system" },
      { from: "Missed call", to: "Approved text-back", note: "Staff notified on reply" },
      { from: "Calendar", to: "Reminders", note: "Protects the schedule" },
      { from: "Completed visit", to: "Review request", note: "Timed, never gated" },
    ],
    tradeoffs: [
      { choice: "Public-information audit", over: "Guessing at internal problems", why: "Credibility comes from not overstating. The owner confirms what the audit can't see." },
      { choice: "Connected system", over: "Best-of-breed point tools", why: "Leaks happen in the hand-offs, so one pipeline owns every hand-off." },
      { choice: "Non-clinical AI scope", over: "An assistant that answers everything", why: "The concierge handles hours, location, FAQs and requests; clinical questions go to people." },
    ],
    handoff: [
      "Scope, message approval, configuration, testing, launch, staff training and post-launch tuning are owned end to end.",
      "Documentation and a plain-language walkthrough so the practice runs the system without depending on its builder.",
    ],
    demonstrates: [
      "Consultative discovery that finds the business problem before proposing technology.",
      "Solution architecture across web, voice, CRM, SMS, APIs and webhooks.",
      "Honest selling: labeling assumptions is part of the pitch, not a disclaimer.",
    ],
    next: "vybe",
  },
];

export const getCase = (slug: string) => caseStudies.find((c) => c.slug === slug);
