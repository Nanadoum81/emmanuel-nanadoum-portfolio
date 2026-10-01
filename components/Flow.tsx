type Step = { label: string; note?: string };

const tones = {
  paper: { box: "border-ink bg-paper text-ink", note: "text-ink-2", arrow: "text-ink-3", num: "text-ink-3" },
  vybe: { box: "border-[#16c8ff]/50 bg-[#07101a] text-[#f7fbff]", note: "text-[#a8b7c8]", arrow: "text-[#16c8ff]", num: "text-[#16c8ff]" },
  blue: { box: "border-white/40 bg-white/[0.06] text-white", note: "text-white/75", arrow: "text-white/60", num: "text-white/60" },
};

/**
 * An architecture figure drawn from data: numbered steps joined by arrows.
 * Long sequences wrap into a grid; short ones read as a single line on desktop.
 */
export function Flow({
  steps,
  tone = "paper",
  caption,
  dense = false,
  stack = false,
  captionClassName,
}: {
  steps: readonly Step[];
  tone?: keyof typeof tones;
  caption?: string;
  dense?: boolean;
  /** Narrow containers: two columns at most. */
  stack?: boolean;
  captionClassName?: string;
}) {
  const t = tones[tone];
  const cols = stack ? "sm:grid-cols-2" : dense ? "sm:grid-cols-3 lg:grid-cols-5" : steps.length <= 5 ? "lg:grid-cols-5" : steps.length <= 7 ? "sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7" : "sm:grid-cols-3 lg:grid-cols-5";
  return (
    <figure>
      <ol className={`grid grid-cols-1 gap-x-7 gap-y-3 ${cols}`}>
        {steps.map((s, i) => (
          <li key={s.label} className="relative flex">
            <div className={`flex w-full flex-col border px-3 py-2.5 ${t.box}`}>
              <span className={`num text-[12px] font-semibold ${t.num}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[15px] font-semibold leading-snug">{s.label}</span>
              {s.note && <span className={`mt-1 text-[13.5px] leading-snug ${t.note}`}>{s.note}</span>}
            </div>
            {i < steps.length - 1 && (
              <svg aria-hidden viewBox="0 0 20 12" className={`absolute -right-[23px] top-1/2 hidden h-3 w-5 -translate-y-1/2 sm:block ${t.arrow}`} fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 6h16M12 1.5 17 6l-5 4.5" />
              </svg>
            )}
          </li>
        ))}
      </ol>
      {caption && <figcaption className={`mt-3 text-[13.5px] ${captionClassName ?? t.note}`}>{caption}</figcaption>}
    </figure>
  );
}
