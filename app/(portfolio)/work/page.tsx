import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/lib/work";
import { ExhibitPlate } from "@/components/Exhibit";
import { Stamp } from "@/components/Stamp";
import { Arrow } from "@/components/Key";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Work — exhibits",
  description: "Case studies: VYBE AI passenger experience, Cactus Chiropractic AI patient acquisition, Palmer & Herman reusable solution architecture, and Blair Digital Studios revenue systems.",
  alternates: { canonical: "/work" },
};

const letters = ["A", "B", "C", "D"];

export default function WorkIndex() {
  return (
    <>
      <header className="mx-auto max-w-[1360px] px-[var(--gutter)] pb-10 pt-12 lg:pt-16">
        <h1 className="text-[clamp(48px,7vw,92px)] font-extrabold leading-[0.92] tracking-[-0.045em]">Exhibits</h1>
        <p className="mt-5 max-w-[56ch] text-[19px] text-ink-2">
          Each exhibit is a working build with a case study behind it: the business problem, what discovery found, the architecture, the demo, the tradeoffs, and how it was handed off.
        </p>
      </header>
      <Reveal className="mx-auto max-w-[1360px] px-[var(--gutter)] pb-20">
        <ol className="border-t-2 border-ink">
          {caseStudies.map((c, i) => (
            <li key={c.slug} className="border-b border-rule">
              <Link href={`/work/${c.slug}`} className="group grid grid-cols-1 gap-6 py-8 md:grid-cols-12 md:items-center">
                <div className="md:col-span-5" data-r="mask">
                  <ExhibitPlate src={c.cover.src} alt={c.cover.alt} sizes="(min-width:768px) 40vw, 100vw" />
                </div>
                <div className="md:col-span-6 md:col-start-7">
                  <h2 className="flex items-center gap-3 text-[clamp(28px,3.2vw,42px)] font-extrabold tracking-[-0.03em] group-hover:text-blue">
                    <span className="num text-ink-3">{letters[i]}</span>
                    {c.title} <Arrow className="size-6" />
                  </h2>
                  <p className="mt-1 text-[15px] text-ink-2">{c.kind}</p>
                  <p className="mt-3 max-w-[52ch] text-[17px] text-ink-2">{c.headline}</p>
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Status">
                    {c.status.map((s) => (
                      <li key={s.label}><Stamp tally={s.tally}>{s.label}</Stamp></li>
                    ))}
                  </ul>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Reveal>
    </>
  );
}
