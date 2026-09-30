"use client";

import { useEffect, useState } from "react";

/** Contents rail for a case study: a strict linear sequence with the current step marked. */
export function CaseRail({ items }: { items: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setCurrent(vis[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  const idx = items.findIndex((i) => i.id === current);
  return (
    <nav aria-label="Case study contents" className="sticky top-24">
      <p className="text-[14px] font-bold">Contents</p>
      <ol className="mt-3 border-l border-rule">
        {items.map((it, i) => {
          const on = it.id === current;
          const done = i < idx;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? "location" : undefined}
                className={`-ml-px flex gap-2.5 border-l-2 py-1.5 pl-3 text-[14.5px] leading-snug transition-colors hover:text-blue ${
                  on ? "border-blue font-semibold text-ink" : done ? "border-ink/40 text-ink-2" : "border-transparent text-ink-3"
                }`}
              >
                <span className="num w-5 shrink-0">{i + 1}</span>
                {it.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
