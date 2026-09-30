import { TrackLink } from "./TrackLink";

type Variant = "primary" | "secondary" | "quiet" | "inverse";

const base =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] px-4.5 text-[15px] font-semibold leading-none transition-[background-color,color,border-color,transform] duration-200 active:translate-y-px";

const variants: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-deep",
  secondary: "border border-ink text-ink hover:bg-ink hover:text-paper",
  quiet: "text-blue underline decoration-blue/40 underline-offset-4 hover:decoration-blue px-0",
  inverse: "bg-paper text-ink hover:bg-yellow",
};

export function Key({
  href,
  event,
  variant = "primary",
  children,
  className = "",
  data,
  download,
}: {
  href: string;
  event: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  data?: Record<string, string>;
  download?: boolean;
}) {
  return (
    <TrackLink href={href} event={event} data={data} className={`${base} ${variants[variant]} ${className}`} {...(download ? { download: "" } : {})}>
      {children}
    </TrackLink>
  );
}

export function Arrow({ dir = "right", className = "" }: { dir?: "right" | "down" | "out"; className?: string }) {
  const d =
    dir === "down" ? "M8 2v11M3.5 8.5 8 13l4.5-4.5" : dir === "out" ? "M5 11 11 5M6 5h5v5" : "M2 8h11M8.5 3.5 13 8l-4.5 4.5";
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={`size-4 shrink-0 transition-transform duration-200 ${dir === "right" ? "group-hover:translate-x-0.5" : dir === "out" ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-y-0.5"} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
      <path d={d} />
    </svg>
  );
}
