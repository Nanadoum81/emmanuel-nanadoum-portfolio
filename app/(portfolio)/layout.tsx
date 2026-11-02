import type { ReactNode } from "react";

import { SiteFooter, SiteHeader } from "./SiteChrome";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}
