import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCase } from "@/lib/work";
import { person } from "@/lib/site";
import { StatusTable } from "@/components/Stamp";
import { Key, Arrow } from "@/components/Key";
import { Flow } from "@/components/Flow";
import { ExhibitPlate } from "@/components/Exhibit";
import { CaseRail } from "@/components/CaseRail";
import { Reveal } from "@/components/motion/Reveal";
import { TrackLink } from "@/components/TrackLink";

const letters = ["A", "B", "C", "D"];

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return {
    title: `${c.title} — ${c.kind}`,
    description: c.summary,
    alternates: { canonical: `/work/${c.slug}` },
    openGraph: { title: `${c.title} — ${c.kind} · Emmanuel Nanadoum`, description: c.summary, images: [{ url: c.cover.src, width: 2000, height: 1250, alt: c.cover.alt }] },
  };
}

const sections = [
  { id: "problem", label: "Business problem" },
  { id: "discovery", label: "Discovery" },
  { id: "requirements", label: "Requirements" },
  { id: "architecture", label: "Solution architecture" },
  { id: "demo", label: "Demo / POC" },
  { id: "technologies", label: "Technologies" },
  { id: "integrations", label: "Integration points" },
  { id: "tradeoffs", label: "Tradeoffs" },
  { id: "handoff", label: "Implementation & handoff" },
  { id: "demonstrates", label: "What this demonstrates" },
];

