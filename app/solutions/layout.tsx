import Link from "next/link";
import { person } from "@/lib/site";
import { TrackLink } from "@/components/TrackLink";

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-rule bg-paper">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-4 px-[var(--gutter)]">
          <Link href="/solutions" className="mr-auto flex items-baseline gap-2.5">
            <span className="text-[16px] font-extrabold tracking-[-0.01em]">Blair Digital Studios</span>
            <span className="hidden text-[14px] text-ink-2 sm:inline">Live solution demos</span>
          </Link>
          <TrackLink href={person.phoneHref} event="client_phone" data={{ from: "client_header" }} className="hidden text-[15px] font-semibold hover:text-blue sm:inline">
            {person.phone}
          </TrackLink>
          <TrackLink
            href={`mailto:${person.email}?subject=${encodeURIComponent("Demo walkthrough")}`}
            event="client_email"
            data={{ from: "client_header" }}
            className="inline-flex h-10 items-center rounded-[2px] bg-ink px-3.5 text-[14.5px] font-semibold text-paper hover:bg-blue"
          >
            Talk to us
          </TrackLink>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <footer className="border-t border-rule">
        <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-6 px-[var(--gutter)] py-10 text-[14.5px] text-ink-2 md:grid-cols-2">
          <div>
            <p className="font-bold text-ink">Blair Digital Studios</p>
            <p>Websites, AI voice, CRM and follow-up built as one connected system.</p>
          </div>
          <div className="md:text-right">
            <p>Emmanuel Nanadoum, Principal Consultant</p>
            <p>
              <a className="hover:text-blue" href={`mailto:${person.email}`}>{person.email}</a> · <a className="hover:text-blue" href={person.phoneHref}>{person.phone}</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
