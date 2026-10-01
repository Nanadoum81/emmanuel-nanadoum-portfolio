import Link from "next/link";
import { person, mailto } from "@/lib/site";
import { TrackLink } from "./TrackLink";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-paper pb-24 lg:pb-0">
      <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-8 px-[var(--gutter)] py-12 text-[14.5px] text-ink-2 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-[16px] font-bold text-ink">Emmanuel Nanadoum</p>
          <p>AI Consultant / Solutions Engineer / Sales Engineer · AI, CRM &amp; Automation</p>
          <p>{person.location} · {person.availability}</p>
        </div>
        <ul className="grid content-start gap-1.5">
          <li><Link className="hover:text-blue" href="/work">Work</Link></li>
          <li><Link className="hover:text-blue" href="/solutions">Client solution lab</Link></li>
          <li><Link className="hover:text-blue" href="/receptionist">AI receptionist</Link></li>
          <li><Link className="hover:text-blue" href="/about">About</Link></li>
          <li><Link className="hover:text-blue" href="/resume">Résumé</Link></li>
        </ul>
        <ul className="grid content-start gap-1.5">
          <li><TrackLink className="hover:text-blue" href={mailto()} event="contact_email" data={{ from: "footer" }}>{person.email}</TrackLink></li>
          <li><TrackLink className="hover:text-blue" href={person.phoneHref} event="contact_phone" data={{ from: "footer" }}>{person.phone}</TrackLink></li>
          <li><TrackLink className="hover:text-blue" href={person.linkedin} event="contact_linkedin" data={{ from: "footer" }}>LinkedIn</TrackLink></li>
        </ul>
      </div>
      <div className="mx-auto max-w-[1360px] px-[var(--gutter)]">
        <div className="flex flex-wrap justify-between gap-2 border-t border-rule py-4 text-[13px] text-ink-3">
        <span>© 2026 Emmanuel Nanadoum</span>
        <span>Every exhibit links to a live build.</span>
        </div>
      </div>
    </footer>
  );
}
