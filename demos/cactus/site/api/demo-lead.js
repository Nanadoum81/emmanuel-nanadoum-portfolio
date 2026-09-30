// Receives demo form submissions that previously went to GoHighLevel.
// Logs a minimal summary (no message bodies) and answers 204 so the form behaves normally.
export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).end(); return; }
  console.log(JSON.stringify({ demo: "cactus", at: new Date().toISOString(), contentType: req.headers["content-type"] || "" }));
  res.status(204).end();
}
