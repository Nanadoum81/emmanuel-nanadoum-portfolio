import { person, mailto } from "@/lib/site";
import { TrackLink } from "./TrackLink";

/** Persistent recruiter actions on small screens. */
export function MobileActionBar() {
  const cell = "flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 text-[13px] font-semibold";
  return (
    <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-30 flex border-t border-rule bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-[6px] lg:hidden">
      <TrackLink href={person.resume} event="resume_open" data={{ from: "mobile_bar" }} className={`${cell} bg-blue text-white`}>
        <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M8 2v9M4 7.5 8 11.5l4-4M3 14h10" /></svg>
        Résumé
      </TrackLink>
      <TrackLink href={mailto()} event="contact_email" data={{ from: "mobile_bar" }} className={`${cell} border-r border-rule`}>
        <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3.5h12v9H2zM2.5 4l5.5 4.5L13.5 4" /></svg>
        Email
      </TrackLink>
      <TrackLink href={person.phoneHref} event="contact_phone" data={{ from: "mobile_bar" }} className={`${cell} border-r border-rule`}>
        <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5.5 2 3 2.5c-.6 4.8 3.7 10.1 10.5 10.5l.5-2.5-3-1.2-1.2 1.4C8 10 6.1 8.1 5.4 6.3L6.8 5.1z" /></svg>
        Call
      </TrackLink>
      <TrackLink href={person.linkedin} event="contact_linkedin" data={{ from: "mobile_bar" }} className={cell}>
        <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="currentColor"><path d="M3.5 5.8h2v7h-2zM4.5 2.5a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2zM7 5.8h1.9v1c.3-.6 1.1-1.1 2.2-1.1 2 0 2.4 1.3 2.4 3v4.1h-2V9.2c0-.9 0-1.9-1.2-1.9s-1.3.9-1.3 1.8v3.7H7z" /></svg>
        LinkedIn
      </TrackLink>
    </nav>
  );
}
