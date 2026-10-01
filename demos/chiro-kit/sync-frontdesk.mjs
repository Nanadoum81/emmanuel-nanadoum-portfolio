// Copies each practice's frontdesk.json into lib/practices.ts (the portfolio's AI front desk API).
import fs from "node:fs";
const dir = "demos/chiro-kit/practices";
const file = "lib/practices.ts";
let src = fs.readFileSync(file, "utf8");
for (const slug of fs.readdirSync(dir)) {
  const f = `${dir}/${slug}/frontdesk.json`;
  if (!fs.existsSync(f)) continue;
  const p = JSON.parse(fs.readFileSync(f, "utf8"));
  const entry = `  ${slug}: ${JSON.stringify({ name: p.name, short: p.short, city: p.city, phone: p.phone, address: p.address, doctors: p.doctors, hours: p.hours, services: p.services, insurance: p.insurance, extras: p.extras }, null, 2).replace(/\n/g, "\n  ")},\n`;
  const re = new RegExp(`  ${slug}: \\{[\\s\\S]*?\\n  \\},\\n`);
  src = re.test(src) ? src.replace(re, entry) : src.replace("export const PRACTICES: Record<string, PracticeProfile> = {\n", `export const PRACTICES: Record<string, PracticeProfile> = {\n${entry}`);
  console.log("synced", slug);
}
fs.writeFileSync(file, src);