function Section({ id, n, title, children }: { id: string; n: number; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-rule py-12 first:border-t-0 first:pt-0 lg:py-14">
      <h2 id={`${id}-h`} className="text-[clamp(26px,2.6vw,34px)]">
        <span className="num mr-3 text-ink-3">{n}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();
  const i = caseStudies.indexOf(c);
  const letter = letters[i];
  const next = getCase(c.next)!;
  const isVybe = c.slug === "vybe";

  const headBand = isVybe ? "bg-[#010409] text-[#f7fbff]" : "bg-paper";
  const sub = isVybe ? "text-[#a8b7c8]" : "text-ink-2";
  const rule = isVybe ? "border-white/15" : "border-rule";

  return (
    <article>
      <header className={headBand}>
        <div className="mx-auto max-w-[1360px] px-[var(--gutter)] pb-14 pt-8 lg:pb-20">
          <nav aria-label="Breadcrumb" className={`text-[14px] ${sub}`}>
            <Link href="/work" className="hover:underline">Exhibits</Link>
            <span aria-hidden className="mx-2">/</span>
            <span aria-current="page">Exhibit {letter}</span>
          </nav>
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className={`num flex items-center gap-3 text-[15px] font-semibold ${sub}`}>
                {isVybe && <Image src="/brand/vybe-mark.svg" alt="" width={36} height={36} className="rounded-[8px]" />}
                Exhibit {letter} · {c.kind}
              </p>
              <h1 className="mt-4 text-[clamp(44px,6.4vw,84px)] font-extrabold leading-[0.95] tracking-[-0.04em]">{c.title}</h1>
              <p className="mt-5 max-w-[30ch] text-[clamp(21px,2.1vw,27px)] font-medium leading-[1.3] tracking-[-0.01em]">{c.headline}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {c.links.map((l) =>
                  isVybe ? (
                    <TrackLink
                      key={l.href}
                      href={l.href}
                      event={l.event}
                      data={{ from: "case_header" }}
                      className={`group inline-flex min-h-11 items-center gap-2 rounded-[10px] px-5 text-[15px] font-semibold ${l.primary ? "bg-[linear-gradient(100deg,#0b76c8,#5345c0)] text-white shadow-[0_8px_30px_-8px_rgba(83,69,192,0.7)] hover:brightness-110" : "border border-white/25 hover:border-white/60"}`}
                    >
                      {l.label} <Arrow dir="out" />
                    </TrackLink>
                  ) : (
                    <Key key={l.href} href={l.href} event={l.event} data={{ from: "case_header" }} variant={l.primary ? "primary" : "secondary"}>
                      {l.label} <Arrow dir={l.href.startsWith("/") ? "right" : "out"} />
                    </Key>
                  )
                )}
              </div>
            </div>
            <dl className={`self-end border-t text-[15px] lg:col-span-5 ${isVybe ? "border-white/40" : "border-ink"}`}>
              {[
                ["Client", c.client],
                ["Engagement", c.kind],
                ["My role", c.role],
                ["Source", c.source],
              ].map(([k, v]) => (
                <div key={k} className={`grid grid-cols-[112px_1fr] gap-3 border-b py-2.5 ${rule}`}>
                  <dt className={sub}>{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <Reveal className={isVybe ? "bg-[linear-gradient(#010409_50%,var(--color-paper)_50%)]" : ""}>
        <div className="mx-auto max-w-[1360px] px-[var(--gutter)]">
          <div data-r="mask">
            <ExhibitPlate src={c.cover.src} alt={c.cover.alt} source={c.source} priority sizes="(min-width:1360px) 1300px, 100vw" aspect="16/9" />
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-[1360px] px-[var(--gutter)] pt-14">
        <h2 className="text-[20px] font-bold">Status at time of writing</h2>
        <p className="mt-1 text-[15px] text-ink-2">Stamped from the live build, not from the plan.</p>
        <div className="mt-4 max-w-[980px]">
          <StatusTable rows={c.status} />
        </div>
      </div>

      <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-12 px-[var(--gutter)] py-16 lg:grid-cols-12 lg:py-20">
        <aside className="hidden lg:col-span-3 lg:block">
          <CaseRail items={sections} />
        </aside>
        <div className="min-w-0 lg:col-span-9 xl:col-span-8">
          <Section id="problem" n={1} title="Business problem">
            <div className="grid max-w-[68ch] gap-4 text-[18px] leading-[1.6]">
              {c.problem.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Section>

          <Section id="discovery" n={2} title="Discovery">
            <ol className="grid max-w-[70ch] gap-4">
              {c.discovery.map((d, k) => (
                <li key={d} className="grid grid-cols-[40px_1fr] text-[17px]">
                  <span className="num font-semibold text-ink-3">2.{k + 1}</span>
                  <span>{d}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="requirements" n={3} title="Requirements">
            <table className="w-full border-collapse text-[16px]">
              <caption className="sr-only">Requirements</caption>
              <tbody>
                {c.requirements.map((r, k) => (
                  <tr key={r} className="border-b border-rule align-top first:border-t first:border-t-ink">
                    <th scope="row" className="num w-[64px] py-3 text-left font-semibold text-ink-3">R-{String(k + 1).padStart(2, "0")}</th>
                    <td className="py-3">{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section id="architecture" n={4} title="Solution architecture">
            <p className="max-w-[68ch] text-[17px]">{c.architecture.intro}</p>
            <div className="mt-8 grid gap-10">
              {c.architecture.flows.map((f, k) => (
                <div key={f.title}>
                  <h3 className="mb-4 text-[18px] font-bold tracking-normal">{f.title}</h3>
                  <Flow steps={f.steps} tone={isVybe ? "vybe" : "paper"} dense={f.steps.length > 7} caption={`Figure 4.${k + 1} — ${f.title}`} captionClassName="text-ink-2" />
                </div>
              ))}
            </div>
          </Section>

          <Section id="demo" n={5} title="Demo / POC">
            <p className="max-w-[68ch] text-[17px]">{c.demo.intro}</p>
            <Reveal className="mt-8 grid gap-10">
              {c.demo.shots.map((s, k) => (
                <figure key={s.src}>
                  <div data-r="mask">
                    <ExhibitPlate src={s.src} alt={s.alt} sizes="(min-width:1024px) 60vw, 100vw" />
                  </div>
                  {s.caption && (
                    <figcaption className="mt-2.5 text-[14.5px] text-ink-2">
                      <span className="num font-semibold text-ink">Figure 5.{k + 1}</span> — {s.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </Reveal>
            <div className="mt-8 flex flex-wrap gap-3">
              {c.links.filter((l) => !l.href.startsWith("/")).map((l) => (
                <Key key={l.href} href={l.href} event={l.event} data={{ from: "case_demo" }} variant={l.primary ? "primary" : "secondary"}>
                  {l.label} <Arrow dir="out" />
                </Key>
              ))}
            </div>
          </Section>

          <Section id="technologies" n={6} title="Technologies">
            <ul className="flex max-w-[70ch] flex-wrap gap-x-2 gap-y-2 text-[16px]">
              {c.technologies.map((t, k) => (
                <li key={t} className="after:ml-2 after:text-ink-3 after:content-['·'] last:after:content-none">
                  {t}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="integrations" n={7} title="Integration points">
            <table className="w-full border-collapse text-[15.5px]">
              <caption className="sr-only">Integration points</caption>
              <thead>
                <tr className="border-y border-ink text-left">
                  <th scope="col" className="py-2 pr-4 font-semibold">From</th>
                  <th scope="col" className="py-2 pr-4 font-semibold">To</th>
                  <th scope="col" className="hidden py-2 font-semibold sm:table-cell">Detail</th>
                </tr>
              </thead>
              <tbody>
                {c.integrations.map((r) => (
                  <tr key={r.from + r.to} className="border-b border-rule align-top">
                    <td className="py-3 pr-4 font-semibold">{r.from}</td>
                    <td className="py-3 pr-4">
                      {r.to}
                      <span className="mt-1 block text-[14px] text-ink-2 sm:hidden">{r.note}</span>
                    </td>
                    <td className="hidden py-3 text-ink-2 sm:table-cell">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section id="tradeoffs" n={8} title="Tradeoffs">
            <table className="w-full border-collapse text-[15.5px]">
              <caption className="sr-only">Design decisions and tradeoffs</caption>
              <thead className="hidden md:table-header-group">
                <tr className="border-y border-ink text-left">
                  <th scope="col" className="w-[28%] py-2 pr-4 font-semibold">Decision</th>
                  <th scope="col" className="w-[24%] py-2 pr-4 font-semibold">Instead of</th>
                  <th scope="col" className="py-2 font-semibold">Why</th>
                </tr>
              </thead>
              <tbody>
                {c.tradeoffs.map((t) => (
                  <tr key={t.choice} className="grid border-b border-rule py-3 align-top first:border-t first:border-t-ink md:table-row md:py-0 md:first:border-t-rule">
                    <th scope="row" className="text-left font-semibold md:py-3 md:pr-4">{t.choice}</th>
                    <td className="text-red md:py-3 md:pr-4">
                      <span className="sr-only">Instead of: </span>
                      <span className="line-through decoration-red/70">{t.over}</span>
                    </td>
                    <td className="mt-1 text-ink-2 md:mt-0 md:py-3">{t.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section id="handoff" n={9} title="Implementation & handoff">
            <ul className="grid max-w-[70ch] gap-3 text-[17px]">
              {c.handoff.map((h) => (
                <li key={h} className="grid grid-cols-[22px_1fr]">
                  <span aria-hidden className="mt-[0.55em] size-2 bg-green" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="demonstrates" n={10} title="What this demonstrates">
            <ol className="grid gap-0 border-t-2 border-ink">
              {c.demonstrates.map((d, k) => (
                <li key={d} className="grid grid-cols-[48px_1fr] border-b border-rule py-4 text-[clamp(18px,1.6vw,21px)] font-semibold leading-snug tracking-[-0.01em]">
                  <span className="num text-blue">{k + 1}.</span>
                  <span>{d}</span>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </div>

      <nav aria-label="Next exhibit" className="border-t border-rule bg-paper-2">
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-6 px-[var(--gutter)] py-12">
          <Link href={`/work/${next.slug}`} className="group">
            <span className="text-[14px] text-ink-2">Next · Exhibit {letters[caseStudies.indexOf(next)]}</span>
            <span className="mt-1 flex items-center gap-3 text-[clamp(26px,3vw,40px)] font-extrabold tracking-[-0.03em] group-hover:text-blue">
              {next.title} <Arrow className="size-6" />
            </span>
          </Link>
          <div className="flex flex-wrap gap-3">
            <Key href={person.resume} event="resume_open" data={{ from: `case_${c.slug}` }}>Download résumé <Arrow dir="down" /></Key>
            <Key href="/contact" event="contact_page" data={{ from: `case_${c.slug}` }} variant="secondary">Discuss a role</Key>
          </div>
        </div>
      </nav>
    </article>
  );
}
