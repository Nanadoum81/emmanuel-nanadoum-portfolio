import type { Metadata } from "next";
import { person } from "@/lib/site";
import { Key, Arrow } from "@/components/Key";
import { TrackLink } from "@/components/TrackLink";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Résumé of Emmanuel Nanadoum — Solutions Engineer, Sales Engineer, AI, CRM & Automation. PDF and Word versions.",
  alternates: { canonical: "/resume" },
};

export default function Resume() {
  return (
    <section className="mx-auto max-w-[1100px] px-[var(--gutter)] pb-24 pt-12 lg:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[clamp(44px,6vw,80px)] font-extrabold leading-[0.92] tracking-[-0.045em]">Résumé</h1>
          <p className="mt-4 max-w-[56ch] text-ink-2">{person.summary}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <TrackLink
            href={person.resume}
            event="resume_download"
            data={{ from: "resume_page" }}
            download="Emmanuel_Nanadoum_Solutions_Engineer_Resume.pdf"
            className="group inline-flex min-h-11 items-center gap-2 rounded-[2px] bg-blue px-4.5 text-[15px] font-semibold text-white hover:bg-blue-deep"
          >
            Download PDF <Arrow dir="down" />
          </TrackLink>
          <TrackLink
            href={person.resume.replace(".pdf", ".docx")}
            event="resume_download_docx"
            data={{ from: "resume_page" }}
            download="Emmanuel_Nanadoum_Solutions_Engineer_Resume.docx"
            className="group inline-flex min-h-11 items-center gap-2 rounded-[2px] border border-ink px-4.5 text-[15px] font-semibold hover:bg-ink hover:text-paper"
          >
            Word (.docx) <Arrow dir="down" />
          </TrackLink>
          <Key href={person.resume} event="resume_open" data={{ from: "resume_page" }} variant="quiet">Open in new tab <Arrow dir="out" /></Key>
        </div>
      </div>
      <div className="mt-10 border border-rule bg-paper-2 shadow-[0_18px_40px_-24px_rgba(17,18,20,0.35)]">
        <object data={`${person.resume}#view=FitH`} type="application/pdf" className="block h-[min(1100px,130vw)] w-full" aria-label="Résumé PDF">
          <div className="p-8">
            <p>Your browser can&apos;t display the PDF inline.</p>
            <a className="doc-link" href={person.resume}>Open the résumé PDF</a>
          </div>
        </object>
      </div>
    </section>
  );
}
