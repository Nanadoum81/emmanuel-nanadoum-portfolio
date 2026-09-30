import type { Metadata } from "next";
import { person, runSheet, capabilities, experience, education, mailto } from "@/lib/site";
import { Key, Arrow } from "@/components/Key";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About — how I work",
  description: "How Emmanuel Nanadoum works: discovery, requirements, solution architecture, demos, validation, implementation and enablement. Experience, capabilities and education.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <header className="mx-auto grid grid-cols-1 max-w-[1360px] gap-10 px-[var(--gutter)] pb-14 pt-12 lg:grid-cols-12 lg:pt-16">
        <div className="lg:col-span-7">
          <h1 className="text-[clamp(48px,7vw,92px)] font-extrabold leading-[0.92] tracking-[-0.045em]">About</h1>
          <p className="mt-6 max-w-[40ch] text-[clamp(21px,2vw,26px)] font-medium leading-[1.35] tracking-[-0.01em]">
            For eight years I sold high-ticket, multi-step purchases face to face. Alongside that, I started building the systems behind the sale.
          </p>
        </div>
        <div className="grid content-end gap-4 text-[17px] text-ink-2 lg:col-span-5">
          <p>
            That combination is the job: sit with a customer, find the real problem, and come back with something that works — a live demo on their own business, an architecture they can follow, and a plan to get it into production.
          </p>
          <p>
            Today I run Blair Digital Studios, designing AI voice, CRM and automation systems for small practices, and I built VYBE, an AI passenger-experience product, end to end. I&apos;m based in {person.location} and open to remote or hybrid Solutions Engineer, Sales Engineer and AI Consultant roles.
          </p>
        </div>
      </header>

      <Reveal as="section" className="border-t border-rule bg-paper-2">
        <div className="mx-auto max-w-[1360px] px-[var(--gutter)] py-16 lg:py-20">
          <h2 className="text-[clamp(30px,3.4vw,44px)]">How I work</h2>
          <ol className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3" data-r="rows">
            {runSheet.map((r, i) => (
              <li key={r.step} className="border-t-2 border-ink pt-3">
                <h3 className="text-[20px] font-bold tracking-[-0.01em]">
                  <span className="num mr-2 text-[15px] text-ink-3">{i + 1}</span>
                  {r.step}
                </h3>
                <p className="mt-1 font-semibold">{r.line}</p>
                <p className="mt-2 text-[15.5px] text-ink-2">{r.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal as="section" className="border-t border-rule">
        <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-10 px-[var(--gutter)] py-16 lg:grid-cols-12 lg:py-20">
          <h2 className="text-[clamp(30px,3.4vw,44px)] lg:col-span-4">Experience</h2>
          <ol className="lg:col-span-8" data-r="rows">
            {experience.map((e) => (
              <li key={e.org} className="border-b border-rule py-6 first:border-t-2 first:border-t-ink">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-[20px] font-bold tracking-[-0.01em]">{e.role}</h3>
                  <p className="num text-[15px] font-semibold">{e.when}</p>
                </div>
                <p className="text-ink-2">{e.org} · {e.where}</p>
                <ul className="mt-3 grid gap-2 text-[16px]">
                  {e.points.map((p) => (
                    <li key={p} className="grid grid-cols-[18px_1fr] text-ink-2">
                      <span aria-hidden className="mt-[0.7em] h-px w-2.5 bg-ink" />
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      <Reveal as="section" className="border-t border-rule bg-paper-2">
        <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-10 px-[var(--gutter)] py-16 lg:grid-cols-12 lg:py-20">
          <h2 className="text-[clamp(30px,3.4vw,44px)] lg:col-span-4">Technical capabilities</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-8" data-r="rows">
            {capabilities.map((g) => (
              <div key={g.group} className="border-t-2 border-ink pt-3">
                <h3 className="text-[17px] font-bold tracking-normal">{g.group}</h3>
                <p className="mt-2 text-[15.5px] text-ink-2">{g.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <section className="border-t border-rule">
        <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-10 px-[var(--gutter)] py-16 lg:grid-cols-12 lg:py-20">
          <h2 className="text-[clamp(30px,3.4vw,44px)] lg:col-span-4">Education</h2>
          <ul className="grid gap-3 text-[17px] lg:col-span-8">
            {education.map((e) => (
              <li key={e} className="border-b border-rule pb-3">{e}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3 lg:col-span-8 lg:col-start-5">
            <Key href={person.resume} event="resume_open" data={{ from: "about" }}>Download résumé <Arrow dir="down" /></Key>
            <Key href={mailto("Discuss a role")} event="contact_email" data={{ from: "about" }} variant="secondary">Discuss a role</Key>
          </div>
        </div>
      </section>
    </>
  );
}
