"use client";

import { useEffect, type RefObject } from "react";

// Motion runs only on tablet/desktop for users who allow it. Phones skip it so GSAP
// (~130 KB) never loads there and the page is interactive sooner.
const MOTION_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

type Gsap = typeof import("gsap").gsap;

/** Loads GSAP + ScrollTrigger on demand and runs `setup` inside a context scoped to `ref`. */
export function useMotion(ref: RefObject<HTMLElement | null>, setup: (gsap: Gsap) => void) {
  useEffect(() => {
    if (!ref.current || !window.matchMedia(MOTION_QUERY).matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled || !ref.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => setup(gsap), ref.current);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // setup is defined inline by callers and only needs to run once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
