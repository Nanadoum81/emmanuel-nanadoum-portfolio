"use client";

import { useEffect, useState } from "react";

export type BinderTab = { id: string; label: string; color: string; ink: string };

/** Divider tabs on the page edge that track the current section. Desktop only. */
export function BinderTabs({ tabs }: { tabs: BinderTab[] }) {
  const [current, setCurrent] = useState(tabs[0]?.id);

  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setCurrent(vis[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [tabs]);

  return (
    <nav aria-label="Sections" className="fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-1 xl:flex">
      {tabs.map((t) => {
        const on = t.id === current;
        return (
          <a
            key={t.id}
            href={`#${t.id}`}
            aria-current={on ? "location" : undefined}
            style={{ background: t.color, color: t.ink }}
            className={`flex h-[92px] w-9 items-center justify-center rounded-l-[4px] text-[12.5px] font-semibold transition-[width,box-shadow] duration-300 [writing-mode:vertical-rl] hover:w-11 ${on ? "w-12 shadow-[-2px_2px_10px_rgba(17,18,20,0.18)]" : "opacity-90"}`}
          >
            {t.label}
          </a>
        );
      })}
    </nav>
  );
}
