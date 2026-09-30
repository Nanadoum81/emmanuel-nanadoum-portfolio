"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * The signature moment: the cover sheet assembles, the redline strikes through
 * the old positioning and the blue insertion writes in, then exhibits attach.
 */
export function CoverMotion({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(ref);
        const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.1 } });
        tl.from(q("[data-cover-meta] tr, [data-cover-meta] > div"), { opacity: 0, y: 6, stagger: 0.035, duration: 0.5 }, 0)
          .from(q("[data-name-line]"), { yPercent: 110, stagger: 0.09, duration: 1.2 }, 0.08)
          .from(q("[data-cover-role]"), { opacity: 0, y: 12, duration: 0.8 }, 0.4)
          .fromTo(q(".redline-del"), { "--strike": 0 }, { "--strike": 1, duration: 0.55, ease: "power3.inOut" }, 0.95)
          .from(q("[data-ins-word]"), { opacity: 0, y: 3, stagger: 0.028, duration: 0.35, ease: "power2.out" }, 1.35)
          .from(q("[data-cover-keys] > *"), { opacity: 0, y: 10, stagger: 0.06, duration: 0.7 }, 1.2)
          .from(q("[data-plate] .exhibit-body"), { clipPath: "inset(0 0 100% 0)", stagger: 0.14, duration: 1.3, ease: "expo.inOut", clearProps: "clipPath" }, 0.25)
          .from(q("[data-exhibit-tab]"), { opacity: 0, y: 8, stagger: 0.14, duration: 0.6 }, 0.9)
          .from(q("[data-index-row]"), { opacity: 0, x: -8, stagger: 0.05, duration: 0.6 }, 1.1);

        q("[data-depth]").forEach((el) => {
          const depth = Number((el as HTMLElement).dataset.depth || 0);
          gsap.to(el, {
            yPercent: -depth,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 0.6 },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
