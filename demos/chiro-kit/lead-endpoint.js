// Receives demo form submissions (formerly sent to GoHighLevel) and forwards them to the
// portfolio's /api/leads, which saves them privately. Always answers 204 so the form behaves normally.
const DEMO = __SLUG__;
const LEADS_URL = "https://emmanuel-nanadoum.vercel.app/api/leads";
const MAX_BODY = 2 * 1024 * 1024;

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw new Error("body too large");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Keep the lead small: drop uploaded files and long base64 strings.
function slim(event) {
  if (!event || typeof event !== "object" || !event.formData) return event;
  const formData = {};
  for (const [k, v] of Object.entries(event.formData)) {
    if (typeof v === "string" && v.length > 2000) formData[k] = "[omitted: " + v.length + " chars]";
    else if (v && typeof v === "object") formData[k] = "[file omitted]";
    else formData[k] = v;
  }
  return { ...event, formData };
}

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).end(); return; }
  try {
    const type = String(req.headers["content-type"] || "");
    const body = await readBody(req);
    let event = null;
    if (type.includes("multipart/form-data") || type.includes("urlencoded")) {
      const form = await new Request("http://local", { method: "POST", headers: { "content-type": type }, body }).formData();
      const raw = form.get("event");
      event = typeof raw === "string" ? JSON.parse(raw) : null;
    } else if (body.length) {
      event = JSON.parse(body.toString("utf8"));
    }
    const r = await fetch(LEADS_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ demo: DEMO, ip: String(req.headers["x-forwarded-for"] || ""), page: String(req.headers.referer || ""), event: slim(event) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) console.error("lead forward failed", r.status);
  } catch (err) {
    console.error("lead forward error", err instanceof Error ? err.message : "unknown");
  }
  res.status(204).end();
}
