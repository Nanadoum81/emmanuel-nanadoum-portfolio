"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="mx-auto flex min-h-[70dvh] max-w-[1360px] flex-col justify-center px-[var(--gutter)] py-20">
      <h1 className="text-[clamp(40px,6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.04em]">Something didn&apos;t load.</h1>
      <p className="mt-5 max-w-[48ch] text-[19px] text-ink-2">Try again, or go straight to the résumé and contact details.</p>
      <div className="mt-8 flex flex-wrap gap-4 text-[17px] font-semibold">
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center rounded-[2px] bg-blue px-4.5 text-white hover:bg-blue-deep">
          Try again
        </button>
        <a className="doc-link inline-flex min-h-11 items-center" href="/Emmanuel_Nanadoum_Sales_Engineer_Resume.pdf">Résumé (PDF)</a>
        <Link className="doc-link inline-flex min-h-11 items-center" href="/contact">Contact</Link>
      </div>
    </main>
  );
}
