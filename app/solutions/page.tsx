import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { demos } from "@/lib/demos";
import { Stamp } from "@/components/Stamp";
import { Arrow } from "@/components/Key";
import { TrackLink } from "@/components/TrackLink";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Live solution demos — Blair Digital Studios",
  description: "Working demos for chiropractic and aesthetic practices: patient websites, AI receptionist, CRM pipeline, missed-call recovery, reminders, reviews and reactivation.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsHub() {
  return (
    <>
      <section className="mx-auto grid grid-cols-1 max-w-[1360px] gap-8 px-[var(--gutter)] pb-12 pt-12 lg:grid-cols-12 lg:pt-16">
        <h1 className="text-[clamp(44px,6.6vw,88px)] font-extrabold leading-[0.93] tracking-[-0.045em] lg:col-span-7">Live solution demos</h1>
        <div className="grid content-end gap-4 text-[17px] text-ink-2 lg:col-span-5">
          <p>
            Every demo below is a working spec build, prepared from public information to show a practice what the system would look like on its own brand, plus one reference template. Open the one prepared for you, or see how the same system adapts to different practices.
          </p>
          <p>
            Dashboards and pipelines use <span className="hl text-ink">clearly labeled sample data</span>. No patient information is ever shown.
          </p>
        </div>
      </section>

      <Reveal className="mx-auto max-w-[1360px] px-[var(--gutter)] pb-24">
        <ol className="border-t-2 border-ink">
          {demos.map((d) => (
            <li key={d.slug} className="grid grid-cols-1 gap-6 border-b border-rule py-8 md:grid-cols-12 md:gap-8">
              <div className="relative md:col-span-5" data-r="mask">
                <div className="relative aspect-[16/10] overflow-hidden border border-rule bg-paper-2">
                  <Image src={d.desktop} alt={`${d.name} website`} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover object-top" />
                </div>
                <div className="absolute -bottom-4 right-3 w-[22%] overflow-hidden rounded-[10px] border-[3px] border-ink bg-ink shadow-[0_14px_30px_-12px_rgba(17,18,20,0.5)]">
                  <div className="relative aspect-[390/844]">
                    <Image src={d.mobile} alt="" fill sizes="120px" className="object-cover object-top" />
                  </div>
                </div>
              </div>
              <div className="md:col-span-7">
                <h2 className="flex items-center gap-3 text-[clamp(26px,2.8vw,36px)] font-extrabold tracking-[-0.025em]">
                  <span aria-hidden className="h-[0.5em] w-[0.9em] shrink-0" style={{ background: d.accent }} />
                  {d.name}
                </h2>
                <p className="mt-1 text-[15px] text-ink-2">{d.category} · {d.location}</p>
                <p className="mt-2 max-w-[56ch] text-[17px]">{d.solves}</p>
                <ul className="mt-4 flex flex-wrap gap-2" aria-label="Status">
                  {d.status.map((s) => (
                    <li key={s.label}><Stamp tally={s.tally}>{s.label}</Stamp></li>
                  ))}
                </ul>
                <p className="mt-4 text-[14.5px] text-ink-2">{d.capabilities.join(" · ")}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <TrackLink href={d.system ?? d.site} event="demo_open" data={{ slug: d.slug, from: "hub" }} className="group inline-flex min-h-11 items-center gap-2 rounded-[2px] bg-blue px-4.5 text-[15px] font-semibold text-white hover:bg-blue-deep">
                    Open demo <Arrow dir="out" />
                  </TrackLink>
                  {d.system && (
                    <TrackLink href={d.site} event="demo_open" data={{ slug: d.slug, from: "hub_site" }} className="doc-link group inline-flex min-h-11 items-center gap-1 font-semibold">
                      Patient website <Arrow dir="out" className="size-3.5" />
                    </TrackLink>
                  )}
                  <Link href={`/solutions/${d.slug}`} className="doc-link inline-flex min-h-11 items-center">
                    Demo brief
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </>
  );
}
