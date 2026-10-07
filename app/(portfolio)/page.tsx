import Image from "next/image";
import Link from "next/link";
import { person, mailto, runSheet, capabilities, patchBay, experience } from "@/lib/site";
import { caseStudies } from "@/lib/work";
import { demos } from "@/lib/demos";
import { BinderTabs } from "@/components/BinderTabs";
import { CoverMotion } from "@/components/motion/CoverMotion";
import { Reveal } from "@/components/motion/Reveal";
import { ExhibitPlate } from "@/components/Exhibit";
import { Key, Arrow } from "@/components/Key";
import { Stamp } from "@/components/Stamp";
import { Flow } from "@/components/Flow";
import { TrackLink } from "@/components/TrackLink";

const tabs = [
  { id: "cover", label: "Cover", color: "#111214", ink: "#fff" },
  { id: "method", label: "Method", color: "#2e7d4f", ink: "#fff" },
  { id: "exhibits", label: "Exhibits", color: "#1d3fcf", ink: "#fff" },
  { id: "lab", label: "Solution lab", color: "#f4e04d", ink: "#111214" },
  { id: "capabilities", label: "Capabilities", color: "#d9d8d2", ink: "#111214" },
  { id: "contact", label: "Sign-off", color: "#142c95", ink: "#fff" },
];

const insertion = "I turn business workflows into deployed AI systems, automations and integrations.";
const letters = ["A", "B", "C", "D"];

