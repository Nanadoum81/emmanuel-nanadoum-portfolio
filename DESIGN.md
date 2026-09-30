---
name: Emmanuel Nanadoum — Portfolio
description: A presales Statement of Work in laser-print white and graphite ink, with live builds attached as exhibits.
colors:
  paper: "#fbfbf9"
  paper-2: "#f2f2ee"
  paper-3: "#e9e9e3"
  ink: "#111214"
  ink-2: "#45474d"
  ink-3: "#6b6d73"
  rule: "#d9d8d2"
  rule-strong: "#b9b8b1"
  blue: "#1d3fcf"
  blue-deep: "#142c95"
  red: "#c8352a"
  yellow: "#f4e04d"
  green: "#2e7d4f"
  plate: "#0f1115"
  plate-2: "#1a1d23"
typography:
  display:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(52px, 8.4vw, 94px)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.045em"
  display-divider:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(44px, 6.6vw, 84px)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(30px, 3.6vw, 46px)"
    fontWeight: 750
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(32px, 3.6vw, 48px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(19px, 1.6vw, 22px)"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"ss01\""
  table:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label-stamp:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.07em"
  numeral:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "inherit"
    fontFeature: "\"tnum\" 1"
rounded:
  key: "2px"
  exhibit-tab: "3px"
  binder-tab: "4px"
spacing:
  gutter: "clamp(20px, 4vw, 56px)"
  container: "1360px"
  section: "64px"
  section-lg: "96px"
  block: "48px"
  measure: "68ch"
components:
  key-primary:
    backgroundColor: "{colors.blue}"
    textColor: "#ffffff"
    rounded: "{rounded.key}"
    padding: "0 18px"
    height: "44px"
    typography: "{typography.table}"
  key-primary-hover:
    backgroundColor: "{colors.blue-deep}"
  key-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.key}"
    padding: "0 18px"
    height: "44px"
  key-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  key-inverse:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.key}"
    padding: "0 18px"
    height: "44px"
  key-inverse-hover:
    backgroundColor: "{colors.yellow}"
  stamp-live:
    textColor: "{colors.blue}"
    typography: "{typography.label-stamp}"
    padding: "1px 6px"
  stamp-preview:
    textColor: "{colors.green}"
    typography: "{typography.label-stamp}"
    padding: "1px 6px"
  stamp-demo:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.label-stamp}"
    padding: "1px 6px"
  stamp-inactive:
    textColor: "{colors.red}"
    typography: "{typography.label-stamp}"
    padding: "1px 6px"
  exhibit-plate:
    backgroundColor: "{colors.plate}"
    textColor: "#ffffff"
    padding: "8px"
  exhibit-tab:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.exhibit-tab}"
    height: "28px"
    padding: "0 10px"
  binder-tab:
    rounded: "{rounded.binder-tab}"
    width: "36px"
    height: "92px"
  binder-tab-current:
    width: "48px"
  header:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "64px"
---

# Design System: Emmanuel Nanadoum — Portfolio

## Overview

**Creative North Star: "The Statement of Work"**

The site is the presales document Emmanuel would hand a buyer: a cover sheet with a document header table, numbered clauses, live builds attached as lettered exhibits on dark plates, decision tables, status stamps, and a sign-off block with a signature line. Everything is set on bright laser-print white in graphite ink, with the pen and office-supply colors of a marked-up contract doing the work of accent: ballpoint blue for links, insertions and the primary action; redline red for deletions and anything not activated; highlighter yellow for demo data.

Density is that of a well-set business document: hairline table rules, leader dots, tabular numerals, generous section padding, and a single sans family carrying every role from the 94px cover name to 11.5px stamp labels. Depth comes from paper physics only: exhibits sit on dark plates with a soft drop shadow like prints clipped to a page, and colored binder divider tabs mark the sections. Full-bleed divider sheets (blue for Exhibits, yellow for the Solution lab, ink for Sign-off) break the paper run the way coloured dividers break a binder.

