"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  event: string;
  data?: Record<string, string>;
  children: ReactNode;
};

/** Anchor that records a Vercel Analytics custom event, then navigates normally. */
export function TrackLink({ href, event, data, children, onClick, ...rest }: Props) {
  const external = /^(https?:|mailto:|tel:)/.test(href) || href.endsWith(".pdf");
  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      track(event, { href, ...data });
    } catch {
      /* analytics must never block navigation */
    }
    onClick?.(e);
  };

  if (external) {
    const newTab = /^https?:/.test(href) || href.endsWith(".pdf");
    return (
      <a
        href={href}
        onClick={handle}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
