import type { Tally } from "./site";

export type Demo = {
  slug: string;
  name: string;
  location: string;
  category: string;
  accent: string;
  accentInk: string;
  site: string;
  system?: string;
  status: { label: string; tally: Tally }[];
  solves: string;
  detail: string[];
  capabilities: string[];
  desktop: string;
  mobile: string;
  systemShot?: string;
};

export const demos: Demo[] = [
  {
    slug: "cactus",
    name: "Cactus Chiropractic",
    location: "Peoria, Arizona",
    category: "Chiropractic",
    accent: "#E47F19",
    accentInk: "#1F140B",
    site: "https://blair-demo-cactus.vercel.app",
    system: "https://blair-demo-cactus.vercel.app/revenue-system",
    status: [
      { label: "Website live", tally: "live" },
      { label: "AI receptionist live (browser)", tally: "live" },
      { label: "Dashboards use sample data", tally: "demo" },
    ],
    solves: "Every new-patient call and form is answered, tracked and followed up, from first ring to a booked visit.",
    detail: [
      "Talk to a live AI receptionist in your browser and ask what a new patient would ask.",
      "Submit a test patient form and see where it lands in the pipeline.",
      "Walk the full 13-step journey: confirmation, reminders, no-show follow-up, reviews and reactivation.",
    ],
    capabilities: ["AI voice receptionist", "CRM pipeline", "Online booking", "SMS + email confirmations", "Two-way reminders", "Review requests", "Reactivation", "Reporting"],
    desktop: "/shots/cactus-d.jpg",
    mobile: "/shots/cactus-m.jpg",
    systemShot: "/shots/cactus-rs-d.jpg",
  },
  {
    slug: "palmer-herman",
    name: "Palmer & Herman Chiropractic",
    location: "Naugatuck, Connecticut",
    category: "Chiropractic",
    accent: "#0E2D20",
    accentInk: "#FFFFFF",
    site: "https://blair-demo-palmer.vercel.app",
    system: "https://blair-demo-palmer.vercel.app/revenue-system",
    status: [
      { label: "Website live", tally: "live" },
      { label: "Simulator uses demo contacts", tally: "demo" },
      { label: "AI voice not yet activated", tally: "inactive" },
    ],
    solves: "Website requests, missed calls and unbooked leads flow into one 12-stage pipeline with respectful, automatic follow-up.",
    detail: [
      "Run the live simulator: website lead, missed call, reminders, no-show recovery, review request, reactivation.",
      "Read the exact messages patients would receive, written in the practice's voice.",
      "See what is active now and what is prepared for later, including the AI voice receptionist.",
    ],
    capabilities: ["Website lead capture", "Missed-call text-back", "12-stage pipeline", "Automated follow-up", "24h + 2h reminders", "No-show recovery", "Review requests", "Manual reactivation"],
    desktop: "/shots/palmer-d.jpg",
    mobile: "/shots/palmer-m.jpg",
    systemShot: "/shots/palmer-rs-d.jpg",
  },
  {
    slug: "canham",
    name: "Canham Chiropractic",
    location: "Phoenix, Arizona",
    category: "Chiropractic",
    accent: "#352C20",
    accentInk: "#FFFFFF",
    site: "https://blair-demo-canham.vercel.app",
    system: "https://blair-demo-canham.vercel.app/revenue-system",
    status: [
      { label: "Website live", tally: "live" },
      { label: "Owner presentation live", tally: "live" },
      { label: "Missed-call demo is simulated", tally: "demo" },
    ],
    solves: "An honest look at how patients find, contact and return to the practice, and one connected system from search to reactivation.",
    detail: [
      "Open the guided owner presentation and the Digital Revenue Leak Audit, built from public information only.",
      "Press simulate to watch a missed call become a recovered appointment opportunity.",
      "Meet the digital patient concierge, scoped to non-clinical questions and requests.",
    ],
    capabilities: ["Local search foundation", "Premium website", "Lead capture", "CRM", "Follow-up", "Reminders", "Reputation workflow", "Reactivation"],
    desktop: "/shots/canham-d.jpg",
    mobile: "/shots/canham-m.jpg",
    systemShot: "/shots/canham-rs-d.jpg",
  },
  {
    slug: "nelson",
    name: "Nelson Chiropractic",
    location: "Tempe, Arizona",
    category: "Chiropractic",
    accent: "#3F6F4A",
    accentInk: "#FFFFFF",
    site: "https://blair-demo-nelson.vercel.app",
    status: [{ label: "Website live", tally: "live" }],
    solves: "A clear, calm website that turns local searches into appointment requests and phone calls.",
    detail: [
      "Built around how patients actually describe the problem: neck and back discomfort, day to day.",
      "Every page leads to one of two actions: request an appointment or call.",
      "The same revenue-system layer shown for Cactus, Palmer & Herman and Canham is scoped per practice in discovery.",
    ],
    capabilities: ["Conversion-focused website", "Appointment requests", "Click-to-call", "Local directions", "Mobile-first layout"],
    desktop: "/shots/nelson-d.jpg",
    mobile: "/shots/nelson-m.jpg",
  },
  {
    slug: "coyote",
    name: "Coyote Chiropractic & Wellness Center",
    location: "Tempe, Arizona",
    category: "Chiropractic & wellness",
    accent: "#312A25",
    accentInk: "#FFFFFF",
    site: "https://blair-demo-coyote.vercel.app",
    status: [{ label: "Website live", tally: "live" }],
    solves: "A considered, unhurried website for chiropractic, injury care, massage and wellness, with a clear path to book.",
    detail: [
      "Service pages for chiropractic, auto-accident care, massage and wellness, each ending in a request or a call.",
      "A 'what to expect' path that answers first-visit questions before the phone rings.",
      "The revenue-system layer is scoped per practice in discovery.",
    ],
    capabilities: ["Multi-service website", "Appointment requests", "Click-to-call", "First-visit guidance", "Local directions"],
    desktop: "/shots/coyote-d.jpg",
    mobile: "/shots/coyote-m.jpg",
  },
  {
    slug: "blair-medspa",
    name: "Blair MedSpa",
    location: "Reference build",
    category: "Aesthetic medicine",
    accent: "#755832",
    accentInk: "#FFFFFF",
    site: "https://blair-demo-medspa.vercel.app",
    status: [
      { label: "Reference template live", tally: "live" },
      { label: "Contact details are template placeholders", tally: "demo" },
    ],
    solves: "An editorial med spa experience designed to move visitors from treatment interest to a booked consultation.",
    detail: [
      "Treatment pages for injectables, skin rejuvenation, laser, body contouring and medical skincare.",
      "Membership and results pages that support the consultation decision.",
      "Built as a multi-location template: address, phone and email are placeholders ({{location.*}}) that each deployment fills with the practice's own details.",
    ],
    capabilities: ["Editorial website", "Consultation booking", "Treatment pages", "Membership", "SMS terms + privacy pages"],
    desktop: "/shots/medspa-d.jpg",
    mobile: "/shots/medspa-m.jpg",
  },
];

export const getDemo = (slug: string) => demos.find((d) => d.slug === slug);
