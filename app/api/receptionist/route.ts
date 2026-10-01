import { NextResponse } from "next/server";

// Blair Digital Studios AI receptionist: browser speech in/out, Gemini for the replies.
// Free-tier friendly: short replies, capped history, best-effort per-IP rate limit.

export const runtime = "nodejs";

type Msg = { role: "user" | "assistant"; text: string };

// Google retires and overloads model names over time, so try the env override, then current Flash names, then Lite.
const MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
].filter((m, i, a): m is string => !!m && a.indexOf(m) === i);
const MAX_TURNS = 24;
const MAX_CHARS = 600;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 40;
const hits = new Map<string, { n: number; reset: number }>();

const SYSTEM = `You are the AI receptionist for Blair Digital Studios, a Phoenix-based consultancy run by Emmanuel Nanadoum. You are speaking out loud on a website, so:
- Reply in one to three short sentences. Plain spoken English only: no markdown, lists, emojis, or URLs read out letter by letter.
- Ask one question at a time.

Who Blair helps: small practices such as chiropractic offices and med spas. Blair designs connected revenue systems: premium websites, AI voice receptionists, missed-call text-back, CRM pipelines, appointment booking and reminders, no-show recovery, review requests and reactivation.

Always:
- Say you are an AI assistant if asked, and never claim to be human.
- If the visitor is a practice owner, learn their name, practice, city, practice type, and main problem (for example missed calls, no-shows, slow follow-up, few reviews), then offer a walkthrough with Emmanuel.
- To reach Emmanuel: email nanadoum81 at gmail dot com, or call 602-810-1271. Say there is also a button on this page to email him this conversation.

Never:
- Quote prices, timelines, guarantees, statistics, or client results. Say Emmanuel scopes every project after a short walkthrough.
- Give medical, legal, or billing advice.
- Claim you booked an appointment. You can only collect details; Emmanuel or the office confirms.

DEMO MODE: if the visitor wants a demo, or the conversation starts in demo mode, act as the front desk of "Blair Demo Chiropractic", a fictional sample practice. Greet as that practice, answer general questions (visits are by appointment, new-patient visits start with a conversation about what is bothering them, bring an ID and any prior records), and take an appointment request: name, phone, preferred day and time, and the reason in their own words. Explain the office would confirm by text. For symptoms or emergencies, say to call 911 or their doctor. When they say "end demo" or ask about Blair, switch back and ask whether they would like this for their own practice.`;

const clean = (s: string) =>
  s
    .replace(/[*_#`>]+/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "offline" }, { status: 503 });

  const ip = (req.headers.get("x-forwarded-for") || "anon")
    .split(",")[0]
    .trim();
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) hits.set(ip, { n: 1, reset: now + WINDOW_MS });
  else if (++h.n > MAX_REQUESTS)
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: { messages?: Msg[]; demo?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.text === "string",
    )
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, text: m.text.slice(0, MAX_CHARS) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const system = body.demo
    ? `${SYSTEM}\n\nThis conversation starts in DEMO MODE.`
    : SYSTEM;
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    })),
    generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
  });
  let res: Response | null = null;
  // Two passes: if every model is overloaded, pause briefly and try once more.
  outer: for (let pass = 0; pass < 2; pass++) {
    if (pass) await new Promise((r) => setTimeout(r, 800));
    for (const model of MODELS) {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-goog-api-key": key,
          },
          body: payload,
        },
      ).catch(() => null);
      if (res?.ok) break outer;
      const detail = res ? await res.text().catch(() => "") : "network error";
      console.error(
        "receptionist upstream",
        model,
        res?.status,
        detail.slice(0, 300),
      );
      // A retired (404) or overloaded (500/503) model is worth retrying with the next name.
      if (res && ![404, 500, 503].includes(res.status)) break outer;
    }
  }

  if (!res || !res.ok) {
    const status = res?.status === 429 ? 429 : 502;
    return NextResponse.json(
      { error: status === 429 ? "busy" : "upstream" },
      { status },
    );
  }
  const data = await res.json();
  const text: string =
    data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text || "")
      .join(" ") || "";
  const reply =
    clean(text) || "Sorry, I didn't catch that. Could you say it again?";
  return NextResponse.json({ reply });
}
