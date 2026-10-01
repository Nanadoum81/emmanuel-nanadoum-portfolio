import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

// Demo-site form submissions, forwarded server-to-server by each demo's /api/demo-lead.
// Saved as private JSON in the "blair-demo-leads" Blob store; optionally emailed via Resend.

export const runtime = "nodejs";

const DEMOS = ["cactus", "palmer", "canham", "nelson", "nelson-thatcher", "coyote", "medspa"] as const;
const MAX_BYTES = 20_000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map<string, { n: number; reset: number }>();

type Lead = { demo?: string; ip?: string; page?: string; event?: unknown };

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BYTES) return NextResponse.json({ error: "too_large" }, { status: 413 });

  let lead: Lead;
  try {
    lead = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const demo = DEMOS.find((d) => d === lead.demo);
  if (!demo) return NextResponse.json({ error: "unknown_demo" }, { status: 400 });

  const ip = String(lead.ip || req.headers.get("x-forwarded-for") || "anon").split(",")[0].trim();
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) hits.set(ip, { n: 1, reset: now + WINDOW_MS });
  else if (++h.n > MAX_REQUESTS) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const at = new Date(now).toISOString();
  const record = { demo, at, page: lead.page || "", event: lead.event ?? null };
  const id = `${at.replace(/[:.]/g, "-")}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    await put(`leads/${demo}/${id}.json`, JSON.stringify(record, null, 2), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });
  } catch (err) {
    console.error("lead save failed", demo, err instanceof Error ? err.message : "unknown");
    return NextResponse.json({ error: "save_failed" }, { status: 502 });
  }

  await emailLead(record).catch((err) => console.error("lead email failed", err instanceof Error ? err.message : "unknown"));
  console.log(JSON.stringify({ lead: demo, at, id }));
  return new NextResponse(null, { status: 204 });
}

// Sends a plain-text copy when RESEND_API_KEY and LEAD_EMAIL_TO are set; otherwise leads are only stored.
async function emailLead(record: { demo: string; at: string; page: string; event: unknown }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO;
  if (!key || !to) return;
  const fields = (record.event as { formData?: Record<string, unknown> } | null)?.formData || {};
  const lines = Object.entries(fields).map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_EMAIL_FROM || "Blair demo leads <onboarding@resend.dev>",
      to: [to],
      subject: `New ${record.demo} demo form submission`,
      text: [`Demo: ${record.demo}`, `Received: ${record.at}`, `Page: ${record.page}`, "", ...lines].join("\n"),
    }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}`);
}
