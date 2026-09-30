import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
});

const description =
  "Emmanuel Nanadoum — AI Consultant, Solutions Engineer and Sales Engineer in Phoenix, AZ (remote / hybrid). Customer discovery → solution architecture → working demo → implementation, with live builds: VYBE Voice, AI patient-acquisition systems, CRM and automation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Emmanuel Nanadoum — AI Consultant / Solutions Engineer",
    template: "%s — Emmanuel Nanadoum",
  },
  description,
  applicationName: "Emmanuel Nanadoum",
  authors: [{ name: "Emmanuel Nanadoum", url: SITE_URL }],
  keywords: [
    "Solutions Engineer",
    "Sales Engineer",
    "AI Consultant",
    "Solutions Consultant",
    "Technical Presales",
    "Implementation Consultant",
    "CRM automation",
    "AI voice",
    "Phoenix",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Emmanuel Nanadoum",
    title: "Emmanuel Nanadoum — AI Consultant / Solutions Engineer",
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Nanadoum — AI Consultant / Solutions Engineer",
    description,
  },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fbfbf9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={schibsted.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
