import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { demos, getDemo } from "@/lib/demos";
import { person } from "@/lib/site";
import { Stamp } from "@/components/Stamp";
import { Arrow } from "@/components/Key";
import { TrackLink } from "@/components/TrackLink";
import { Reveal } from "@/components/motion/Reveal";

export function generateStaticParams() {
  return demos.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDemo(slug);
  if (!d) return {};
  return {
    title: `${d.name} — live demo · Blair Digital Studios`,
    description: d.solves,
    robots: { index: false, follow: true },
    alternates: { canonical: `/solutions/${d.slug}` },
    openGraph: { title: `${d.name} — your live demo`, description: d.solves, images: [{ url: d.desktop, width: 2000, height: 1250, alt: `${d.name} website` }] },
  };
}

export default async function ClientDemo({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDemo(slug);
  if (!d) notFound();
  const primary = d.system ?? d.site;
  const walkthrough = `mailto:${person.email}?subject=${encodeURIComponent(`${d.name} — demo walkthrough`)}`;

  return (
    <>
      <div className="h-2" style={{ background: d.accent }} aria-hidden />
      <section className="mx-auto grid grid-cols-1 max-w-[1360px] gap-10 px-[var(--gutter)] pb-14 pt-10 lg:grid-cols-12 lg:pt-14">
        <div className="lg:col-span-6">
          <table className="w-full max-w-[520px] border-collapse text-[14.5px]">
            <caption className="sr-only">Demo details</caption>
            <tbody>
              {[
                ["Prepared for", d.name],
                ["Location", d.location],
                ["Prepared by", "Blair Digital Studios"],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-rule first:border-t">
                  <th scope="row" className="w-[120px] py-1.5 pr-3 text-left font-normal text-ink-2">{k}</th>
                  <td className="py-1.5 font-medium">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h1 className="mt-10 text-[clamp(40px,5.6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.04em]">{d.name}</h1>
          <p className="mt-5 max-w-[34ch] text-[clamp(20px,2vw,25px)] font-medium leading-[1.35] tracking-[-0.01em]">{d.solves}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Status">
            {d.status.map((s) => (
              <li key={s.label}><Stamp tally={s.tally}>{s.label}</Stamp></li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <TrackLink
              href={primary}
              event="client_demo_open"
              data={{ slug: d.slug }}
              style={{ background: d.accent, color: d.accentInk }}
              className="group inline-flex min-h-12 items-center gap-2 rounded-[2px] px-5 text-[16px] font-semibold transition-[filter] hover:brightness-110"
            >
              {d.system ? "Open your revenue system" : "Open your website"} <Arrow dir="out" />
            </TrackLink>
            {d.system && (
              <TrackLink href={d.site} event="client_site_open" data={{ slug: d.slug }} className="group inline-flex min-h-12 items-center gap-2 rounded-[2px] border border-ink px-5 text-[16px] font-semibold hover:bg-ink hover:text-paper">
                Patient website <Arrow dir="out" />
              </TrackLink>
            )}
          </div>
        </div>
        <Reveal className="relative lg:col-span-6">
          <div data-r="mask" className="border border-rule bg-paper-2 shadow-[0_24px_50px_-28px_rgba(17,18,20,0.45)]">
            <div className="relative aspect-[16/10]">
              <Image src={d.systemShot ?? d.desktop} alt={`${d.name} ${d.system ? "revenue system" : "website"}`} fill priority sizes="(min-width:1024px) 48vw, 100vw" className="object-cover object-top" />
            </div>
          </div>
          <div data-r="mask" className="absolute -bottom-8 -left-3 w-[26%] overflow-hidden rounded-[14px] border-4 border-ink bg-ink shadow-[0_20px_40px_-16px_rgba(17,18,20,0.55)] sm:-left-6">
            <div className="relative aspect-[390/844]">
              <Image src={d.mobile} alt={`${d.name} on a phone`} fill sizes="160px" className="object-cover object-top" />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-rule bg-paper-2">
        <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-10 px-[var(--gutter)] py-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-[clamp(28px,3vw,40px)]">What you can try</h2>
            <ol className="mt-6 grid gap-5">
              {d.detail.map((x, i) => (
                <li key={x} className="grid grid-cols-[40px_1fr] text-[17px]">
                  <span className="num font-bold" style={{ color: d.accent === "#E47F19" ? "#A85A0C" : d.accent }}>{i + 1}.</span>
                  <span>{x}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-[clamp(28px,3vw,40px)]">What&apos;s included</h2>
            <ul className="mt-6 grid grid-cols-1 gap-x-6 border-t-2 border-ink sm:grid-cols-2">
              {d.capabilities.map((c) => (
                <li key={c} className="border-b border-rule py-3 text-[16px] font-medium">{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {d.system && (
        <Reveal className="mx-auto grid grid-cols-1 max-w-[1360px] gap-8 px-[var(--gutter)] py-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-[clamp(28px,3vw,40px)]">Your patient website</h2>
            <p className="mt-3 text-ink-2">The site patients see, in your own brand. The revenue system runs behind it.</p>
            <TrackLink href={d.site} event="client_site_open" data={{ slug: d.slug, from: "site_section" }} className="doc-link group mt-4 inline-flex min-h-11 items-center gap-1 font-semibold">
              Open the website <Arrow dir="out" className="size-3.5" />
            </TrackLink>
          </div>
          <div className="lg:col-span-8" data-r="mask">
            <div className="relative aspect-[16/10] overflow-hidden border border-rule">
              <Image src={d.desktop} alt={`${d.name} patient website`} fill sizes="(min-width:1024px) 64vw, 100vw" className="object-cover object-top" />
            </div>
          </div>
        </Reveal>
      )}

      <section className="bg-ink text-paper">
        <div className="mx-auto grid grid-cols-1 max-w-[1360px] gap-8 px-[var(--gutter)] py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <h2 className="text-[clamp(32px,4vw,54px)] font-extrabold leading-[1] tracking-[-0.035em]">Next step: a walkthrough.</h2>
            <p className="mt-4 max-w-[46ch] text-[18px] text-white/80">
              We&apos;ll walk through the demo together, confirm what matches how your office works, and scope what goes live first.
            </p>
          </div>
          <div className="flex flex-col gap-3 self-end lg:col-span-5 lg:items-end">
            <TrackLink href={walkthrough} event="client_book" data={{ slug: d.slug }} className="group inline-flex min-h-12 items-center gap-2 rounded-[2px] bg-paper px-5 text-[16px] font-semibold text-ink hover:bg-yellow">
              Request a walkthrough <Arrow />
            </TrackLink>
            <p className="text-[15px] text-white/70">
              or <TrackLink href={`mailto:${person.email}?subject=${encodeURIComponent(`${d.name} — demo`)}`} event="client_email" data={{ slug: d.slug }} className="underline underline-offset-4 hover:text-yellow">{person.email}</TrackLink> ·{" "}
              <TrackLink href={person.phoneHref} event="client_phone" data={{ slug: d.slug }} className="underline underline-offset-4 hover:text-yellow">{person.phone}</TrackLink>
            </p>
          </div>
        </div>
      </section>
      <p className="mx-auto max-w-[1360px] px-[var(--gutter)] py-6 text-[14px] text-ink-2">
        <Link href="/solutions" className="doc-link">See every live demo</Link>
      </p>
    </>
  );
}
