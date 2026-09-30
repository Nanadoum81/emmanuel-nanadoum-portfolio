import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Emmanuel Nanadoum — AI Consultant / Solutions Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const [regular, heavy] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/SchibstedGrotesk-500.ttf")),
    readFile(join(process.cwd(), "assets/fonts/SchibstedGrotesk-800.ttf")),
  ]);
  const row = (k: string, v: string) => (
    <div style={{ display: "flex", borderBottom: "1px solid #d9d8d2", padding: "8px 0", fontSize: 22 }}>
      <div style={{ width: 170, color: "#45474d" }}>{k}</div>
      <div style={{ color: "#111214" }}>{v}</div>
    </div>
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fbfbf9", fontFamily: "Schibsted", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", padding: "56px 64px", width: 1080 }}>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #d9d8d2", width: 640 }}>
            {row("Prepared for", "Hiring teams in AI, SaaS and automation")}
            {row("Based in", "Phoenix, Arizona · Remote / Hybrid")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 44, fontSize: 104, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4.5, color: "#111214" }}>
            <span>Emmanuel</span>
            <span>Nanadoum</span>
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 36, fontWeight: 800, letterSpacing: -0.8 }}>AI Consultant / Solutions Engineer</div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 26, color: "#1d3fcf" }}>
            <span style={{ color: "#6b6d73", textDecoration: "line-through", marginRight: 12 }}>I make websites.</span>
            <span style={{ textDecoration: "underline" }}>I design the connected systems behind revenue.</span>
          </div>
        </div>
        <div style={{ position: "absolute", right: 0, top: 70, display: "flex", flexDirection: "column", gap: 8 }}>
          {["#111214", "#2e7d4f", "#1d3fcf", "#f4e04d"].map((c) => (
            <div key={c} style={{ width: 52, height: 108, background: c, borderRadius: "6px 0 0 6px" }} />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Schibsted", data: regular, weight: 500, style: "normal" },
        { name: "Schibsted", data: heavy, weight: 800, style: "normal" },
      ],
    }
  );
}
