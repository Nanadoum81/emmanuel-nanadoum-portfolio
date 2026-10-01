// Practice profiles for the AI front desk on Blair prospect demo sites.
// Public-source facts only; anything a listing can't confirm is phrased as "call to confirm".

export type PracticeProfile = {
  name: string;
  short: string;
  city: string;
  phone: string;
  address: string;
  doctors: string[];
  hours: string;
  services: string;
  insurance: string;
  extras: string;
};

export const PRACTICES: Record<string, PracticeProfile> = {
  nelson: {
    "name": "Nelson Chiropractic",
    "short": "Nelson Chiropractic",
    "city": "Tempe, Arizona",
    "phone": "(480) 966-1635",
    "address": "2409 S Rural Rd, Suite D, Tempe, AZ 85282",
    "doctors": [
      "Dr. Donald L. Nelson, D.C. (Los Angeles College of Chiropractic, 1983)"
    ],
    "hours": "Listed hours on Google: Monday to Friday 7 a.m. to 6 p.m.; Saturday 7 a.m. to 1 p.m.; closed Sunday. Always add that callers should confirm hours with the office.",
    "services": "Chiropractic adjustments (hands-on spinal manipulation) by Dr. Nelson, care after car accidents, and physical therapy and soft-tissue work as listed for the practice in public directories. Dr. Nelson can order an MRI when it is warranted. Common reasons people come in: low back pain, neck pain, disc and nerve symptoms in the shoulder or arm, lifting and training strains, headaches, and injuries after a car accident.",
    "insurance": "Aetna is listed for Dr. Nelson on WebMD. Other plans and auto-accident claims: the office confirms coverage by phone.",
    "extras": "Dr. Nelson has practiced on South Rural Road in Tempe since at least 1995; some older directories still list 5125 S Rural Rd, but the current office is Suite D at 2409 S Rural Rd. Wheelchair-accessible entrance, parking and restroom are listed for the office. After a car accident, callers should phone the office first to talk through their situation and what paperwork to bring."
  },
  canham: {
    "name": "Canham Chiropractic (Rosalind L. Canham, D.C.)",
    "short": "Canham Chiropractic",
    "city": "Phoenix, Arizona",
    "phone": "(602) 255-0600",
    "address": "2041 N 7th St, Phoenix, AZ 85006",
    "doctors": [
      "Dr. Rosalind L. Canham, D.C. (Doctor of Chiropractic, Cleveland Chiropractic College; M.S. in Human Anatomy and Physiology Instruction, New York Chiropractic College; registered as a chiropractor specializing in rehabilitation)"
    ],
    "hours": "Office hours are not published. Do not state any hours; tell callers the office will confirm a time and they can call (602) 255-0600.",
    "services": "Chiropractic spinal adjustments, exercise rehabilitation, manual medicine and therapeutic procedures. People commonly ask about back pain, neck and upper-back tension, stiffness, and rebuilding strength after an injury; the doctor decides what fits after an exam.",
    "insurance": "Public registry records list Blue Cross Blue Shield of Arizona and Arizona Medicaid provider IDs; Dr. Canham does not participate in Medicare. The office confirms coverage by phone.",
    "extras": "Dr. Canham has been in private practice in Phoenix since 1998 and founded Canham College (Professional Online Education), which trains chiropractic assistants. The listing shows a wheelchair-accessible entrance, parking and restroom. Physicians and attorneys can fax records to (602) 255-0601."
  },
  palmer: {
    name: "Palmer & Herman Chiropractic Physicians",
    short: "Palmer & Herman",
    city: "Naugatuck, Connecticut",
    phone: "(203) 729-4047",
    address: "331 Church Street, Naugatuck, CT 06770",
    doctors: [
      "Dr. Terry A. Palmer, D.C. (New York Chiropractic College, 1987)",
      "Dr. Glenn S. Herman, D.C. (New York Chiropractic College, 1987). Both doctors are registered as chiropractor–sports physicians.",
    ],
    hours:
      "Listed hours: Monday, Tuesday, Wednesday and Friday 8 to 12 and 2 to 5:30; Thursday and Saturday 8:30 to 10:30; closed Sunday. Always add that callers should confirm hours with the office.",
    services:
      "Chiropractic adjustments, sports chiropractic, stretch routines for home, and electrical muscle stimulation (TENS). Common reasons people come in: low back pain, neck pain, headaches that start in the neck, disc problems, sports strains, and injuries after a car accident.",
    insurance:
      "Major plans including Aetna, Blue Cross Blue Shield, Cigna and Medicare are listed for the practice in public directories; the office confirms coverage by phone.",
    extras:
      "In practice since 1989. Wheelchair-accessible entrance, parking and restroom. Physicians and attorneys can fax records to (203) 723-9103.",
  },
};

export function practicePrompt(p: PracticeProfile) {
  return `You are the virtual front desk for ${p.name} in ${p.city}, on a demonstration website built by Blair Digital Studios. You are speaking on the practice's website, so:
- Reply in one to three short, warm sentences. Plain spoken English: no markdown, lists, emojis or URLs.
- Ask one question at a time.

Facts you may use (never invent others):
- Address: ${p.address}. Phone: ${p.phone}.
- Doctors: ${p.doctors.join("; ")}.
- ${p.hours}
- Services: ${p.services}
- Insurance: ${p.insurance}
- ${p.extras}

You can:
- Answer questions about the practice using only the facts above. If you don't know, say the office can answer and give the phone number.
- Take an appointment request: collect first and last name, best phone number, whether they are a new or returning patient, preferred day and morning or afternoon, and the reason in a few words. Then read it back and say the office will call or text to confirm. Never say an appointment is booked or confirmed.

Always:
- Say you are an AI assistant if asked, and never claim to be a person or a doctor.
- No medical advice, diagnoses, prices or promises about results. For severe or sudden symptoms, chest pain, numbness, loss of bladder control or an emergency, tell them to call 911 or their doctor.
- If they ask who built this or about the demo, say it is a Blair Digital Studios demonstration of an AI front desk.`;
}
