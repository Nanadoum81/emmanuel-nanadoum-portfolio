import type { Metadata } from "next";
import { person, mailto } from "@/lib/site";
import { Key, Arrow } from "@/components/Key";
import { TrackLink } from "@/components/TrackLink";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Emmanuel Nanadoum — Solutions Engineer / AI Consultant in Phoenix, Arizona. Email nanadoum81@gmail.com, phone 602-810-1271, LinkedIn.",
  alternates: { canonical: "/contact" },
};

const rows = [
  { k: "Email", v: person.email, href: mailto("Discuss a role"), ev: "contact_email", note: "Best for scheduling a conversation." },
  { k: "Phone", v: person.phone, href: person.phoneHref, ev: "contact_phone", note: "Arizona time (MST, UTC−7, no daylight saving)." },
  { k: "LinkedIn", v: "linkedin.com/in/emmanuel-nanadoum-7971b7a8", href: person.linkedin, ev: "contact_linkedin", note: "Professional profile." },
  { k: "Résumé", v: "Emmanuel_Nanadoum_Solutions_Engineer_Resume.pdf", href: person.resume, ev: "resume_open", note: "One page, PDF." },
];

export default function Contact() {
  return (
    <section className="mx-auto grid grid-cols-1 max-w-[1360px] gap-12 px-[var(--gutter)] pb-24 pt-12 lg:grid-cols-12 lg:pt-16">
      <div className="lg:col-span-5">
        <h1 className="text-[clamp(48px,7vw,92px)] font-extrabold leading-[0.92] tracking-[-0.045em]">Contact</h1>
        <p className="mt-6 max-w-[36ch] text-[clamp(20px,1.9vw,24px)] font-medium leading-[1.35]">
          Hiring for a Solutions Engineer, Sales Engineer or AI Consultant? Let&apos;s talk about the role.
        </p>
        <p className="mt-4 text-ink-2">{person.location} · {person.availability}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Key href={mailto("Discuss a role")} event="contact_email" data={{ from: "contact_hero" }}>Discuss a role <Arrow /></Key>
          <Key href="/work" event="view_work" data={{ from: "contact" }} variant="secondary">View technical work</Key>
        </div>
      </div>
      <div className="min-w-0 lg:col-span-7"><dl className="border-t-2 border-ink">
        {rows.map((r) => (
          <div key={r.k} className="grid grid-cols-1 gap-1 border-b border-rule py-5 sm:grid-cols-[120px_1fr]">
            <dt className="text-[15px] text-ink-2">{r.k}</dt>
            <dd className="min-w-0">
              <TrackLink href={r.href} event={r.ev} data={{ from: "contact_table" }} className="break-words text-[clamp(19px,2vw,24px)] font-bold tracking-[-0.01em] text-blue underline decoration-blue/35 underline-offset-4 hover:decoration-blue">
                {r.v}
              </TrackLink>
              <p className="mt-1 text-[15px] text-ink-2">{r.note}</p>
            </dd>
          </div>
        ))}
      </dl>
      <ContactForm /></div>
    </section>
  );
}
