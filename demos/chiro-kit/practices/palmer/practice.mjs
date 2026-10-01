// Palmer & Herman Chiropractic Physicians — public-source facts only (researched 2026-10-01).
// Sources: Healthgrades, WebMD (both doctors: NYCC 1987), NPI registry (Palmer: chiropractor–sports physician),
// Dun & Bradstreet (in business since 1989), American Chiropractors directory (hours, accessibility),
// Google reviews (5.0, 10 reviews).
export default {
  slug: "palmer",
  practiceKey: "palmer", // profile id for the AI front desk (lib/practices.ts in the portfolio)
  name: "Palmer & Herman",
  kind: "Chiropractic Physicians",
  legal: "Palmer/Herman Chiropractic Physicians, LLC",
  monogram: "P&H",
  city: "Naugatuck",
  state: "CT",
  region: "Naugatuck, Connecticut",
  founded: 1989,
  phone: "(203) 729-4047",
  tel: "+12037294047",
  fax: "(203) 723-9103",
  address: { street: "331 Church St", city: "Naugatuck", state: "CT", zip: "06770" },
  geo: { lat: 41.49404, lng: -73.05406 },
  timezone: "America/New_York",

  theme: {
    bg: "#fbf8f3",
    surface: "#ffffff",
    sand: "#f3ede3",
    sand2: "#e9e1d3",
    ink: "#1c2621",
    ink2: "#4b5751",
    rule: "#ddd5c7",
    brand: "#22463a",
    brandDeep: "#163128",
    brandInk: "#ffffff",
    accent: "#a8752f",
    accentSoft: "#f1e4cf",
    display: "Literata",
    displayWeights: "0,7..72,500;0,7..72,600;1,7..72,500",
    body: "Figtree",
    bodyWeights: "400;500;600;700",
    radius: "18px",
  },

  // minutes after midnight; 0 = Sunday. As listed publicly — always "call to confirm".
  hours: {
    0: [],
    1: [[480, 720], [840, 1050]],
    2: [[480, 720], [840, 1050]],
    3: [[480, 720], [840, 1050]],
    4: [[510, 630]],
    5: [[480, 720], [840, 1050]],
    6: [[510, 630]],
  },
  hoursNote: "Hours as listed in public directories. Please call to confirm before your visit.",

  hero: {
    title: "Back in motion. Here in Naugatuck since 1989.",
    lede: "Two doctors of chiropractic on Church Street, caring for back pain, neck pain, headaches and sports strains for more than three decades.",
    img: "hero",
    alt: "A chiropractor gently adjusting a smiling patient's shoulders",
  },

  intro:
    "A two-doctor practice that has kept the same address and the same phone number since 1989.",

  conditions: [
    { title: "Low back pain", text: "Strain, spasm and pain that has lingered for months.", img: "low-back" },
    { title: "Neck pain and headaches", text: "Including headaches that start in the neck after an old injury.", img: "neck" },
    { title: "Sports and active-life strains", text: "Care from a registered chiropractic sports physician.", img: "sports" },
    { title: "Disc problems", text: "Including herniated discs, evaluated by the doctor.", img: null },
    { title: "After a car accident", text: "Records can be shared with your physician or attorney.", img: null },
    { title: "Knee and hip trouble", text: "Patients' reviews mention knees and hips, not only backs.", img: null },
  ],

  treatments: [
    { title: "Chiropractic adjustments", text: "Hands-on spinal manipulation by one of the two doctors." },
    { title: "Stretch routines for home", text: "So progress continues between visits." },
    { title: "Electrical muscle stimulation (TENS)", text: "Used where it helps muscles settle.", img: "tens" },
    { title: "Sports chiropractic", text: "Care that respects what you ask of your body." },
  ],

  featured: {
    title: "Sports chiropractic, from a registered sports physician",
    text: "Dr. Terry Palmer is registered as a chiropractic sports physician. Whether you lift, run, coach or work on your feet all day, care is built around getting you back to it.",
    img: "stretch",
    alt: "A patient doing a resistance-band stretch guided by a clinician",
  },

  doctors: [
    {
      name: "Terry A. Palmer, D.C.",
      short: "Dr. Palmer",
      facts: [["Degree", "Doctor of Chiropractic, New York Chiropractic College, 1987"], ["Registered as", "Chiropractor, sports physician"]],
      quote: { text: "Dr. Palmer was such a lifesaver and helped me get back to being active. He had a plan.", by: "Leila Rosa, Google review" },
    },
    {
      name: "Glenn S. Herman, D.C.",
      short: "Dr. Herman",
      facts: [["Degree", "Doctor of Chiropractic, New York Chiropractic College, 1987"], ["Most often sees", "Back strain, back spasm and disc problems"]],
      quote: { text: "Been going to Dr. Herman for years. He's amazing. Very professional practice.", by: "David Boisvert, Google review" },
    },
  ],

  rating: { value: "5.0", count: 10, source: "Google" },
  reviews: [
    { text: "I was dealing with chronic persistent low back pain that I had seen multiple physical therapists and doctors for almost a year, until I saw Dr. Palmer. He had a plan.", by: "Leila Rosa", meta: "Local Guide" },
    { text: "Had a car accident many years ago and have been seeing Dr. Herman on and off for headaches ever since. One neck adjustment and my headache goes away by the next day.", by: "Sandra McFarland" },
    { text: "Terry got me going again with an adjustment and stretch routine. A few months have gone by since I started that routine and I feel better than ever!", by: "Chris Moore" },
    { text: "I always come out of that building feeling all around better, breathing clearer, and with more energy. These men do fantastic work.", by: "Paul Cavagnuolo" },
    { text: "First time I'd ever been to a chiropractor. After the first visit I was able to get into my car without sliding the seat all the way back.", by: "Bob" },
    { text: "I went there in so much pain and they helped me so much. I would highly recommend them.", by: "Sharon Fournier" },
  ],

  firstVisit: [
    { title: "Book or call", text: "Pick a time online or call the office. You'll get a text confirming your request." },
    { title: "Meet the doctor", text: "The doctor reviews your history and what's bothering you, and examines you before any treatment." },
    { title: "A plan you understand", text: "If chiropractic care fits, the doctor explains the plan and any stretches to keep up at home." },
  ],
  bring: ["Photo ID and your insurance card", "A list of current medications", "Any X-rays, MRI reports or notes from other doctors", "Comfortable clothes you can move in"],
  insurance: "Major plans including Aetna, Blue Cross Blue Shield, Cigna and Medicare are listed for the practice in public directories. Coverage changes, so call to confirm yours.",
  access: "Wheelchair-accessible entrance, parking and restroom.",

  faqs: [
    ["What should I bring to my first visit?", "Photo ID, your insurance card, a list of medications, and any X-rays, MRI reports or notes from other doctors. Wear clothes you can move in."],
    ["Do you take my insurance?", "Aetna, Blue Cross Blue Shield, Cigna and Medicare are listed for the practice in public directories. Call (203) 729-4047 to confirm your plan before your visit."],
    ["Is the office wheelchair accessible?", "Yes. The entrance, parking and restroom are wheelchair accessible."],
    ["Can my doctor or attorney send records?", "Yes. Records can be faxed to (203) 723-9103."],
    ["What are your hours?", "Listed hours are Monday, Tuesday, Wednesday and Friday 8 to 12 and 2 to 5:30, and Thursday and Saturday 8:30 to 10:30. Please call to confirm."],
  ],

  photoNote: "Photography for this demo is licensed stock (Pexels); it is replaced with photographs of the practice at launch.",
};