The world rejects the headshot-plus-card-grid portfolio and the cream-paper-serif "editorial" default. Two scoped exceptions are pinned by the brief and are not part of this palette: the VYBE exhibit wears VYBE Variation 5's locked tokens, and each `/solutions/[slug]` proposal takes the client's own brand colour for its cover rule, primary key and ordinals.

**Key Characteristics:**
- Laser-print white ground, graphite ink, hairline rules; colour enters as pen, redline and highlighter.
- One family (Schibsted Grotesk), heavy and tightly tracked for display, tabular figures for clause and exhibit numbers.
- Numbered clauses and lettered exhibits (1–7, A–D) are the section grammar.
- Real screenshots on dark plates with an exhibit tab; never mock UI.
- Status is stamped: Live, Preview, Demo data, Not activated.
- Rectangular keys at 2px; no pills.
- One signature motion: the redline strikes through "I make websites." and the blue insertion writes in, once, on load.

## Colors

A white-paper document palette where every chromatic colour is a marking instrument with one job.

### Primary
- **Ballpoint Blue** (`blue`): links, tracked-change insertions, the primary key, focus rings, caret, the active nav underline, the current step in the case rail, the "Live" stamp, and the Exhibits divider sheet. Hover deepens to **Blue Ink, Pressed** (`blue-deep`), which also colours the Sign-off binder tab.

### Secondary
- **Redline Red** (`red`): the strike through deleted text and the "Not activated" stamp. Never decorative, never a CTA.
- **Highlighter Yellow** (`yellow`): demo-data stamp fill, the `.hl` highlighter mark, text selection, the Solution lab divider sheet, and the hover of inverse keys on ink.

### Tertiary
- **Ledger Green** (`green`): the "Preview" stamp, the Method binder tab, and the scrubbing progress rule and step markers of the method run sheet.

### Neutral
- **Laser-Print White** (`paper`): page ground, header, mobile action bar, text on ink.
- **Copier Grey** (`paper-2`): alternating section bands (Method, Exhibit C, Capabilities) and screenshot wells.
- **Toner Grey** (`paper-3`): reserved third paper step.
- **Graphite Ink** (`ink`): body text, strong table rules, secondary key border, the Sign-off sheet ground, cover binder tab.
- **Soft Graphite** (`ink-2`): secondary copy, table header labels, meta.
- **Pencil Grey** (`ink-3`): clause numerals, exhibit letters in indexes, struck text, upcoming case-rail steps.
- **Hairline** (`rule`): table row rules, section borders, header underline.
- **Strong Hairline** (`rule-strong`): header row rules, leader dots, scrollbar thumb, the static method rule.
- **Exhibit Plate** (`plate`) and **Plate Well** (`plate-2`): the dark mat behind every attached screenshot.

### Named Rules
**The Marking Instrument Rule.** Each chromatic colour means one thing: blue is what you can act on or what was inserted, red is what was struck or is not activated, yellow is demo data or a highlight, green is preview or progress. Never swap roles for variety.

**The Scoped Brand Rule.** VYBE's #010409 ground, #16c8ff cyan and #0b76c8→#5345c0 gradient appear only on the VYBE exhibit band, the VYBE Flow tone and the /work/vybe header. A client's accent appears only on that client's /solutions page (cover rule, primary key, ordinals, legend swatch), with contrast checked per client; where the accent fails as text (Cactus #E47F19) its ordinals darken and its key carries dark ink. Neither ever becomes a portfolio colour.

## Typography

**Display Font:** Schibsted Grotesk (with ui-sans-serif, system-ui, sans-serif), loaded via next/font
**Body Font:** Schibsted Grotesk
**Label/Mono Font:** Schibsted Grotesk with tabular figures (`.num`)

**Character:** A newsroom grotesk used like a contract template: heavy and tightly tracked where the document announces itself, plain and open where it argues. Stylistic set ss01 is on globally.

