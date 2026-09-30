"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { person } from "@/lib/site";
import { TrackLink } from "./TrackLink";

const nav = [
  { href: "/work", label: "Work" },
  { href: "/solutions", label: "Solution lab" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = (href: string) => path === href || path.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur-[6px] supports-[backdrop-filter]:bg-paper/85">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[1360px] items-center gap-6 px-[var(--gutter)]">
        <Link href="/" className="group mr-auto flex min-w-0 items-baseline gap-2.5" aria-label="Emmanuel Nanadoum, home">
          <span className="whitespace-nowrap text-[16px] font-extrabold tracking-[-0.01em]">Emmanuel Nanadoum</span>
          <span className="hidden truncate text-[14px] text-ink-2 md:inline">AI Consultant / Solutions Engineer</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={active(n.href) ? "page" : undefined}
              className={`relative px-3 py-2 text-[15px] transition-colors hover:text-blue ${active(n.href) ? "text-ink font-semibold after:absolute after:inset-x-3 after:-bottom-[13px] after:h-[2px] after:bg-blue" : "text-ink-2"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <TrackLink
          href={person.resume}
          event="resume_open"
          data={{ from: "header" }}
          className="inline-flex h-10 items-center gap-2 rounded-[2px] bg-blue px-3.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-blue-deep"
        >
          Résumé
          <svg aria-hidden viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M8 2v9M4 7.5 8 11.5l4-4M3 14h10" /></svg>
          <span className="sr-only">(PDF, opens in a new tab)</span>
        </TrackLink>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg aria-hidden viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M4 4l12 12M16 4 4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
          </svg>
        </button>
      </div>
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-paper px-[var(--gutter)] pb-10 pt-4 lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="border-t border-rule">
            {[{ href: "/", label: "Cover" }, ...nav].map((n) => (
              <li key={n.href} className="border-b border-rule">
                <Link href={n.href} aria-current={path === n.href ? "page" : undefined} className="flex min-h-14 items-center justify-between text-[22px] font-bold tracking-[-0.01em]">
                  {n.label}
                  <span aria-hidden className="text-ink-3">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <dl className="mt-8 grid gap-3 text-[16px]">
          <div>
            <dt className="text-[13px] text-ink-2">Email</dt>
            <dd><a className="doc-link" href={`mailto:${person.email}`}>{person.email}</a></dd>
          </div>
          <div>
            <dt className="text-[13px] text-ink-2">Phone</dt>
            <dd><a className="doc-link" href={person.phoneHref}>{person.phone}</a></dd>
          </div>
          <div>
            <dt className="text-[13px] text-ink-2">Location</dt>
            <dd>{person.location} · {person.availability}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