export default function Home() {
  const [vybe, cactus, palmer, blair] = caseStudies;
  return (
    <>
      <BinderTabs tabs={tabs} />

      {/* ─── Cover sheet ─────────────────────────────────────────── */}
      <section id="cover" aria-labelledby="cover-title" className="relative overflow-hidden">
        <CoverMotion className="mx-auto grid grid-cols-1 max-w-[1360px] gap-x-12 gap-y-12 px-[var(--gutter)] pb-16 pt-8 lg:grid-cols-12 lg:pb-24 lg:pt-10 lg:[@media(max-height:860px)]:pt-6">
          <div className="lg:col-span-6 xl:col-span-6">
            <table data-cover-meta className="w-full max-w-[560px] border-collapse text-[14.5px]">
              <caption className="sr-only">Document details</caption>
              <tbody>
                {[
                  ["Prepared for", "Hiring teams in AI, SaaS and automation"],
                  ["Prepared by", "Emmanuel Nanadoum · rev. October 2026"],
                  ["Based in", `${person.location} · ${person.availability}`],
                  ["Roles", "AI Implementation · Solutions Engineering · Automation"],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-rule first:border-t">
                    <th scope="row" className="w-[124px] py-1.5 pr-3 text-left align-top font-normal text-ink-2 lg:[@media(max-height:860px)]:py-1">{k}</th>
                    <td className="py-1.5 font-medium lg:[@media(max-height:860px)]:py-1">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h1 id="cover-title" className="mt-10 text-[clamp(52px,min(8.4vw,10.5vh),94px)] font-extrabold leading-[0.92] tracking-[-0.045em] lg:mt-9 lg:[@media(max-height:860px)]:mt-6">
              <span className="block overflow-hidden pb-[0.06em]"><span data-name-line className="block">Emmanuel</span></span>
              <span className="block overflow-hidden pb-[0.06em]"><span data-name-line className="block">Nanadoum</span></span>
            </h1>
            <p data-cover-role className="mt-5 lg:[@media(max-height:860px)]:mt-3 text-[clamp(21px,2.3vw,28px)] font-semibold leading-tight tracking-[-0.015em]">
              AI Consultant / Solutions Engineer
              <span className="mt-1 block text-[17px] font-normal tracking-normal text-ink-2">Sales Engineer · AI, CRM &amp; Automation</span>
            </p>

            <p className="mt-7 lg:[@media(max-height:860px)]:mt-5 max-w-[34ch] text-[clamp(20px,2vw,24px)] font-medium leading-[1.35] tracking-[-0.01em]">
              <del className="redline-del no-underline">
                <span className="sr-only">Not: </span>I make websites.
              </del>{" "}
              <ins className="redline-ins no-underline">
                <span className="sr-only">Instead: </span>
                {insertion.split(" ").map((w, i) => (
                  <span key={i} data-ins-word className="inline-block">
                    {w}&nbsp;
                  </span>
                ))}
              </ins>
            </p>
            <p className="mt-4 max-w-[52ch] text-[16px] text-ink-2">
              Discovery → requirements → architecture → working AI solution → implementation → enablement.
            </p>

            <div data-cover-keys className="mt-7 lg:[@media(max-height:860px)]:mt-5 flex flex-wrap items-center gap-3">
              <Key href={person.resume} event="resume_open" data={{ from: "cover" }}>
                Download résumé
                <Arrow dir="down" />
                <span className="sr-only">(PDF, opens in a new tab)</span>
              </Key>
              <Key href="#exhibits" event="view_work" data={{ from: "cover" }} variant="secondary">
                View the exhibits
              </Key>
              <Key href="/contact" event="contact_page" data={{ from: "cover" }} variant="quiet" className="ml-1">
                Contact
                <Arrow />
              </Key>
            </div>
          </div>

          {/* Attached exhibits */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative -mx-[var(--gutter)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 pt-8 [scrollbar-width:none] sm:mx-0 sm:block sm:h-[70vw] md:h-[68vw] sm:overflow-visible sm:px-0 sm:pb-0 sm:pt-0 lg:h-[520px] xl:h-[560px]">
              <Link href="/work/vybe" data-depth="4" className="w-[84%] shrink-0 snap-start sm:absolute sm:right-0 sm:top-8 sm:z-10 sm:w-[84%]">
                <div data-plate>
                  <ExhibitPlate letter="A" label="VYBE" src="/shots/vybe-d.jpg" alt={vybe.cover.alt} source="vybe-app-blue.vercel.app" priority sizes="(min-width:1024px) 42vw, 84vw" tabColor="bg-blue text-white" />
                </div>
              </Link>
              <Link href="/work/cactus" data-depth="10" className="w-[84%] shrink-0 snap-start sm:absolute sm:left-0 sm:top-[42%] sm:z-20 sm:w-[60%]">
                <div data-plate>
                  <ExhibitPlate letter="B" label="Cactus" src="/shots/cactus-rs-d.jpg" alt={cactus.cover.alt} source="blair-demo-cactus.vercel.app/revenue-system" priority sizes="(min-width:1024px) 32vw, 84vw" tabColor="bg-ink text-white" />
                </div>
              </Link>
              <Link href="/work/palmer-herman" data-depth="16" className="w-[84%] shrink-0 snap-start sm:absolute sm:bottom-0 sm:right-[3%] sm:z-30 sm:w-[46%]">
                <div data-plate>
                  <ExhibitPlate letter="C" label="Palmer & Herman" src="/shots/palmer-rs-pipeline.jpg" alt="Palmer & Herman 12-stage patient pipeline" source="blair-demo-palmer.vercel.app" sizes="(min-width:1024px) 26vw, 84vw" tabColor="bg-yellow text-ink" />
                </div>
              </Link>
            </div>

            <nav aria-label="Exhibit index" className="mt-10 sm:mt-12">
              <h2 className="text-[15px] font-bold">Exhibit index</h2>
              <ol className="mt-2 border-t border-ink">
                {caseStudies.map((c, i) => (
                  <li key={c.slug} data-index-row className="border-b border-rule">
                    <Link href={`/work/${c.slug}`} className="group flex min-h-12 items-center py-2 text-[15.5px] transition-colors hover:text-blue">
                      <span className="num w-7 shrink-0 font-semibold text-ink-3 group-hover:text-blue">{letters[i]}</span>
                      <span className="font-semibold">{c.title}</span>
                      <span className="ml-2 hidden text-ink-2 md:inline">— {c.kind}</span>
                      <span aria-hidden className="leader" />
                      <Arrow />
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </CoverMotion>
      </section>

      {/* ─── 1 Summary ─────────────────────────────────────────── */}
      <Reveal as="section" id="summary" className="border-t border-rule">
        <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-8 px-[var(--gutter)] py-16 lg:grid-cols-12 lg:py-24">
          <h2 className="text-[clamp(30px,3.6vw,46px)] lg:col-span-4">
            <span className="num mr-3 text-ink-3">1</span>Summary of qualifications
          </h2>
          <div className="lg:col-span-7 lg:col-start-6" data-r="rise">
            <p className="text-[clamp(19px,1.7vw,22px)] leading-[1.5]">
              {person.summary} I lead discovery, translate business pain into technical requirements, build the demonstration, explain integrations and tradeoffs, and guide customers from evaluation through implementation.
            </p>
            <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              <div className="border-t border-ink pt-3">
                <dt className="text-[14px] text-ink-2">Roles I am pursuing</dt>
                <dd className="mt-1 font-semibold">AI Implementation Specialist · Solutions Engineer · Implementation Consultant · AI Automation Specialist · Solutions Consultant</dd>
              </div>
              <div className="border-t border-ink pt-3">
                <dt className="text-[14px] text-ink-2">Where I add value</dt>
                <dd className="mt-1 font-semibold">The bridge between business problems and deployed AI: discovery, workflow mapping, integrations, validation, implementation and enablement.</dd>
              </div>
            </dl>
          </div>
        </div>
      </Reveal>

      {/* ─── 2 Method ─────────────────────────────────────────── */}
      <Reveal as="section" id="method" className="border-t border-rule bg-paper-2">
        <div className="mx-auto max-w-[1360px] px-[var(--gutter)] py-16 lg:py-24">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <h2 className="text-[clamp(30px,3.6vw,46px)] lg:col-span-5">
              <span className="num mr-3 text-ink-3">2</span>Method of engagement
            </h2>
            <p className="max-w-[52ch] text-ink-2 lg:col-span-6 lg:col-start-7 lg:pt-2">
              Every exhibit in this document moved through the same seven phases. The order matters: nothing gets built before the problem is written down, and nothing is called done until someone else can run it.
            </p>
          </div>
          <div className="relative mt-12">
            <div aria-hidden className="absolute bottom-0 left-[11px] top-0 w-px bg-rule-strong md:left-[15px]" />
            <div aria-hidden data-r="rule" className="absolute bottom-0 left-[11px] top-0 w-[2px] bg-green md:left-[15px]" />
            <ol data-r="rows">
              {runSheet.map((r, i) => (
                <li key={r.step} className="relative grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule py-5 pl-10 md:grid-cols-12 md:pl-14">
                  <span aria-hidden className="absolute left-[5px] top-[27px] size-[14px] border-2 border-green bg-paper-2 md:left-[9px]" />
                  <h3 className="text-[20px] font-bold tracking-[-0.01em] md:col-span-3">
                    <span className="num mr-2 text-[15px] font-semibold text-ink-3">2.{i + 1}</span>
                    {r.step}
                  </h3>
                  <p className="font-semibold md:col-span-3">{r.line}</p>
                  <p className="text-ink-2 md:col-span-6">{r.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Reveal>

      {/* ─── 3 Exhibits (divider) ─────────────────────────────── */}
      <section id="exhibits" aria-labelledby="exhibits-title">
        <div className="bg-blue text-white">
          <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-6 px-[var(--gutter)] py-16 lg:grid-cols-12 lg:py-20">
            <h2 id="exhibits-title" className="text-[clamp(56px,9vw,112px)] font-extrabold leading-[0.9] tracking-[-0.045em] lg:col-span-7">
              <span className="num mr-4 font-bold text-white/55">3</span>Exhibits
            </h2>
            <p className="max-w-[44ch] self-end text-[18px] text-white/85 lg:col-span-5">
              Four engagements, each attached as a working build you can open. Status is stamped plainly: <strong className="text-white">live</strong>, <strong className="text-white">demo data</strong>, or <strong className="text-white">not activated</strong>.
            </p>
          </div>
        </div>

        {/* Exhibit A — VYBE, in VYBE's own locked palette */}
        <Reveal className="bg-[#010409] text-[#f7fbff]">
          <div className="mx-auto max-w-[1360px] px-[var(--gutter)] py-16 lg:py-24">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <h3 className="flex items-center gap-4 text-[clamp(34px,4vw,54px)] font-extrabold tracking-[-0.035em]">
                  <span className="num text-[#9fb0c1]">A</span>
                  <Image src="/brand/vybe-mark.svg" alt="" width={44} height={44} className="rounded-[10px]" />
                  VYBE
                </h3>
                <p className="mt-3 text-[clamp(19px,1.6vw,22px)] leading-snug text-[#f7fbff]">{vybe.headline}</p>
                <p className="mt-5 text-[#a8b7c8]">{vybe.summary}</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Status">
                  <li><Stamp tally="live" className="border-[#16c8ff]! text-[#16c8ff]!">Site + VYBE Voice live</Stamp></li>
                                    <li><Stamp tally="inactive" className="border-[#ff8a7a]! text-[#ff8a7a]!">Route generation not activated</Stamp></li>
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <TrackLink href={vybe.links[0].href} event="vybe_voice_click" data={{ from: "home" }} className="group inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-[linear-gradient(100deg,#0b76c8,#5345c0)] px-5 text-[15px] font-semibold text-white shadow-[0_8px_30px_-8px_rgba(83,69,192,0.7)] transition-[filter] hover:brightness-110">
                    Try VYBE Voice <Arrow dir="out" />
                  </TrackLink>
                  <TrackLink href={vybe.links[1].href} event="vybe_site_click" data={{ from: "home" }} className="group inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-white/25 px-5 text-[15px] font-semibold hover:border-white/60">
                    Full product site <Arrow dir="out" />
                  </TrackLink>
                  <Link href="/work/vybe" className="group inline-flex min-h-11 items-center gap-2 px-1 text-[15px] font-semibold text-[#16c8ff] underline decoration-[#16c8ff]/40 underline-offset-4 hover:decoration-[#16c8ff]">
                    Read the case study <Arrow />
                  </Link>
                </div>
              </div>
              <div className="relative lg:col-span-7">
                <div data-r="mask" className="overflow-hidden rounded-[6px] border border-white/10">
                  <Image src="/shots/vybe-d.jpg" alt={vybe.cover.alt} width={2000} height={1250} sizes="(min-width:1024px) 56vw, 100vw" className="h-auto w-full" />
                </div>
                <div data-r="mask" className="absolute -bottom-10 -left-4 hidden w-[27%] overflow-hidden rounded-[18px] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:block lg:-left-10">
                  <Image src="/shots/vybe-voice-m.jpg" alt="VYBE Voice on a phone: A concierge that already knows the ride." width={780} height={1689} sizes="20vw" className="h-auto w-full" />
                </div>
              </div>
            </div>
            <div className="mt-20" data-r="rise">
              <Flow tone="vybe" steps={vybe.architecture.flows[0].steps} caption="Figure A.1 — VYBE Voice live path, as deployed. Provider keys stay server-side in Vercel Functions." />
            </div>
          </div>
        </Reveal>

        {/* Exhibit B — Cactus */}
        <Reveal className="border-b border-rule">
          <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-12 px-[var(--gutter)] py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-5 lg:pt-10">
              <h3 className="text-[clamp(32px,3.6vw,48px)] font-extrabold tracking-[-0.03em]"><span className="num mr-3 text-ink-3">B</span>{cactus.title}</h3>
              <p className="mt-3 text-[clamp(19px,1.6vw,22px)] leading-snug">{cactus.headline}</p>
              <p className="mt-5 text-ink-2">{cactus.summary}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Status">
                <li><Stamp tally="live">AI receptionist live</Stamp></li>
                <li><Stamp tally="live">Website live</Stamp></li>
                <li><Stamp tally="demo">Dashboards use sample data</Stamp></li>
              </ul>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Key href={cactus.links[0].href} event="demo_open_cactus_rs" data={{ from: "home" }}>Open the revenue system <Arrow dir="out" /></Key>
                <Key href="/receptionist?demo=1" event="receptionist_open" data={{ from: "home" }} variant="secondary">Talk to the AI receptionist</Key>
                <Key href="/work/cactus" event="case_open" data={{ slug: "cactus" }} variant="quiet">Read the case study <Arrow /></Key>
              </div>
            </div>
            <div className="relative lg:col-span-7">
              <div data-r="mask">
                <ExhibitPlate src="/shots/cactus-rs-journey.jpg" alt="Cactus revenue system: One connected patient journey across 13 steps." source="blair-demo-cactus.vercel.app/revenue-system" sizes="(min-width:1024px) 56vw, 100vw" />
              </div>
              <div data-r="mask" className="absolute -bottom-8 right-4 hidden w-[24%] sm:block">
                <ExhibitPlate src="/shots/cactus-m.jpg" alt="Cactus Chiropractic patient site on a phone." aspect="390/844" sizes="16vw" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Exhibit C — Palmer & Herman: reuse vs. customize */}
        <Reveal className="border-b border-rule bg-paper-2">
          <div className="mx-auto max-w-[1360px] px-[var(--gutter)] py-16 lg:py-24">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <h3 className="text-[clamp(32px,3.6vw,48px)] font-extrabold tracking-[-0.03em]"><span className="num mr-3 text-ink-3">C</span>{palmer.title}</h3>
                <p className="mt-3 text-[clamp(19px,1.6vw,22px)] leading-snug">{palmer.headline}</p>
              </div>
              <p className="text-ink-2 lg:col-span-5 lg:col-start-8 lg:pt-12">{palmer.summary}</p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="grid grid-cols-2 gap-3 lg:col-span-7">
                <figure data-r="mask">
                  <ExhibitPlate src="/shots/cactus-d.jpg" alt="Cactus Chiropractic site, Peoria AZ." aspect="4/3" sizes="(min-width:1024px) 28vw, 50vw" />
                  <figcaption className="mt-2 text-[13.5px] text-ink-2">Cactus · Peoria, AZ</figcaption>
                </figure>
                <figure data-r="mask">
                  <ExhibitPlate src="/shots/palmer-d.jpg" alt="Palmer & Herman Chiropractic site, Naugatuck CT." aspect="4/3" sizes="(min-width:1024px) 28vw, 50vw" />
                  <figcaption className="mt-2 text-[13.5px] text-ink-2">Palmer &amp; Herman · Naugatuck, CT</figcaption>
                </figure>
                <p className="col-span-2 text-[14.5px] text-ink-2">Same skeleton on purpose — both practices sell unhurried care. Everything a patient touches is the practice&apos;s own.</p>
              </div>
              <div className="lg:col-span-5">
                <table className="w-full border-collapse text-[15px]" data-r="rows">
                  <caption className="mb-2 text-left text-[15px] font-bold">Table C.1 — What is reused, what is customized</caption>
                  <thead>
                    <tr className="border-y border-ink text-left">
                      <th scope="col" className="w-1/2 py-2 pr-3 font-semibold">Reused (system logic)</th>
                      <th scope="col" className="py-2 font-semibold">Customized (the practice)</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {[
                      ["Capture → conversation → schedule → remind → review", "Stage names and tags, e.g. ph-website-lead"],
                      ["Reminder cadence: 24 h and 2 h", "Message copy in the practice's voice and number"],
                      ["Follow-up stop conditions", "Which modules are active at launch"],
                      ["Review rules: no incentives, no gating", "Reactivation run manually by staff"],
                      ["Pipeline pattern", "AI voice receptionist held for later"],
                    ].map(([a, b]) => (
                      <tr key={a} className="border-b border-rule">
                        <td className="py-2.5 pr-3">{a}</td>
                        <td className="py-2.5 text-blue">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Status">
                  <li><Stamp tally="live">Website and system live</Stamp></li>
                  <li><Stamp tally="demo">Simulator uses demo contacts</Stamp></li>
                  <li><Stamp tally="inactive">AI voice not yet activated</Stamp></li>
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Key href={palmer.links[0].href} event="demo_open_palmer_rs" data={{ from: "home" }}>Run the simulator <Arrow dir="out" /></Key>
                  <Key href="/work/palmer-herman" event="case_open" data={{ slug: "palmer-herman" }} variant="quiet">Read the case study <Arrow /></Key>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Exhibit D — Blair Digital Studios */}
        <Reveal className="border-b border-rule">
          <div className="mx-auto max-w-[1360px] px-[var(--gutter)] py-16 lg:py-24">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <h3 className="text-[clamp(32px,3.6vw,48px)] font-extrabold tracking-[-0.03em]"><span className="num mr-3 text-ink-3">D</span>{blair.title}</h3>
                <p className="mt-3 max-w-[38ch] text-[clamp(19px,1.6vw,22px)] leading-snug">{blair.headline}</p>
              </div>
              <div className="lg:col-span-5 lg:pt-12">
                <p className="text-ink-2">{blair.summary}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Key href={blair.links[0].href} event="demo_open_canham_rs" data={{ from: "home" }}>Open the Canham system <Arrow dir="out" /></Key>
                  <Key href="/work/blair-revenue-systems" event="case_open" data={{ slug: "blair-revenue-systems" }} variant="quiet">Read the case study <Arrow /></Key>
                </div>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {blair.demo.shots.map((s) => (
                <figure key={s.src} data-r="mask">
                  <ExhibitPlate src={s.src} alt={s.alt} aspect="16/11" sizes="(min-width:768px) 32vw, 100vw" />
                  <figcaption className="mt-2 text-[14px] text-ink-2">{s.caption}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-12 grid grid-cols-1 gap-x-10 border-t border-ink pt-5 md:grid-cols-12" data-r="rise">
              <h4 className="text-[17px] font-bold md:col-span-3">What a Blair system connects</h4>
              <p className="text-ink-2 md:col-span-9">
                AI receptionist and voice · lead capture and qualification · CRM automation and pipeline design · appointment booking · missed-call recovery · SMS / email nurture · review automation · reporting · websites wired to revenue workflows through APIs and webhooks.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── 4 Solution lab (divider) ─────────────────────────── */}
      <section id="lab" aria-labelledby="lab-title">
        <div className="bg-yellow">
          <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-6 px-[var(--gutter)] py-14 lg:grid-cols-12 lg:py-16">
            <h2 id="lab-title" className="text-[clamp(44px,6.6vw,84px)] font-extrabold leading-[0.92] tracking-[-0.04em] lg:col-span-7">
              <span className="num mr-4 font-bold text-ink/45">4</span>Client solution lab
            </h2>
            <div className="self-end lg:col-span-5">
              <p className="max-w-[44ch] text-[17px]">Six live demos built for prospective Blair Digital Studios clients from public information. Each has its own page a practice owner can open directly.</p>
              <Key href="/solutions" event="solution_lab_click" data={{ from: "home" }} variant="secondary" className="mt-5">Open the client lab <Arrow /></Key>
            </div>
          </div>
        </div>
        <Reveal className="mx-auto max-w-[1360px] px-[var(--gutter)] py-12 lg:py-16">
          <table className="block w-full border-collapse lg:table">
            <caption className="sr-only">Client builds</caption>
            <thead className="hidden lg:table-header-group">
              <tr className="border-y border-ink text-left text-[14px]">
                <th scope="col" className="w-[168px] py-2 font-semibold">Preview</th>
                <th scope="col" className="py-2 pl-5 font-semibold">Business</th>
                <th scope="col" className="py-2 pl-5 font-semibold">What it solves</th>
                <th scope="col" className="py-2 pl-5 font-semibold">Status</th>
                <th scope="col" className="py-2 pl-5 text-right font-semibold">Open</th>
              </tr>
            </thead>
            <tbody data-r="rows" className="block lg:table-row-group">
              {demos.map((d) => (
                <tr key={d.slug} className="grid grid-cols-[112px_1fr] gap-x-4 gap-y-2 border-b border-rule py-4 lg:table-row lg:py-0">
                  <td className="row-span-3 lg:py-4">
                    <div className="relative aspect-[16/10] w-[112px] overflow-hidden border border-rule bg-paper-2 lg:w-[168px]">
                      <Image src={d.desktop} alt="" fill sizes="168px" className="object-cover object-top" />
                    </div>
                  </td>
                  <th scope="row" className="text-left align-top lg:py-4 lg:pl-5">
                    <span className="flex items-center gap-2">
                      <span aria-hidden className="size-2.5 shrink-0" style={{ background: d.accent }} />
                      <span className="font-bold">{d.name}</span>
                    </span>
                    <span className="block text-[14px] font-normal text-ink-2">{d.location}</span>
                  </th>
                  <td className="col-start-2 max-w-[46ch] align-top text-[15px] text-ink-2 lg:py-4 lg:pl-5">{d.solves}</td>
                  <td className="col-start-2 align-top lg:py-4 lg:pl-5">
                    <ul className="flex flex-wrap gap-1.5 lg:flex-col lg:items-start">
                      {d.status.map((s) => (
                        <li key={s.label}><Stamp tally={s.tally}>{s.label}</Stamp></li>
                      ))}
                    </ul>
                  </td>
                  <td className="col-span-2 align-top lg:py-4 lg:pl-5 lg:text-right">
                    <span className="flex flex-wrap gap-x-4 gap-y-1 lg:flex-col lg:items-end">
                      <TrackLink href={d.system ?? d.site} event="demo_open" data={{ slug: d.slug, from: "home_lab" }} className="doc-link group inline-flex min-h-8 items-center gap-1 whitespace-nowrap font-semibold">
                        {d.system ? "Revenue system" : "Open site"} <Arrow dir="out" className="size-3.5" />
                      </TrackLink>
                      {d.system && (
                        <TrackLink href={d.site} event="demo_open" data={{ slug: d.slug, from: "home_lab_site" }} className="doc-link group inline-flex min-h-8 items-center gap-1 whitespace-nowrap">
                          Website <Arrow dir="out" className="size-3.5" />
                        </TrackLink>
                      )}
                      <Link href={`/solutions/${d.slug}`} className="doc-link inline-flex min-h-8 items-center text-ink-2">Client page</Link>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      {/* ─── 5 Capabilities ─────────────────────────────────────── */}
      <Reveal as="section" id="capabilities" className="border-t border-rule bg-paper-2">
        <div className="mx-auto max-w-[1360px] px-[var(--gutter)] py-16 lg:py-24">
          <h2 className="text-[clamp(30px,3.6vw,46px)]">
            <span className="num mr-3 text-ink-3">5</span>Schedule of capabilities
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" data-r="rows">
            {capabilities.map((g) => (
              <div key={g.group} className="border-t-2 border-ink pt-3">
                <h3 className="text-[17px] font-bold tracking-normal">{g.group}</h3>
                <ul className="mt-3 grid gap-1.5 text-[15.5px] text-ink-2">
                  {g.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="text-[22px] font-bold">Integration register</h3>
              <p className="mt-2 text-ink-2">Only connections that exist in the live builds.</p>
            </div>
            <table className="w-full border-collapse text-[15px] lg:col-span-8">
              <caption className="sr-only">Integrations by build</caption>
              <thead>
                <tr className="border-y border-ink text-left">
                  <th scope="col" className="py-2 pr-4 font-semibold">Build</th>
                  <th scope="col" className="py-2 font-semibold">Connected to</th>
                </tr>
              </thead>
              <tbody>
                {patchBay.map((p) => (
                  <tr key={p.source} className="border-b border-rule align-top">
                    <th scope="row" className="py-3 pr-4 text-left font-semibold">{p.source}</th>
                    <td className="py-3 text-ink-2">{p.targets.join(" · ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* ─── 6 Experience ─────────────────────────────────────── */}
      <Reveal as="section" id="experience" className="border-t border-rule">
        <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-8 px-[var(--gutter)] py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-4">
            <h2 className="text-[clamp(30px,3.6vw,46px)]">
              <span className="num mr-3 text-ink-3">6</span>Experience
            </h2>
            <Link href="/about" className="doc-link group mt-4 inline-flex items-center gap-1.5">Full experience and education <Arrow /></Link>
          </div>
          <ol className="lg:col-span-8" data-r="rows">
            {experience.map((e) => (
              <li key={e.org} className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-rule py-5 first:border-t first:border-t-ink sm:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="text-[19px] font-bold tracking-[-0.01em]">{e.role}</h3>
                  <p className="text-ink-2">{e.org} · {e.where}</p>
                </div>
                <p className="num text-[15px] font-semibold sm:text-right">{e.when}</p>
                <p className="mt-2 max-w-[70ch] text-[15.5px] text-ink-2 sm:col-span-2">{e.points[0]}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* ─── 7 Sign-off ─────────────────────────────────────── */}
      <section id="contact" aria-labelledby="contact-title" className="bg-ink text-paper">
        <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-12 px-[var(--gutter)] py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-6">
            <h2 id="contact-title" className="text-[clamp(44px,6.2vw,80px)] font-extrabold leading-[0.95] tracking-[-0.04em]">
              <span className="num mr-4 font-bold text-white/40">7</span>Sign-off
            </h2>
            <p className="mt-6 max-w-[40ch] text-[19px] text-white/80">
              If your team needs someone who can translate business workflows into working AI solutions and carry them through implementation and enablement, the next step is a conversation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Key href={mailto("Discuss a role")} event="contact_email" data={{ from: "signoff" }} variant="inverse">Discuss a role <Arrow /></Key>
              <Key href={person.resume} event="resume_open" data={{ from: "signoff" }} variant="primary">Download résumé <Arrow dir="down" /></Key>
            </div>
          </div>
          <div className="lg:col-span-6">
            <dl className="border-t border-white/30 text-[18px]">
              {[
                { k: "Email", v: person.email, href: mailto(), ev: "contact_email" },
                { k: "Phone", v: person.phone, href: person.phoneHref, ev: "contact_phone" },
                { k: "LinkedIn", v: "in/emmanuel-nanadoum-7971b7a8", href: person.linkedin, ev: "contact_linkedin" },
                { k: "Résumé", v: "PDF, one page", href: person.resume, ev: "resume_open" },
              ].map((r) => (
                <div key={r.k} className="grid grid-cols-[96px_1fr] items-center border-b border-white/15 py-3.5 sm:grid-cols-[120px_1fr]">
                  <dt className="text-[14px] text-white/60">{r.k}</dt>
                  <dd className="min-w-0">
                    <TrackLink href={r.href} event={r.ev} data={{ from: "signoff_table" }} className="break-words font-semibold underline decoration-white/30 underline-offset-4 hover:decoration-yellow">
                      {r.v}
                    </TrackLink>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 grid grid-cols-2 gap-6 text-[14px] text-white/60">
              <div>
                <p className="border-b border-white/40 pb-2 text-[17px] font-semibold text-paper">Emmanuel Nanadoum</p>
                <p className="mt-1.5">Prepared by · {person.location}</p>
              </div>
              <div>
                <p aria-hidden className="border-b border-dashed border-white/40 pb-2 text-[17px]">&nbsp;</p>
                <p className="mt-1.5">Accepted by · your team</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
