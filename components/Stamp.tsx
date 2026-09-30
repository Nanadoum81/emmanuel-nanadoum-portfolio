import type { Tally } from "@/lib/site";

const styles: Record<Tally, string> = {
  live: "text-blue border-blue",
  preview: "text-green border-green",
  demo: "text-ink border-ink bg-yellow",
  inactive: "text-red border-red",
};

const words: Record<Tally, string> = {
  live: "Live",
  preview: "Preview",
  demo: "Demo data",
  inactive: "Not activated",
};

export function Stamp({ tally, children, className = "" }: { tally: Tally; children?: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 border-[1.5px] px-1.5 py-px text-[11.5px] font-bold uppercase leading-[1.5] tracking-[0.07em] ${styles[tally]} ${className}`}
    >
      {tally === "live" && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children ?? words[tally]}
    </span>
  );
}

export function StatusTable({ rows }: { rows: { label: string; tally: Tally; note: string }[] }) {
  return (
    <table className="w-full border-collapse text-[15px]">
      <caption className="sr-only">Status of each component</caption>
      <thead>
        <tr className="border-y border-rule-strong text-left text-[13px] text-ink-2">
          <th scope="col" className="py-2 pr-4 font-semibold">Component</th>
          <th scope="col" className="py-2 pr-4 font-semibold">Status</th>
          <th scope="col" className="hidden py-2 font-semibold sm:table-cell">Note</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-b border-rule align-top">
            <th scope="row" className="py-3 pr-4 text-left font-semibold">{r.label}</th>
            <td className="py-3 pr-4">
              <Stamp tally={r.tally} />
              <p className="mt-1.5 text-[14px] leading-snug text-ink-2 sm:hidden">{r.note}</p>
            </td>
            <td className="hidden py-3 text-ink-2 sm:table-cell">{r.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
