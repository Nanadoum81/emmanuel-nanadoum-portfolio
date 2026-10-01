// Nelson Chiropractic, Thatcher AZ (Gila Valley) — Dr. Jared Nelson, D.C.
// Source: the practice's own site https://www.nelsonchiropracticaz.com (home, about, treatments), read 2026-10-01.
// Hero and doctor photos are the practice's own (from that site); condition photos are Pexels stock.
export default {
  slug: "nelson-thatcher",
  practiceKey: "nelson-thatcher",
  name: "Nelson Chiropractic",
  kind: "Chiropractic",
  legal: "Nelson Chiropractic",
  monogram: "N",
  city: "Thatcher",
  state: "AZ",
  region: "Thatcher, Arizona",
  founded: null,
  phone: "(928) 792-9686",
  tel: "+19287929686",
  fax: null,
  address: { street: "745 N. Allred Lane, Suite 100", city: "Thatcher", state: "AZ", zip: "85552" },
  timezone: "America/Phoenix",

  theme: {
    bg: "#faf6f0",
    surface: "#ffffff",
    sand: "#f2e9dd",
    sand2: "#e6d7c3",
    ink: "#221a15",
    ink2: "#58493e",
    rule: "#e3d5c3",
    brand: "#3b2a22",
    brandDeep: "#261a14",
    brandInk: "#ffffff",
    accent: "#b4692a",
    accentSoft: "#f6e2cb",
    display: "Bodoni Moda",
    body: "Mulish",
    fontsHref: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,600;1,6..96,500&family=Mulish:wght@400;500;600;700&display=swap",
    radius: "16px",
  },
  heroVariant: "full",

  hours: {
    0: [],
    1: [[540, 750], [930, 1140]],
    2: [],
    3: [[540, 750], [930, 1140]],
    4: [[540, 750], [930, 1050]],
    5: [[540, 750]],
    6: [],
  },
  hoursNote: "Hours as published on the practice's website. Please call to confirm.",

  heroPlace: "745 N. Allred Lane · Thatcher, in the Gila Valley",
  tagline: "Dr. Jared Nelson, D.C. — chiropractic, myofascial release and rehab in Thatcher, Arizona. Book online or call (928) 792-9686.",
  hero: {
    title: "Strong, healthy lives in the Gila Valley.",
    lede: "Dr. Jared Nelson combines several adjusting styles with myofascial release, assisted stretching, rehab and taping, so care fits your goals: getting out of pain, training harder, or preparing for a baby.",
    img: "hero",
    alt: "A balanced stone cairn among yucca at sunset over desert mountains",
  },
  intro: "Everyone has different goals and different bodies. Care at Nelson Chiropractic is built around yours, treating the cause rather than the symptom.",
  homeFacts: [["Doctor", "Jared Nelson, D.C., Parker University"], ["First visit", "Initial consultation, $65"], ["Adjustment", "$45 for returning patients"], ["Booking", "Online, any time"]],

  doctorsHomeTitle: "Meet Dr. Jared Nelson",
  doctorsTitle: "Dr. Jared Nelson, D.C.",
  doctorsIntro: "A broken pelvis from a 300-pound cattle gate left Dr. Nelson in pain for years, until chiropractic care at Parker University's clinic changed that. He went on to earn his Doctor of Chiropractic there.",

  conditions: [
    { title: "Back and neck pain", text: "Getting out of pain and back to proper function.", img: "low-back" },
    { title: "Chronic soft-tissue tightness", text: "Myofascial release for complaints that keep coming back.", img: "soft-tissue" },
    { title: "Athletic performance", text: "Taping, rehab and exercises to train and recover better.", img: "lifting" },
    { title: "Pregnancy care", text: "Care to help you prepare for the birth of your little one.", img: null },
    { title: "Old injuries", text: "Rehabilitation and neuromuscular re-education for lasting change.", img: null },
  ],
  treatImg: { name: "soft-tissue", alt: "Hands-on soft-tissue work on a patient's back" },
  treatments: [
    { title: "Initial consultation · $65", text: "Ready to be heard? Time dedicated to you, your goals and your needs." },
    { title: "Chiropractic adjustment · $45", text: "For returning patients, using a variety of adjusting styles." },
    { title: "Myofascial release · $50", text: "A more focused approach to chronic soft-tissue complaints." },
    { title: "Assisted stretching, rehab and taping", text: "Neuromuscular re-education, RockTape taping and exercises to keep progress going." },
  ],
  featured: {
    title: "For athletes and expecting moms alike",
    text: "Whether it's improving your athletics or preparing for the birth of your little one, Dr. Nelson uses taping, assisted stretching, rehab and exercises alongside adjustments: whatever it takes to get you where you want to be.",
    img: "lifting",
    alt: "An athlete training with weights",
  },

  doctors: [
    {
      name: "Jared Nelson, D.C.",
      short: "Dr. Nelson",
      realPhoto: true,
      facts: [["Doctorate", "D.C., Parker University"], ["Also", "B.B.A., Brigham Young University–Hawaii; A.G.S., Brigham Young University–Idaho"], ["Techniques", "Multiple adjusting styles, myofascial release, assisted stretching, rehab, taping"]],
    },
  ],

  rating: null,
  reviews: [],

  firstVisit: [
    { title: "Book your initial consult", text: "New patients start with an initial consultation. Book online or call (928) 792-9686." },
    { title: "Be heard", text: "Dr. Nelson learns your goals, your history and what's going on before any treatment." },
    { title: "A plan for your goals", text: "Adjustments, soft-tissue work, stretching, rehab or taping, chosen for what you want to achieve." },
  ],
  bring: ["Photo ID and any insurance information", "A list of current medications", "Any X-rays or notes from other providers", "Comfortable clothes you can move in"],
  insurance: "Visit prices are published: initial consultation $65, adjustment $45, myofascial release $50. Call the office with insurance questions.",
  access: "Find us at 745 N. Allred Lane, Suite 100, in Thatcher.",

  faqs: [
    ["How much is a visit?", "Published prices: initial consultation $65, chiropractic adjustment $45, myofascial release $50."],
    ["I'm a new patient. What should I book?", "Book an initial consultation. Adjustments are for returning patients."],
    ["What are your hours?", "Monday and Wednesday 9 to 12:30 and 3:30 to 7; Thursday 9 to 12:30 and 3:30 to 5:30; Friday 9 to 12:30. Closed Tuesday, Saturday and Sunday. Please call to confirm."],
    ["How do I reach the office?", "Call (928) 792-9686 or email nelsonchiropracticshl@gmail.com."],
  ],

  photoNote: "The hero and doctor photos are the practice's own; other photography is licensed stock (Pexels), replaced with photos of the practice at launch.",
};