### Hierarchy
- **Display** (800, clamp(52px, 8.4vw, 94px), 0.92, -0.045em): the cover name only, split into masked lines. The Exhibits divider runs larger (clamp(56px, 9vw, 112px)); other divider sheets and page titles use **Display Divider** (800, clamp(44px, 6.6vw, 84px), ~0.92–0.95, -0.04em).
- **Headline** (750, clamp(30px, 3.6vw, 46px), 1.08, -0.02em): numbered section clauses, always prefixed by a Pencil Grey tabular numeral ("1 Summary of qualifications").
- **Title** (800, clamp(32px, 3.6vw, 48px), -0.03em): lettered exhibit titles (A–D).
- **Lead** (400–500, clamp(19px, 1.6vw, 22px), 1.35): exhibit headlines, the cover tracked-change line (500, up to 24px), summary paragraphs.
- **Body** (400, 17px, 1.6): running copy; measure capped between 34ch and 70ch, 68ch default.
- **Table** (400/600, 15px): decision tables, indexes, keys (15px semibold).
- **Meta** (400, 13–14.5px, Soft Graphite): document header tables, dt labels, captions ("Figure A.1 —", "Table C.1 —").
- **Stamp label** (700, 11.5px, 0.07em, uppercase): status stamps only.

### Named Rules
**The Clause Number Rule.** Section and step numbers are tabular figures in Pencil Grey set inline before the heading (1, 2.3, A, Figure A.1). Never draw them in circles or badges.

**The One Uppercase Rule.** Uppercase belongs to the stamp. Everything else stays in sentence case.

## Layout

A 12-column document grid inside a 1360px container with a fluid gutter (clamp(20px, 4vw, 56px)). Sections are full-bleed bands separated by hairline top borders and padded 64px on mobile, 96px from `lg`; divider sheets run 56–80px. The cover splits 6/6: document header table, name, role, tracked change and keys on the left; three overlapping exhibit plates plus the exhibit index on the right, with parallax depth on the plates. Content sections favour asymmetric splits (4/7, 5/6, 7/5) rather than centred stacks. Lists are tables or ruled rows, not card grids.

Responsive: below `sm` the cover exhibits become a snap-scrolling row at 84% width; below `lg` the primary nav collapses to a full-screen ruled menu and a sticky bottom action bar (Résumé · Email · Call · LinkedIn) appears; binder tabs show only from `xl`. The client lab table reflows into a two-column grid of thumbnail plus details on small screens. Scroll padding is 88px to clear the 64px sticky header.

## Elevation & Depth

Flat paper with one physical exception: attached exhibits. Screenshots sit on a dark plate with a long, soft, negatively-spread drop shadow, as if a print were clipped to the page; phone captures overlap desktop captures as a second clipped print. Everything else is tonal: paper bands, ink sheets, and hairline rules carry the structure. The sticky header and mobile bar use 85–95% paper with a 6px backdrop blur.

### Shadow Vocabulary
- **Clipped print** (`0 18px 40px -18px rgba(17,18,20,0.45)`): exhibit plates and document previews.
- **Overlapping phone print** (`0 20px 40px -16px rgba(17,18,20,0.55)`): phone captures laid over a desktop capture.
- **Pulled tab** (`-2px 2px 10px rgba(17,18,20,0.18)`): the current binder tab only.

### Named Rules
**The Only Prints Lift Rule.** Shadows belong to attached evidence and the current binder tab. Keys, tables, stamps and text blocks stay flat.

## Shapes

Rectilinear. Keys are 2px, exhibit tabs 3px on the top corners only, binder tabs 4px on the leading edge only; stamps, tables, flow boxes, method step markers and plates are square. Borders are hairlines (1px rule), with 1.5px on stamps and 2px ink tops on capability columns and "What's included" lists. Phone screenshots take a device-like rounded frame (10–14px with a thick ink border) because they depict a device, not a UI element. The only circles are the Live stamp dot and the exhibit source dot.

## Components

