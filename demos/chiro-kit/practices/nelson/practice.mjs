// Nelson Chiropractic, Tempe AZ — public-source facts only (researched 2026-10-01). See sales/nelson/RESEARCH.md.
// Sources: Google Maps listing (4.9 from 16 reviews, hours, address, phone; listing unclaimed, no website),
// Birdeye mirror of Google reviews (named reviewers), WebMD (Los Angeles College of Chiropractic, 1983),
// NPI 1205909645 (Donald Lee Nelson, chiropractor), City of Tempe History Museum sign records
// ("Accident Chiropractic, Dr. Don Nelson, D.C.", 5125 S Rural Rd, photographed 8/17/1995),
// American Chiropractors directory (wheelchair access), Healthgrades (practice + group listings).
export default {
  slug: "nelson",
  practiceKey: "nelson", // profile id for the AI front desk (lib/practices.ts in the portfolio)
  name: "Nelson",
  kind: "Chiropractic",
  legal: "Nelson Chiropractic",
  monogram: "N",
  city: "Tempe",
  state: "AZ",
  region: "Tempe, Arizona",
  // Earliest public record of Dr. Nelson's practice on Rural Road (City of Tempe sign photo, 8/17/1995).
  // He may have practiced there earlier; confirm with the doctor before launch.
  founded: 1995,
  phone: "(480) 966-1635",
  tel: "+14809661635",
  address: { street: "2409 S Rural Rd, Suite D", city: "Tempe", state: "AZ", zip: "85282" },
  geo: { lat: 33.4026101, lng: -111.9259369 },
  timezone: "America/Phoenix",

  // Desert adobe and sage: the sage + terracotta + cream of their current demo, with the clay promoted to the lead.
  theme: {
    bg: "#fbf6ef",
    surface: "#ffffff",
    sand: "#f4eadc",
    sand2: "#ead9c3",
    ink: "#2a1f1a",
    ink2: "#5c4a40",
    rule: "#e2d2bd",
    brand: "#9a4a2b",
    brandDeep: "#6e3119",
    brandInk: "#ffffff",
    accent: "#4f6b52",
    accentSoft: "#e3eadf",
    display: "Young Serif",
    body: "Public Sans",
    fontsHref: "https://fonts.googleapis.com/css2?family=Young+Serif&family=Public+Sans:wght@400;500;600;700&display=swap",
    radius: "14px",
  },

  // minutes after midnight; 0 = Sunday. As listed on Google (read 2026-10-01) — always "call to confirm".
  hours: {
    0: [],
    1: [[420, 1080]],
    2: [[420, 1080]],
    3: [[420, 1080]],
    4: [[420, 1080]],
    5: [[420, 1080]],
    6: [[420, 780]],
  },
  hoursNote: "Hours as listed on Google. Please call to confirm before your visit.",

  hero: {
    title: "Hands-on chiropractic in Tempe, from 7\u00a0a.m. on weekdays.",
    lede: "Dr. Donald L. Nelson has been a Doctor of Chiropractic since 1983. Back pain, neck pain, lifting strains and care after a car accident, on South Rural Road.",
    img: "hero",
    alt: "A chiropractor adjusting a seated patient's shoulder in a treatment room",
  },

  heroPlace: "2409 S Rural Rd, Suite D · Tempe, Arizona",
  tagline: "Nelson Chiropractic in Tempe, Arizona: Dr. Donald L. Nelson, D.C. Open weekdays from 7 a.m. and Saturday mornings. Book online or call (480) 966-1635.",
  homeFacts: [["Doctor of Chiropractic", "Since 1983"], ["On Rural Road", "Since at least 1995"], ["Google rating", "4.9 from 16 reviews"], ["Saturdays", "Open 7 a.m. to 1 p.m."]],
  doctorsHomeTitle: "Meet Dr. Nelson",
  doctorsTitle: "Dr. Donald L. Nelson, D.C.",
  doctorsIntro:
    "Dr. Donald L. Nelson earned his Doctor of Chiropractic at Los Angeles College of Chiropractic in 1983 and has practiced on South Rural Road in Tempe since at least the mid-1990s. Patients describe him as thorough, clear about what's wrong and how it happened, and happy to sit and talk.",
  intro: "One doctor of chiropractic on Rural Road, rated 4.9 by patients on Google.",

  conditions: [
    { title: "Low back pain", text: "Examined and treated hands-on by Dr. Nelson, including back trouble other care hasn't settled.", img: "low-back" },
    { title: "Neck pain", text: "Including the stiff, painful neck you wake up with one morning.", img: "neck" },
    { title: "After a car accident", text: "His Rural Road office was once signed Accident Chiropractic. Patients still come to him after collisions.", img: "accident" },
    { title: "Lifting and training strains", text: "A reviewer who competes in heavy lifting praises his knowledge of muscle groups and joints.", img: "lifting" },
    { title: "Disc and nerve symptoms", text: "Shoulder, arm and hand symptoms that start in the neck. Dr. Nelson can order an MRI when it's warranted.", img: null },
    { title: "Headaches and chronic pain", text: "Listed on WebMD among the conditions he treats most often.", img: null },
  ],

  treatments: [
    { title: "Chiropractic adjustments", text: "Hands-on spinal manipulation by Dr. Nelson." },
    { title: "A clear diagnosis first", text: "Patients say he tells you what's wrong and explains how it happened." },
    { title: "Physical therapy and soft-tissue work", text: "Listed for the practice on WebMD and Healthgrades. Ask which applies to you." },
    { title: "Imaging when it's needed", text: "If something needs a closer look, Dr. Nelson can order an MRI." },
  ],
  treatImg: { name: "soft-tissue", alt: "A clinician working on a patient's shoulder and back on a treatment table" },

  featured: {
    title: "After a car accident, a doctor who has done this for decades",
    text: "In the 1990s, Dr. Nelson's office on Rural Road carried the name Accident Chiropractic. Patients who come to him after a collision describe him as knowledgeable, patient and an advocate. Call first to talk through your situation and what paperwork to bring.",
    img: "driving",
    alt: "Hands on the steering wheel of a car",
  },

  doctors: [
    {
      name: "Donald L. Nelson, D.C.",
      short: "Dr. Nelson",
      facts: [
        ["Degree", "Doctor of Chiropractic, Los Angeles College of Chiropractic, 1983"],
        ["In Tempe", "On South Rural Road since at least 1995"],
        ["Patients mention", "Back and neck pain, disc symptoms, lifting strains and car accidents"],
      ],
      quote: {
        text: "I've gone to Dr. Nelson's twice now for two separate car accidents, and it has always been a wonderful experience. He is very knowledgeable, patient, helpful and kind.",
        by: "Grace C., Google review",
      },
    },
  ],

  rating: { value: "4.9", count: 16, source: "Google" },
  reviews: [
    { text: "Doctor Nelson is the best! He was the ONLY doctor helping me after being left in pain and ignored by others.", by: "Tristan A." },
    { text: "I've gone to Dr. Nelson's twice now for two separate car accidents, and it has always been a wonderful experience. He is very knowledgeable, patient, helpful and kind.", by: "Grace C.", meta: "Local Guide" },
    { text: "Dr Nelson is a terrific chiropractor. He's also very personable and friendly and will sit and chat with you.", by: "Jose J." },
    { text: "The best doctor in town. Always so loving and caring.", by: "Jennifer M." },
  ],

  firstVisit: [
    { title: "Book or call", text: "Pick a time online or call the office. You'll get a text confirming your request." },
    { title: "Dr. Nelson examines you", text: "He takes your history, examines you before any treatment, and tells you plainly what he finds." },
    { title: "A plan, and imaging if needed", text: "If chiropractic care fits, he explains the plan. If something needs a closer look, he can order an MRI." },
  ],
  bring: [
    "Photo ID and your insurance card",
    "After a collision: the claim number and your auto insurer's details",
    "Any X-rays, MRI reports or notes from other doctors",
    "Comfortable clothes you can move in",
  ],
  insurance: "Aetna is listed for Dr. Nelson on WebMD. Plans and auto-claim coverage vary, so call (480) 966-1635 to confirm yours before your visit.",
  access: "Wheelchair-accessible entrance, parking and restroom are listed for the office.",

  faqs: [
    ["What are your hours?", "Google lists Monday to Friday 7 a.m. to 6 p.m., Saturday 7 a.m. to 1 p.m., and closed Sunday. Please call to confirm."],
    ["I was in a car accident. Can I come in?", "Yes. Call (480) 966-1635 first so the office can talk through your situation and what paperwork to bring."],
    ["Do you take my insurance?", "Aetna is listed for Dr. Nelson on WebMD. Call (480) 966-1635 to confirm your plan, or your auto claim, before your visit."],
    ["Where is the office?", "2409 S Rural Rd, Suite D, Tempe, AZ 85282. Some older directories still show 5125 S Rural Rd; Suite D at 2409 is the current office."],
    ["Is the office wheelchair accessible?", "The entrance, parking and restroom are listed as wheelchair accessible."],
  ],

  photoNote: "Photography for this demo is licensed stock (Pexels); it is replaced with photographs of the practice at launch.",
};
