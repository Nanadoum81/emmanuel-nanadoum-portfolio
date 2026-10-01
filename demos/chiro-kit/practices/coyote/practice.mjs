// Coyote Chiropractic & Wellness Center, P.C. — public-source facts only (researched 2026-10-01).
// Sources: Google Business Profile (4.6, 24 reviews; hours; accessibility via directory mirror),
// NPI registry (Dr. David Michael Merchant, D.C., NPI 1124052584, AZ license 5997; org NPI 1407157001, fax),
// the practice's own website as archived by the Wayback Machine 2023-02 to 2023-08 (doctor bio, services,
// massage, decompression, laser, payment options). The live domain coyotechiropractic.com no longer serves
// the practice (it shows unrelated gambling content as of 2026-10-01), so nothing here links to it.
// Full source log: sales/coyote/RESEARCH.md
export default {
  slug: "coyote",
  practiceKey: "coyote", // profile id for the AI front desk (lib/practices.ts in the portfolio)
  name: "Coyote",
  kind: "Chiropractic & Wellness Center",
  legal: "Coyote Chiropractic & Wellness Center, P.C.",
  monogram: "CC",
  city: "Tempe",
  state: "AZ",
  region: "Tempe, Arizona",
  founded: 1999, // Dr. Merchant's CV on the practice site: "Coyote Chiropractic & Wellness Center, PC 11/15/99 – present"
  phone: "(480) 820-0999",
  tel: "+14808200999",
  fax: "(480) 557-4546",
  address: { street: "3006 S Rural Rd", city: "Tempe", state: "AZ", zip: "85282" },
  geo: { lat: 33.39642, lng: -111.926643 },
  timezone: "America/Phoenix",

  // Sonoran palette from their own cues: the coyote-and-spiral sign on stucco, terracotta, turquoise.
  theme: {
    bg: "#fbf6ef",
    surface: "#ffffff",
    sand: "#f4eadc",
    sand2: "#eadbc6",
    ink: "#2a201b",
    ink2: "#5b4c43",
    rule: "#e2d4c1",
    brand: "#9a4528",
    brandDeep: "#6b2c17",
    brandInk: "#ffffff",
    accent: "#2f6f6a",
    accentSoft: "#dcece8",
    display: "Bricolage Grotesque",
    body: "Public Sans",
    fontsHref:
      "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
    radius: "14px",
  },

  // minutes after midnight; 0 = Sunday. As listed on Google (2026-10-01). Always "call to confirm".
  hours: {
    0: [],
    1: [[600, 1140]],
    2: [],
    3: [[600, 1140]],
    4: [],
    5: [[600, 900]],
    6: [],
  },
  hoursNote:
    "Hours as listed on Google. The practice's former website also offered Tuesday, Thursday and weekend visits by appointment. Please call to confirm.",

  heroPlace: "3006 S Rural Rd, Tempe · near ASU",
  tagline:
    "Chiropractic, car-accident care, massage and spinal decompression on South Rural Road in Tempe since 1999. Call (480) 820-0999.",

  hero: {
    title: "Chiropractic, massage and car-accident care on Rural Road since 1999.",
    lede: "Dr. David Merchant and his team treat neck and back pain, whiplash, sciatica and work injuries with adjustments, massage, decompression and hands-on therapy, a short drive from ASU.",
    img: "hero",
    alt: "A practitioner working through a patient's hip and leg on a treatment table",
  },

  intro: "One chiropractor, a massage and rehab team, and the same Rural Road address since 1999.",

  homeFacts: [
    ["On Rural Road since", "1999"],
    ["Your doctor", "Dr. David M. Merchant, D.C."],
    ["Google rating", "4.6 from 24 reviews"],
    ["Access", "Wheelchair-accessible entrance, parking and restroom"],
  ],

  conditions: [
    { title: "After a car accident", text: "Whiplash, seat-belt injuries, and neck or back pain that shows up days after a collision.", img: "auto" },
    { title: "Low back pain and sciatica", text: "Including pain and numbness that runs from the low back into the leg.", img: "low-back" },
    { title: "Neck pain and headaches", text: "Stiff, sore necks, and headaches that start in the neck.", img: "neck" },
    { title: "Disc problems", text: "Herniated and degenerative discs, with non-surgical spinal decompression available.", img: null },
    { title: "Work and personal injuries", text: "Strains from the job or a fall. Workers' compensation cases are accepted.", img: null },
  ],

  treatments: [
    { title: "Chiropractic adjustments", text: "Hands-on spinal care from Dr. Merchant." },
    { title: "Massage therapy", text: "Swedish, deep tissue and trigger point, sports and prenatal massage from licensed therapists.", img: "massage" },
    { title: "Spinal decompression", text: "Triton DTS table for the low back and neck, and for the wrist (carpal tunnel)." },
    { title: "Laser therapy", text: "Class 3B and Class 4 therapeutic laser for pain and soft-tissue injuries." },
    { title: "Physiotherapy", text: "Ultrasound, interferential muscle stimulation, mechanical traction, cold and moist heat.", img: "tens" },
    { title: "Corrective exercises", text: "Stretches and strengthening you can keep up at home between visits." },
  ],

  featured: {
    title: "Car-accident care from a whiplash-certified chiropractor",
    text: "Most of Coyote's public reviews come from people treated after a collision. Dr. Merchant holds post-graduate certification in whiplash and acceleration/deceleration injuries (Spine Research Institute of San Diego, 2000), and the office accepts auto-accident, personal-injury and workers' compensation cases.",
    img: "whiplash",
    alt: "A practitioner gently supporting a patient's head and neck on a treatment table",
  },

  doctorsTitle: "The doctor on Rural Road",
  doctorsIntro:
    "Dr. David M. Merchant, D.C., has treated patients at Coyote Chiropractic & Wellness Center since November 1999. He earned his Doctor of Chiropractic at Life Chiropractic College West in 1997, studied at Arizona State University, and holds post-graduate certification in whiplash injuries.",

  doctors: [
    {
      name: "David M. Merchant, D.C.",
      short: "Dr. Merchant",
      facts: [
        ["Degree", "Doctor of Chiropractic, Life Chiropractic College West, 1997"],
        ["Undergraduate", "Arizona State University"],
        ["Post-graduate", "Whiplash and acceleration/deceleration injuries, Spine Research Institute of San Diego, 2000"],
        ["Licensed", "Arizona chiropractor, license no. 5997"],
      ],
      quote: { text: "Dr. Merchant is very polite and helpful, and really wants what's best for his patients.", by: "Ryan K., Google review" },
    },
  ],

  rating: { value: "4.6", count: 24, source: "Google" },
  reviews: [
    { text: "I went to Coyote Chiropractic after a car accident and the treatment there was great. Dr. Merchant is very polite and helpful, and really wants what's best for his patients.", by: "Ryan K." },
    { text: "I have tried numerous chiropractors in the area. I found Dr Merchant to be extremely thorough with his assessment on my condition.", by: "Jody M.", meta: "Local Guide" },
    { text: "Dr. Merchant worked with me on developing a treatment plan to ensure complete recovery. Dr. Merchant guided me every step of the way and answered all my questions.", by: "Jaime B." },
    { text: "Everyone is super friendly and they're always pretty flexible with their schedule in order to make something work within yours.", by: "Alexandria J." },
    { text: "Dr. Merchant is awesome. I always leave feeling much better than when I came in. Super flexible schedule too, which helps a lot!", by: "Jesse K." },
    { text: "Great service. Dr Merchant is on top of every aspect of your care.", by: "Greg N.", meta: "Local Guide" },
  ],

  firstVisit: [
    { title: "Book or call", text: "Pick a time online or call the office. You'll get a text confirming your request." },
    { title: "History and exam", text: "Dr. Merchant goes over what happened and how you feel, and examines you. X-rays can be taken in the office when they're needed." },
    { title: "A plan you understand", text: "If chiropractic care fits, he explains the plan, which may combine adjustments, massage, therapy and exercises for home." },
  ],
  bring: [
    "Photo ID and your health insurance card",
    "After an accident: your auto claim number and adjuster's contact, if you have them",
    "A list of current medications",
    "Any X-rays, MRI reports or notes from other doctors",
  ],
  insurance:
    "The practice has listed most health plans, plus auto-accident, personal-injury and workers' compensation cases. Aetna and Blue Cross Blue Shield appear in public provider records. Coverage changes, so call to confirm yours.",
  access: "Wheelchair-accessible entrance, parking and restroom.",

  faqs: [
    ["Do you see patients after a car accident?", "Yes. Auto-accident and personal-injury cases are accepted, and Dr. Merchant holds post-graduate certification in whiplash injuries. Call (480) 820-0999 to set up a visit."],
    ["Do you take my insurance?", "The practice has listed most health plans, plus auto-accident and workers' compensation cases. Aetna and Blue Cross Blue Shield appear in public provider records. Call to confirm your plan before your visit."],
    ["Do you offer massage?", "Yes. Massage therapy offered at the practice has included Swedish, deep tissue and trigger point, sports and prenatal massage."],
    ["Do you offer spinal decompression?", "Yes. The office has a Triton DTS decompression table for the low back and neck, and for the wrist. Ask the doctor whether it suits your condition."],
    ["What are your hours?", "Google lists Monday and Wednesday 10 to 7 and Friday 10 to 3. Other days have been available by appointment. Please call to confirm."],
    ["Is the office wheelchair accessible?", "Yes. The entrance, parking and restroom are listed as wheelchair accessible."],
    ["Can my doctor or attorney send records?", "Yes. Records can be faxed to (480) 557-4546."],
  ],

  photoNote: "Photography for this demo is licensed stock (Pexels); it is replaced with photographs of the practice at launch.",
};
