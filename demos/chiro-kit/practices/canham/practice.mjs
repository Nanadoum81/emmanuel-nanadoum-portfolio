// Canham Chiropractic (Rosalind L. Canham, D.C.) — public-source facts only (researched 2026-10-01).
// Sources: NPPES NPI registry #1720157415 (address, phone, fax, taxonomy "Chiropractor, Rehabilitation", AZ lic. 6019,
// BCBS AZ + AZ Medicaid provider IDs), Dr. Canham's own bio at professionalonlineeducation.com/about (Cleveland
// Chiropractic College D.C.; M.S. NYCC 2016; private practice since 1998; CCCPC 2013; founder of Canham College 2002),
// Google Maps listing (5.0 from 1 review, unclaimed, no hours, no website), American Chiropractors directory (accessibility).
// See sales/canham/RESEARCH.md. OPEN ISSUE: a restaurant now operates at 2041 N 7th St — confirm the clinic address before outreach.
export default {
  slug: "canham",
  practiceKey: "canham", // profile id for the AI front desk (lib/practices.ts in the portfolio)
  name: "Canham Chiropractic",
  kind: "Chiropractic & Rehabilitation",
  legal: "Rosalind L. Canham, D.C.",
  monogram: "C",
  city: "Phoenix",
  state: "AZ",
  region: "Central Phoenix, Arizona",
  founded: 1998, // Dr. Canham's own bio: "starting her own private practice in 1998"
  phone: "(602) 255-0600",
  tel: "+16022550600",
  fax: "(602) 255-0601",
  address: { street: "2041 N 7th St", city: "Phoenix", state: "AZ", zip: "85006" },
  geo: { lat: 33.470887, lng: -112.064765 },
  timezone: "America/Phoenix",

  // Sonoran clay and saguaro-shade ink, warmed from the current demo's clay/sand accents; deliberately not Palmer's green/brass.
  theme: {
    bg: "#fbf6f0",
    surface: "#ffffff",
    sand: "#f3e8dc",
    sand2: "#e8d8c6",
    ink: "#2a1d17",
    ink2: "#5e4a3f",
    rule: "#e2d3c3",
    brand: "#9a4126",
    brandDeep: "#6e2c18",
    brandInk: "#ffffff",
    accent: "#b9822f",
    accentSoft: "#f4e3c8",
    display: "Young Serif",
    body: "Albert Sans",
    fontsHref: "https://fonts.googleapis.com/css2?family=Young+Serif&family=Albert+Sans:wght@400;500;600;700&display=swap",
    radius: "14px",
  },

  // No hours are published on Google (the listing shows "Add hours"). One aggregator (Birdeye) shows Mon–Fri 9–6,
  // but it is unconfirmed and conflicts with the empty Google field, so the kit shows "Call for current hours".
  hours: null,
  hoursNote: "Office hours are not published. Please call (602) 255-0600 to confirm a time.",

  heroPlace: "North 7th Street, Central Phoenix",
  tagline:
    "Canham Chiropractic: Dr. Rosalind L. Canham, D.C., chiropractic and rehabilitation in central Phoenix since 1998. Request a visit online or call (602) 255-0600.",

  hero: {
    title: "Chiropractic and rehab from the doctor who trains Arizona's chiropractic teams.",
    lede: "Dr. Rosalind Canham has been in private practice in Phoenix since 1998, is registered in chiropractic rehabilitation, and founded the board-approved chiropractic assistant program that has trained more than 12,000 CAs.",
    img: "hero",
    alt: "A clinician guiding a seated patient's shoulder through a range-of-motion check",
  },

  intro:
    "A one-doctor practice on North 7th Street, led by a chiropractor who has spent nearly four decades in chiropractic offices, from the front desk to the treatment room to the classroom.",

  homeFacts: [
    ["In private practice since", "1998"],
    ["Doctor of Chiropractic", "Cleveland Chiropractic College"],
    ["Registered specialty", "Chiropractor, rehabilitation (NPI)"],
    ["Google rating", "5.0 (1 review)"],
  ],

  doctorsTitle: "Dr. Rosalind L. Canham, D.C.",
  doctorsIntro:
    "Dr. Canham began in chiropractic as a chiropractic assistant and office manager before earning her Doctor of Chiropractic at Cleveland Chiropractic College and opening her own practice in 1998. She later earned an M.S. in Human Anatomy and Physiology Instruction from New York Chiropractic College, and has written more than 44 courses for chiropractors and their teams, including exercise rehab, manual medicine and therapeutic procedures.",

  conditions: [
    { title: "Back pain", text: "A common reason people call. Dr. Canham examines you before any treatment.", img: "low-back" },
    { title: "Neck and upper-back tension", text: "Posture and movement are assessed, not guessed at.", img: "neck" },
    { title: "Rebuilding after an injury", text: "Exercise rehab to restore strength and range of motion.", img: "shoulder-rehab" },
    { title: "Stiffness that limits daily life", text: "Manual therapy and guided movement to help you move more easily.", img: null },
    { title: "Not sure if chiropractic fits?", text: "Call and describe what's going on; the office will tell you honestly.", img: null },
  ],

  treatments: [
    { title: "Spinal adjustments", text: "Hands-on chiropractic adjustment by Dr. Canham." },
    { title: "Exercise rehabilitation", text: "Guided exercises to rebuild strength and movement, in the office and at home.", img: "rehab" },
    { title: "Manual medicine", text: "Hands-on soft-tissue and joint techniques alongside adjustments." },
    { title: "Therapeutic procedures", text: "In-office therapies chosen by the doctor for your situation. Ask what applies to you." },
  ],

  featured: {
    title: "Rehab is part of the care, not an afterthought",
    text: "Dr. Canham is registered in the national provider registry as a chiropractor specializing in rehabilitation, and she teaches exercise rehab and therapeutic procedures to other chiropractors. Care can include exercises that keep progress going between visits.",
    img: "stretch",
    alt: "A clinician guiding a patient's arm and knee through a movement exercise on a treatment table",
  },

  doctors: [
    {
      name: "Rosalind L. Canham, D.C.",
      short: "Dr. Canham",
      facts: [
        ["Degree", "Doctor of Chiropractic, Cleveland Chiropractic College"],
        ["Master's", "M.S., Human Anatomy and Physiology Instruction, New York Chiropractic College (2016)"],
        ["Registered as", "Chiropractor, rehabilitation (NPI 1720157415)"],
        ["Also", "Founder of Canham College (2002), a PACE-recognized chiropractic education provider"],
      ],
    },
  ],

  rating: { value: "5.0", count: 1, source: "Google" },
  reviews: [], // the single Google review has no readable text in public sources; none quoted

  firstVisit: [
    { title: "Request or call", text: "Pick a preferred time online or call (602) 255-0600. The office confirms by text or phone." },
    { title: "History and exam", text: "Dr. Canham reviews your history and examines you before any treatment." },
    { title: "A plan, explained", text: "If chiropractic care fits, she explains the plan, including any rehab exercises for home." },
  ],
  bring: ["Photo ID and your insurance card", "A list of current medications", "Any X-rays, MRI reports or notes from other doctors", "Clothes you can move and stretch in"],
  insurance:
    "Public registry records list Blue Cross Blue Shield of Arizona and Arizona Medicaid provider IDs for Dr. Canham. She does not participate in Medicare. Plans change, so call to confirm yours.",
  access: "Listed with a wheelchair-accessible entrance, parking and restroom.",

  faqs: [
    ["Who will I see?", "Dr. Rosalind L. Canham, D.C. She earned her Doctor of Chiropractic at Cleveland Chiropractic College and has been in private practice in Phoenix since 1998."],
    ["Do you take my insurance?", "Public registry records list Blue Cross Blue Shield of Arizona and Arizona Medicaid provider IDs. Dr. Canham does not participate in Medicare. Call (602) 255-0600 to confirm your plan."],
    ["What are your hours?", "Hours are not published. Please call (602) 255-0600 or request a time online and the office will confirm."],
    ["Is the office wheelchair accessible?", "The listing shows a wheelchair-accessible entrance, parking and restroom. Call if you need help getting in."],
    ["Can another doctor or attorney send records?", "Yes. Records can be faxed to (602) 255-0601."],
  ],

  photoNote: "Photography for this demo is licensed stock (Pexels); it is replaced with photographs of the practice at launch.",
};
