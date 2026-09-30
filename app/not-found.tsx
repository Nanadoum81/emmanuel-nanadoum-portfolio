import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-[100dvh] max-w-[1360px] flex-col justify-center px-[var(--gutter)] py-20">
      <p className="num text-[15px] font-semibold text-ink-3">Page 404</p>
      <h1 className="mt-4 text-[clamp(48px,8vw,104px)] font-extrabold leading-[0.95] tracking-[-0.045em]">
        <span className="redline-del">This page</span> <span className="redline-ins">isn&apos;t in the document.</span>
      </h1>
      <p className="mt-6 max-w-[48ch] text-[19px] text-ink-2">The link may be out of date. Everything else is one step away.</p>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[17px] font-semibold">
        <li><Link className="doc-link" href="/">Cover</Link></li>
        <li><Link className="doc-link" href="/work">Exhibits</Link></li>
        <li><Link className="doc-link" href="/solutions">Client solution lab</Link></li>
        <li><Link className="doc-link" href="/contact">Contact</Link></li>
      </ul>
    </main>
  );
}
