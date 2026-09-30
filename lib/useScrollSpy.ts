"use client";

import { useEffect, useState } from "react";

/** Returns the id of the last section whose top has passed `line` (fraction of viewport height). Defaults to the first. */
export function useScrollSpy(ids: string[], line = 0.3) {
  const [current, setCurrent] = useState(ids[0]);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const y = window.innerHeight * line;
      let active = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= y) active = id;
      }
      setCurrent(active);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ids, line]);
  return current;
}