### Buttons (Keys)
Rectangular office keys, confident and plain.
- **Shape:** gently squared (2px), min height 44px (48px on client pages), 18px horizontal padding, 15px semibold, 8px gap to an inline SVG arrow.
- **Primary:** Ballpoint Blue with white text; hover to Blue Ink, Pressed.
- **Secondary:** 1px Graphite Ink outline; hover fills ink with paper text.
- **Quiet:** blue text link with a 40% blue underline that goes solid on hover; no padding.
- **Inverse:** paper on ink sheets; hover to Highlighter Yellow.
- **Hover / Focus / Active:** 200ms colour transitions; arrows nudge 2px in their direction; active presses down 1px; focus is a 2px blue outline at 3px offset.

### Stamps (status)
- **Style:** 1.5px border in the status colour, 11.5px bold uppercase, 0.07em tracking, square corners. Live is blue with a filled dot; Preview green; Demo data ink on yellow; Not activated red.
- **Use:** every claim of status. Stamps may carry custom wording ("AI voice not yet activated") but never a new colour.

### Exhibit Plate (signature)
A real screenshot on a Plate mat (6–8px padding) over a Plate Well, clipped print shadow, optional source URL line in 12px white/60 beneath, and optional exhibit tab above ("Exhibit A · VYBE", 12.5px semibold, 28px tall, top-rounded 3px) coloured per exhibit. Plates reveal by wiping open from the top edge (expo.inOut, ~1.1–1.25s).

### Tables and Indexes
Ink rule above the header row, hairline rules between rows, 15px text, semibold row headers, Soft Graphite secondary cells. Indexes use leader dots (1px Strong Hairline dots every 7px) between title and arrow; rows turn blue on hover.

### Navigation
- **Header:** 64px sticky paper bar with a hairline bottom rule; name in 16px extrabold, role in 14px Soft Graphite; nav items 15px Soft Graphite, current page in ink semibold with a 2px blue underline sitting on the header rule; résumé key on the right.
- **Binder tabs:** fixed to the right page edge from `xl`, 36×92px vertical tabs with 12.5px semibold labels, each a section colour; hover widens to 44px, the current section pulls out to 48px with the Pulled tab shadow.
- **Case rail:** sticky ordered contents with a hairline left rule; the current step takes a 2px blue left border and ink semibold, completed steps a 40% ink border, upcoming steps Pencil Grey.
- **Mobile:** full-screen ruled menu (22px bold rows, 56px tall) and a four-cell bottom action bar with the résumé cell in blue.

### Flow (architecture figure)
Numbered steps (two-digit tabular, 12px) in square 1px bordered boxes joined by thin SVG arrows, captioned "Figure X.n —". Tones: paper (ink border), blue (on the blue sheet), and the scoped vybe tone.

### Tracked Change (signature)
Deleted text in Pencil Grey with a Redline Red strike drawn across at 55% height; inserted text in Ballpoint Blue with a 1.5px blue underline. On load the strike scales in (0.55s) and the insertion writes in word by word; reduced motion shows the final state.

## Do's and Don'ts

### Do:
- **Do** attach proof as a real screenshot on an Exhibit Plate with its source URL.
- **Do** mark every status with a Stamp in its assigned colour (Live blue, Preview green, Demo data yellow, Not activated red).
- **Do** number sections and figures with tabular Pencil Grey numerals set inline ("2.3", "Figure A.1 —", "Table C.1 —").
- **Do** present lists and comparisons as ruled tables with hairline rows and an ink header rule.
- **Do** keep keys rectangular at 2px with a 44px minimum height.
- **Do** run motion through expo easing (`cubic-bezier(0.16, 1, 0.3, 1)`), reveal once, and fall back to the final state under reduced motion.
- **Do** confine VYBE tokens and client accents to their own exhibit, case header and /solutions pages.

### Don't:
- **Don't** use blue, red, yellow or green outside their marking-instrument roles.
- **Don't** build card grids, pill chips, numbered circles, gradient blobs, neon purple or fake dashboards; these are PRODUCT.md commitments.
- **Don't** shadow keys, tables or text blocks; only prints and the current binder tab lift.
- **Don't** introduce a second typeface or a serif; the world rejected the cream-paper-serif default.
- **Don't** restyle VYBE or any client build to match the portfolio, or bring their colours into portfolio sections.
- **Don't** use uppercase outside stamps.
