"use client";

import { useRef } from "react";
import { useMotion } from "@/lib/gsap";

/**
 * The signature moment: the cover sheet assembles, the redline strikes through
 * the old positioning and the blue insertion writes in, then exhibits attach.
 */
export function CoverMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, (gsap) => {
    const q = gsap.utils.selector(ref);
    const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.1 } });
    tl.from(q("[data-name-line]"), { yPercent: 110, stagger: 0.09, duration: 1.2 }, 0.08)
      .fromTo(q(".redline-del"), { "--strike": 0 }, { "--strike": 1, duration: 0.55, ease: "power3.inOut" }, 0.95)
      .from(q("[data-ins-word]"), { opacity: 0, y: 3, stagger: 0.028, duration: 0.35, ease: "power2.out" }, 1.35)
      .from(q("[data-plate] .exhibit-body"), { clipPath: "inset(0 0 100% 0)", stagger: 0.1, duration: 1.1, ease: "expo.inOut", clearProps: "clipPath" }, 0)
      .from(q("[data-exhibit-tab]"), { opacity: 0, y: 8, stagger: 0.14, duration: 0.6 }, 0.9);

    q("[data-depth]").forEach((el) => {
      const depth = Number((el as HTMLElement).dataset.depth || 0);
      gsap.to(el, {
        yPercent: -depth,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    });
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
