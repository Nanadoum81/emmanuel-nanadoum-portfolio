"use client";

import { useMemo } from "react";
import { useScrollSpy } from "@/lib/useScrollSpy";

/** Contents rail for a case study: a strict linear sequence with the current step marked. */
export function CaseRail({ items }: { items: { id: string; label: string }[] }) {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const current = useScrollSpy(ids, 0.3);

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
