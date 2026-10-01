"use client";

import { useRef } from "react";
import { useMotion } from "@/lib/gsap";

/**
 * Scroll reveals scoped to one section. Content is visible by default; motion only
 * runs on tablet/desktop when the user allows it.
 *  [data-r="mask"]   image plates wipe open from the top edge
 *  [data-r="rise"]   short rise + fade
 *  [data-r="rows"]   children arrive in quick sequence, like rows being filled in
 *  [data-r="rule"]   a progress rule that scrubs with scroll
 */
export function Reveal({ children, className = "", as: Tag = "div", id }: { children: React.ReactNode; className?: string; as?: "div" | "section"; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, (gsap) => {
    const q = gsap.utils.selector(ref);
    q('[data-r="mask"]').forEach((el) => {
      gsap.from(el, {
        clipPath: "inset(0 0 100% 0)",
        clearProps: "clipPath",
        duration: 1.25,
        ease: "expo.inOut",
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
      const img = (el as HTMLElement).querySelector("img");
      if (img) gsap.from(img, { scale: 1.06, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 82%", once: true } });
    });
    q('[data-r="rise"]').forEach((el) => {
      gsap.from(el, { opacity: 0, y: 22, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 86%", once: true } });
    });
    q('[data-r="rows"]').forEach((el) => {
      gsap.from(el.children, {
        opacity: 0,
        y: 10,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 84%", once: true },
      });
    });
    q('[data-r="rule"]').forEach((el) => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", transformOrigin: "top center", scrollTrigger: { trigger: el.parentElement, start: "top 70%", end: "bottom 60%", scrub: 0.4 } }
      );
    });
  });

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
