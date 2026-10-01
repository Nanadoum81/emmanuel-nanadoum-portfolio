import { chromium } from "/Users/emmanuel_nanadoum/AI/projects/vybe-app/node_modules/playwright/index.mjs";
const OUT = process.argv[2];
const METALS = {
  brass:  { base: "#b8924f", hi: "#fff1cf", fill: "#1d140a", name: "brass" },
  nickel: { base: "#a9adb3", hi: "#ffffff", fill: "#121418", name: "nickel" },
  bronze: { base: "#8d6633", hi: "#f6d9a2", fill: "#1a1007", name: "bronze" },
};
const DOORS = {
  oxblood:   { base: "#4a1218", spec: "#ffd9d0" },
  green:     { base: "#123526", spec: "#dff3e6" },
  navy:      { base: "#14243f", spec: "#dfe8ff" },
  limestone: { base: "#cfc8b9", spec: "#ffffff" },
};
const W = 1400, H = 1050;
const plaque = (m) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
 <defs>
  <filter id="brush" x="0" y="0" width="100%" height="100%">
   <feTurbulence type="fractalNoise" baseFrequency="0.0009 0.55" numOctaves="3" seed="7" result="n"/>
   <feColorMatrix in="n" type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  .55 0 0 0 .2" result="na"/>
  </filter>
  <!-- height map: plate bevel + engraved cavities + screws -->
  <filter id="light" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
   <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="hm0"/>
   <feTurbulence type="fractalNoise" baseFrequency="0.0012 0.7" numOctaves="2" seed="11" result="tex"/>
   <feColorMatrix in="tex" type="luminanceToAlpha" result="texa"/>
   <feComposite in="hm0" in2="texa" operator="arithmetic" k2="1" k3="0.035" result="hm"/>
   <feDiffuseLighting in="hm" surfaceScale="5" diffuseConstant="1.05" lighting-color="#ffffff" result="diff">
     <feDistantLight azimuth="235" elevation="58"/>
   </feDiffuseLighting>
   <feSpecularLighting in="hm" surfaceScale="5" specularConstant="0.85" specularExponent="22" lighting-color="${m.hi}" result="spec">
     <fePointLight x="${W*0.3}" y="${-H*0.4}" z="900"/>
   </feSpecularLighting>
   <feFlood flood-color="${m.base}" result="metal"/>
   <feComposite in="metal" in2="diff" operator="arithmetic" k1="1.25" result="lit"/>
   <feComposite in="lit" in2="spec" operator="arithmetic" k2="1" k3="0.55" result="shine"/>
   <feComposite in="shine" in2="SourceAlpha" operator="in"/>
  </filter>
  <filter id="soft"><feGaussianBlur stdDeviation="2.2"/></filter>
  <filter id="cav"><feGaussianBlur stdDeviation="1.1"/></filter>
  <linearGradient id="bevel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#c8c8c8"/></linearGradient>
  <radialGradient id="dome"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#6a6a6a"/></radialGradient>
  <mask id="engr"><rect width="${W}" height="${H}" fill="#000"/><g fill="#fff" class="t">${TEXT()}</g></mask>
 </defs>
 <!-- height source -->
 <g filter="url(#light)">
  <rect x="0" y="0" width="${W}" height="${H}" rx="10" fill="#7a7a7a"/>
  <rect x="14" y="14" width="${W-28}" height="${H-28}" rx="6" fill="url(#bevel)" filter="url(#soft)"/>
  <rect x="26" y="26" width="${W-52}" height="${H-52}" rx="3" fill="#f2f2f2"/>
  <g fill="#4a4a4a" filter="url(#cav)" class="t">${TEXT()}</g>
  ${[[60,60],[W-60,60],[60,H-60],[W-60,H-60]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="19" fill="url(#dome)"/><rect x="${x-15}" y="${y-2.5}" width="30" height="5" fill="#3a3a3a" transform="rotate(${[35,-20,70,10][i]} ${x} ${y})" filter="url(#cav)"/>`).join("")}
 </g>
 <!-- wax fill inside the cut letters -->
 <rect width="${W}" height="${H}" fill="${m.fill}" opacity=".86" mask="url(#engr)" transform="translate(0.6 1.2)"/>
</svg>`;
const TEXT = () => `
  <text x="${W/2}" y="300" text-anchor="middle" font-family="Marcellus SC" font-size="112" letter-spacing="5">PALMER &amp; HERMAN</text>
  <text x="${W/2}" y="400" text-anchor="middle" font-family="Marcellus SC" font-size="44" letter-spacing="17">CHIROPRACTIC PHYSICIANS</text>
  <rect x="${W*0.22}" y="470" width="${W*0.56}" height="3"/>
  <text x="${W/2}" y="590" text-anchor="middle" font-family="Marcellus SC" font-size="62" letter-spacing="6">TERRY A. PALMER, D.C.</text>
  <text x="${W/2}" y="680" text-anchor="middle" font-family="Marcellus SC" font-size="62" letter-spacing="6">GLENN S. HERMAN, D.C.</text>
  <rect x="${W*0.22}" y="760" width="${W*0.56}" height="3"/>
  <text x="${W/2}" y="870" text-anchor="middle" font-family="Marcellus SC" font-size="38" letter-spacing="11">331 CHURCH STREET · NAUGATUCK · EST. 1989</text>`;

const DW = 2400, DH = 1500;
const door = (d) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${DW}" height="${DH}" viewBox="0 0 ${DW} ${DH}">
 <defs>
  <filter id="lac" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
   <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="hm0"/>
   <feTurbulence type="fractalNoise" baseFrequency="0.004 0.03" numOctaves="2" seed="3" result="grain"/>
   <feColorMatrix in="grain" type="luminanceToAlpha" result="ga"/>
   <feComposite in="hm0" in2="ga" operator="arithmetic" k2="1" k3="0.018" result="hm"/>
   <feDiffuseLighting in="hm" surfaceScale="14" diffuseConstant="1" lighting-color="#fff" result="diff"><feDistantLight azimuth="250" elevation="62"/></feDiffuseLighting>
   <feSpecularLighting in="hm" surfaceScale="14" specularConstant="0.5" specularExponent="38" lighting-color="${d.spec}" result="spec"><fePointLight x="${DW*0.35}" y="${-DH*0.6}" z="1400"/></feSpecularLighting>
   <feFlood flood-color="${d.base}" result="c"/>
   <feComposite in="c" in2="diff" operator="arithmetic" k1="1.12" result="lit"/>
   <feComposite in="lit" in2="spec" operator="arithmetic" k2="1" k3="0.42"/>
  </filter>
  <filter id="b8"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="b3"><feGaussianBlur stdDeviation="3"/></filter>
  <linearGradient id="refl" x1="0" y1="0" x2="1" y2="0.25"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".38" stop-color="#fff" stop-opacity="0"/><stop offset=".46" stop-color="#fff" stop-opacity=".07"/><stop offset=".5" stop-color="#fff" stop-opacity=".02"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
 </defs>
 <g filter="url(#lac)">
  <rect width="${DW}" height="${DH}" fill="#808080"/>
  ${panel(150, 120, DW-300, DH-240)}
 </g>
 <rect width="${DW}" height="${DH}" fill="url(#refl)"/>
</svg>`;
// raised and fielded panel: groove, ogee step, bevel up to a flat field
function panel(x, y, w, h) {
  const steps = [[0, "#3c3c3c", 8], [10, "#585858", 3], [22, "#9a9a9a", 3], [36, "#6c6c6c", 8], [90, "#c2c2c2", 14], [118, "#d2d2d2", 0]];
  return steps.map(([i, f, bl]) => `<rect x="${x+i}" y="${y+i}" width="${w-2*i}" height="${h-2*i}" rx="${Math.max(2, 8 - i/20)}" fill="${f}" ${bl ? `filter="url(#b${bl > 5 ? 8 : 3})"` : ""}/>`).join("");
}
const b = await chromium.launch({ channel: "chrome" });
const p = await b.newPage({ viewport: { width: DW, height: DH }, deviceScaleFactor: 1 });
await p.setContent(`<html><head><link href="https://fonts.googleapis.com/css2?family=Marcellus+SC&display=block" rel="stylesheet"><style>body{margin:0;background:#000}</style></head><body><div id="s"></div></body></html>`);
await p.evaluate(() => document.fonts.load('40px "Marcellus SC"'));
for (const [k, m] of Object.entries(METALS)) {
  await p.evaluate((svg) => { document.getElementById("s").innerHTML = svg; }, plaque(m));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.locator("svg").screenshot({ path: `${OUT}/plaque-${k}.png`, omitBackground: true });
}
for (const [k, d] of Object.entries(DOORS)) {
  await p.evaluate((svg) => { document.getElementById("s").innerHTML = svg; }, door(d));
  await p.waitForTimeout(300);
  await p.locator("svg").screenshot({ path: `${OUT}/door-${k}.png` });
}
await b.close();
console.log("rendered");
