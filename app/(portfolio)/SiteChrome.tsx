"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

const GOLD = "#c8a24a";
const INK = "#0c0d0f";
const PAPER = "#f2f0eb";
const MUTED = "#c9c7c1";
const FAINT = "#9a9c9f";
const RULE = "#26282c";

const wrap: CSSProperties = {
  maxWidth: 1180,
  margin: "0 auto",
  padding: "0 28px",
};

const archivo = "Archivo, Arial, sans-serif";
const inter = "Inter, system-ui, sans-serif";

function Fonts() {
  return (
    <link
      href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;700;800;900&family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div style={{ background: INK, color: PAPER, fontFamily: inter }}>
      <Fonts />
      <div style={wrap}>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "22px 0",
            borderBottom: `1px solid ${RULE}`,
          }}
        >
          <a
            href="/"
            style={{
              fontFamily: archivo,
              fontWeight: 900,
              letterSpacing: ".04em",
              fontSize: 19,
              color: PAPER,
              textDecoration: "none",
            }}
          >
            EMMANUEL <span style={{ color: GOLD }}>NANADOUM</span>
          </a>
          <div
            style={{
              display: "flex",
              gap: 22,
              alignItems: "center",
              fontSize: 14,
              color: MUTED,
            }}
          >
            <a href="/" style={{ color: MUTED, textDecoration: "none" }}>
              Home
            </a>
            <a
              href="mailto:nanadoum81@gmail.com"
              style={{ color: MUTED, textDecoration: "none" }}
            >
              Email
            </a>
            <a
              href="/Emmanuel_Nanadoum_Solutions_Engineer_Resume.pdf"
              download
              style={{
                background: GOLD,
                color: "#fff",
                padding: "11px 18px",
                fontWeight: 700,
                fontSize: 14,
                borderRadius: 4,
                textDecoration: "none",
              }}
            >
              Download r&eacute;sum&eacute;
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  const link: CSSProperties = {
    color: FAINT,
    textDecoration: "underline",
    textUnderlineOffset: 3,
  };
  return (
    <div style={{ background: INK, color: FAINT, fontFamily: inter }}>
      <div style={wrap}>
        <footer
          style={{
            padding: "28px 0",
            fontSize: 13,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            borderTop: `1px solid ${RULE}`,
          }}
        >
          <span>
            &copy; 2026 Emmanuel Nanadoum &middot; Phoenix, Arizona &middot;
            Remote / Hybrid
          </span>
          <span>
            <a href="mailto:nanadoum81@gmail.com" style={link}>
              nanadoum81@gmail.com
            </a>{" "}
            &middot;{" "}
            <a href="tel:+16028101271" style={link}>
              602-810-1271
            </a>{" "}
            &middot;{" "}
            <a
              href="https://www.linkedin.com/in/emmanuel-nanadoum-7971b7a8"
              target="_blank"
              rel="noopener"
              style={link}
            >
              LinkedIn
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}
