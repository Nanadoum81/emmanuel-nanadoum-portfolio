// Blair chiropractic demo kit — live features: hours, online booking with text confirmations,
// AI front desk, missed-call text-back, owner view, and the revenue-system demo.
(() => {
  const P = window.PRACTICE;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 60) : ms));
  const API = "https://emmanuel-nanadoum.vercel.app/api/receptionist";

  const ICON = {
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    bot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.9-3.5M4 4v4h4M4 13a8 8 0 0 0 14.9 3.5M20 20v-4h-4"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    send: '<path d="M4 12l16-8-6 16-2-7z"/>',
    missed: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2M16 3l5 5M21 3l-5 5"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  };
  const icon = (n) => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

  // ---------- time helpers (practice timezone) ----------
  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const nowLocal = () => {
    const f = new Intl.DateTimeFormat("en-US", { timeZone: P.tz, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
    const g = (t) => Number(f.find((p) => p.type === t).value);
    const d = new Date(Date.UTC(g("year"), g("month") - 1, g("day")));
    return { date: d, dow: d.getUTCDay(), min: g("hour") * 60 + g("minute") };
  };
  const fmtT = (m) => { const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
  const fmtPhone = (s) => { const d = s.replace(/\D/g, "").slice(-10); return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : s; };
  const fmtShort = (m) => { const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}${mm ? ":" + String(mm).padStart(2, "0") : ""}${h < 12 ? "am" : "pm"}`; };
  const addDays = (d, n) => new Date(d.getTime() + n * 864e5);
  const dayLabel = (d) => `${DAYS[d.getUTCDay()]}, ${MON[d.getUTCMonth()]} ${d.getUTCDate()}`;
  const isoDay = (d) => d.toISOString().slice(0, 10);

  // ---------- owner view event bus ----------
  const OKEY = `blair-owner-${P.slug}`;
  const readLog = () => { try { return JSON.parse(sessionStorage.getItem(OKEY) || "[]"); } catch { return []; } };
  const writeLog = (l) => { try { sessionStorage.setItem(OKEY, JSON.stringify(l.slice(-60))); } catch {} };
  const owner = {
    log(ic, title, detail) {
      const l = readLog();
      l.push({ ic, title, detail, t: Date.now() });
      writeLog(l);
      document.dispatchEvent(new CustomEvent("owner:event"));
    },
    leads() { return readLog().filter((e) => e.lead).map((e) => e.lead); },
    addLead(lead) { const l = readLog(); l.push({ ic: "user", title: "Contact created in CRM", detail: `${lead.name} · ${lead.source}`, t: Date.now(), lead }); writeLog(l); document.dispatchEvent(new CustomEvent("owner:event")); },
  };
  if (!sessionStorage.getItem(`${OKEY}-visit`)) {
    try { sessionStorage.setItem(`${OKEY}-visit`, "1"); } catch {}
    owner.log("eye", "New website visitor", `Landed on ${location.pathname === "/" ? "the home page" : location.pathname} · source ${document.referrer ? new URL(document.referrer).hostname : "direct"}`);
  }

  // ---------- header status + hours ----------
  // No verifiable hours: status says "call", booking uses clearly labeled demo availability.
  const DEMO_HOURS = { 0: [], 1: [[540, 720], [840, 1080]], 2: [[540, 720], [840, 1080]], 3: [[540, 720], [840, 1080]], 4: [[540, 720], [840, 1080]], 5: [[540, 720], [840, 1020]], 6: [] };
  const H = P.hours || DEMO_HOURS;
  const renderStatus = () => {
    const { dow, min } = nowLocal();
    if (!P.hours) {
      $$("[data-status]").forEach((el) => { $("[data-status-text]", el).textContent = "Call for hours"; });
      $$("[data-hours-now]").forEach((el) => (el.innerHTML = `Call <b>${esc(P.phone)}</b> for current office hours.`));
      $$("[data-week]").forEach((el) => (el.hidden = true));
      return;
    }
    const open = (H[dow] || []).find(([s, e]) => min >= s && min < e);
    let short, long;
    if (open) { short = `Open now · until ${fmtShort(open[1])}`; long = `<b>Open now</b>, until ${fmtT(open[1])} today.`; }
    else {
      let next = null;
      for (let k = 0; k < 8 && !next; k++) { const d = (dow + k) % 7; const s = (H[d] || []).find(([a]) => (k ? true : a > min)); if (s) next = { d, s: s[0], k }; }
      const when = !next ? "" : next.k === 0 ? `today at ${fmtShort(next.s)}` : next.k === 1 ? `tomorrow at ${fmtShort(next.s)}` : `${DOW[next.d]} at ${fmtShort(next.s)}`;
      short = `Closed · opens ${when}`; long = `<b>Closed now.</b> Opens ${when}.`;
    }
    $$("[data-status]").forEach((el) => { el.dataset.open = String(Boolean(open)); $("[data-status-text]", el).textContent = short; });
    $$("[data-hours-now]").forEach((el) => (el.innerHTML = long));
    $$("[data-week]").forEach((el) => {
      el.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => `<div class="day${d === dow ? " today" : ""}"><span class="dn">${DAYS[d]}</span><span>${(H[d] || []).length ? H[d].map(([a, b]) => `${fmtShort(a)}–${fmtShort(b)}`).join(", ") : '<span class="closed">Closed</span>'}</span></div>`).join("");
    });
  };
  renderStatus();
  setInterval(renderStatus, 60_000);

  // ---------- availability (demo) ----------
  // 30-minute slots inside listed hours; some marked taken (deterministic per date) so the calendar looks lived-in.
  const hash = (s) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
  const slotsFor = (d, fromMin = -1) => {
    const out = [];
    for (const [a, b] of H[d.getUTCDay()] || []) for (let m = a; m + 30 <= b; m += 30) if (m > fromMin) out.push({ m, taken: hash(isoDay(d) + m) % 3 === 0 });
    return out;
  };
  const openDays = (n) => {
    const { date, min } = nowLocal();
    const days = [];
    for (let k = 0; days.length < n && k < 30; k++) {
      const d = addDays(date, k);
      const s = slotsFor(d, k === 0 ? min + 60 : -1);
      if (s.some((x) => !x.taken)) days.push({ d, s });
    }
    return days;
  };

  // Next available on the home page
  $$("[data-next-slots]").forEach((el) => {
    const picks = [];
    for (const { d, s } of openDays(4)) for (const x of s) if (!x.taken && picks.length < 3 && !picks.some((p) => isoDay(p.d) === isoDay(d))) picks.push({ d, m: x.m });
    if (!picks.length) return;
    el.innerHTML = `<p>Next openings</p><div class="slot-row">${picks.map((p) => `<a class="slot-pill" href="/new-patients?d=${isoDay(p.d)}&m=${p.m}#book"><small>${DOW[p.d.getUTCDay()]} ${MON[p.d.getUTCMonth()]} ${p.d.getUTCDate()}</small><b>${fmtT(p.m)}</b></a>`).join("")}</div>`;
  });

  // ---------- phone mock (shared) ----------
  const phone = (title, sub) => {
    const el = document.createElement("div");
    el.className = "phone";
    el.innerHTML = `<div class="phone-scr" role="log" aria-label="Text messages preview"><div class="phone-top"><b>${esc(title)}</b><small>${esc(sub)}</small></div><div class="thread"></div><div class="phone-act"></div></div>`;
    const thread = $(".thread", el), act = $(".phone-act", el);
    return {
      el, thread, act,
      async them(text, meta = "") { const t = document.createElement("div"); t.className = "typing"; t.innerHTML = "<i></i><i></i><i></i>"; thread.append(t); thread.scrollTop = 1e6; await wait(900); t.remove(); const b = document.createElement("div"); b.className = "bubble"; b.innerHTML = `${esc(text)}${meta ? `<small>${esc(meta)}</small>` : ""}`; thread.append(b); thread.scrollTop = 1e6; },
      me(text) { const b = document.createElement("div"); b.className = "bubble me"; b.textContent = text; thread.append(b); thread.scrollTop = 1e6; },
      sys(text) { const s = document.createElement("div"); s.className = "sys"; s.textContent = text; thread.append(s); thread.scrollTop = 1e6; },
      buttons(list) { act.innerHTML = ""; list.forEach(([label, fn, primary]) => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; if (primary) b.className = "primary"; b.addEventListener("click", fn); act.append(b); }); },
      clear() { thread.innerHTML = ""; act.innerHTML = ""; },
    };
  };

  // ---------- booking ----------
  $$("[data-booking]").forEach((root) => {
    const q = new URLSearchParams(location.search);
    const days = openDays(12);
    let sel = { day: days[0], m: null };
    const pre = q.get("d") && days.find((x) => isoDay(x.d) === q.get("d"));
    if (pre) { sel.day = pre; const m = Number(q.get("m")); if (pre.s.some((x) => x.m === m && !x.taken)) sel.m = m; }
    let started = false;

    const pickStep = () => {
      const am = sel.day.s.filter((x) => x.m < 720), pm = sel.day.s.filter((x) => x.m >= 720);
      const grp = (label, list) => list.length ? `<p class="slot-group">${label}</p><div class="slots">${list.map((x) => `<button type="button" class="slot" data-m="${x.m}" ${x.taken ? "disabled aria-label=\"" + fmtT(x.m) + ", taken\"" : ""} aria-pressed="${sel.m === x.m}">${fmtShort(x.m)}</button>`).join("")}</div>` : "";
      root.innerHTML = `
        <p class="bk-step">Step 1 of 2</p>
        <h3 class="bk-title">Choose a day and time</h3>
        <div class="days" role="group" aria-label="Day">${days.map((x, i) => `<button type="button" class="day-btn" data-i="${i}" aria-pressed="${x === sel.day}"><small>${DOW[x.d.getUTCDay()]}</small><b>${x.d.getUTCDate()}</b><small>${MON[x.d.getUTCMonth()]}</small></button>`).join("")}</div>
        ${grp("Morning", am)}${grp("Afternoon", pm)}
        <div class="bk-foot"><p>Demo availability within the listed hours. The office confirms every request.</p><button type="button" class="btn btn-brand" data-next ${sel.m == null ? "disabled" : ""}>Continue</button></div>`;
      $$(".day-btn", root).forEach((b) => b.addEventListener("click", () => { sel = { day: days[Number(b.dataset.i)], m: null }; pickStep(); $(`.day-btn[data-i="${b.dataset.i}"]`, root)?.focus(); }));
      $$(".slot", root).forEach((b) => b.addEventListener("click", () => {
        sel.m = Number(b.dataset.m);
        if (!started) { started = true; owner.log("cal", "Booking started", `Picked ${DOW[sel.day.d.getUTCDay()]} ${fmtT(sel.m)} on the website`); }
        pickStep(); $(`.slot[data-m="${sel.m}"]`, root)?.focus();
      }));
      $("[data-next]", root).addEventListener("click", detailsStep);
    };

    const detailsStep = () => {
      root.innerHTML = `
        <p class="bk-step">Step 2 of 2</p>
        <h3 class="bk-title">Your details</h3>
        <div class="picked">${icon("cal")}<span>${dayLabel(sel.day.d)} at ${fmtT(sel.m)}</span><button type="button" data-change>Change</button></div>
        <form class="fields" novalidate>
          <fieldset class="seg"><legend>Have you been here before?</legend>
            <label><input type="radio" name="patient" value="new" checked><span>New patient</span></label>
            <label><input type="radio" name="patient" value="returning"><span>Returning</span></label>
          </fieldset>
          <div class="row2">
            <label class="field"><span>First name</span><input name="first" autocomplete="given-name" required></label>
            <label class="field"><span>Last name</span><input name="last" autocomplete="family-name" required></label>
          </div>
          <div class="row2">
            <label class="field"><span>Mobile phone</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(203) 555-0100" required></label>
            <label class="field"><span>Email <i>optional</i></span><input name="email" type="email" autocomplete="email"></label>
          </div>
          <label class="field"><span>What's bringing you in? <i>optional</i></span><input name="reason" maxlength="160" placeholder="Low back pain, a sports strain…"></label>
          <p class="bk-err" role="alert" hidden></p>
          <div class="bk-foot"><p>By booking you agree the office may text you about this appointment.</p><button class="btn btn-brand" type="submit">Request this time</button></div>
        </form>`;
      $("[data-change]", root).addEventListener("click", pickStep);
      const form = $("form", root), err = $(".bk-err", root);
      $("input[name=first]", root).focus();
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const f = new FormData(form);
        const first = String(f.get("first") || "").trim(), last = String(f.get("last") || "").trim(), ph = String(f.get("phone") || "").trim(), em = String(f.get("email") || "").trim();
        const probs = [];
        $$("input", form).forEach((i) => i.removeAttribute("aria-invalid"));
        if (!first) probs.push(["first", "your first name"]);
        if (!last) probs.push(["last", "your last name"]);
        if (ph.replace(/\D/g, "").length < 10) probs.push(["phone", "a 10-digit mobile number for the confirmation text"]);
        if (em && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) probs.push(["email", "a complete email, or leave it blank"]);
        if (probs.length) { probs.forEach(([n]) => form.elements[n].setAttribute("aria-invalid", "true")); err.textContent = `Please add ${probs.map((p) => p[1]).join(", and ")}.`; err.hidden = false; form.elements[probs[0][0]].focus(); return; }
        const btn = $("button[type=submit]", form); btn.disabled = true; btn.textContent = "Sending…";
        const when = `${dayLabel(sel.day.d)} at ${fmtT(sel.m)}`;
        const body = new FormData();
        body.append("event", JSON.stringify({ type: "external_form_submission", formId: "online-booking", timestamp: Date.now(), formData: { first_name: first, last_name: last, phone: ph, email: em, calendar_notes: `Requested ${when} · ${f.get("patient")} patient${f.get("reason") ? " · " + String(f.get("reason")).trim() : ""}` } }));
        try { await fetch("/api/demo-lead", { method: "POST", body }); } catch {}
        owner.addLead({ name: `${first} ${last[0] || ""}.`, source: "Online booking", stage: "Appointment requested", when });
        owner.log("layers", "Pipeline: Appointment requested", when);
        owner.log("msg", "Confirmation text sent", `To ${fmtPhone(ph)} within seconds`);
        owner.log("bell", "Reminders scheduled", "24 hours and 2 hours before the visit");
        owner.log("star", "Review request queued", "Sent after the visit is marked complete");
        doneStep({ first, ph: fmtPhone(ph), when, start: sel });
      });
    };

    const doneStep = async ({ first, ph, when, start }) => {
      root.innerHTML = `<div class="done"><div><p class="bk-step">Request sent</p><h3>Thanks, ${esc(first)}. Your request for ${esc(when)} is in.</h3><p>The office will confirm by text at ${esc(ph)}. Here's what you'll receive.</p><a class="btn btn-line" data-ics href="#">${icon("cal")}Add to calendar</a><p class="fine">Demo: no real texts are sent, and the office confirms every request.</p></div><div data-ph></div></div>`;
      const m = phone(P.name, "Text messages");
      $("[data-ph]", root).append(m.el);
      // .ics download
      const d = start.day.d, mm = start.m;
      const stamp = (x) => `${x.getUTCFullYear()}${String(x.getUTCMonth() + 1).padStart(2, "0")}${String(x.getUTCDate()).padStart(2, "0")}`;
      const t = (v) => `${String(Math.floor(v / 60)).padStart(2, "0")}${String(v % 60).padStart(2, "0")}00`;
      const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Blair Digital Studios//Demo//EN\r\nBEGIN:VEVENT\r\nUID:${Date.now()}@${P.slug}\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z\r\nDTSTART;TZID=${P.tz}:${stamp(d)}T${t(mm)}\r\nDTEND;TZID=${P.tz}:${stamp(d)}T${t(mm + 30)}\r\nSUMMARY:Appointment request · ${P.name}\r\nLOCATION:${P.addr}\r\nDESCRIPTION:Requested online. The office will confirm.\r\nEND:VEVENT\r\nEND:VCALENDAR`;
      const a = $("[data-ics]", root);
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
      a.download = `${P.slug}-appointment.ics`;
      root.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
      m.sys("Just now");
      await m.them(`Hi ${first}, this is ${P.name}. We received your request for ${when}. We'll text to confirm shortly. Reply STOP to opt out.`, "Confirmation · instant");
      m.sys("1 day before");
      await m.them(`Reminder: your visit at ${P.name} is tomorrow at ${fmtT(mm)}. Reply C to confirm or R to reschedule.`, "Reminder · 24 hours");
      m.me("C");
      m.sys("2 hours before");
      await m.them(`See you at ${fmtT(mm)}! ${P.addr}.`, "Reminder · 2 hours");
      m.sys("After your visit");
      await m.them(`Thanks for coming in, ${first}. If we helped, would you share a quick review? It means a lot to a small practice.`, "Review request");
    };

    pickStep();
    if (pre && location.hash === "#book") setTimeout(() => root.scrollIntoView({ block: "center" }), 50);
  });

  // ---------- missed-call text-back ----------
  $$("[data-textback]").forEach((root) => {
    const m = phone(P.name, P.phone);
    root.append(m.el);
    const reset = () => { m.clear(); m.thread.innerHTML = `<div class="ring"><svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${ICON.phone}</svg><p>${esc(P.phone)}<small>Demo phone</small></p></div>`; $(".ring .i", m.el).style.animation = "none"; m.buttons([["Call the office", call, true]]); };
    const call = async () => {
      m.act.innerHTML = "";
      m.thread.innerHTML = `<div class="ring"><svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${ICON.phone}</svg><p>Calling ${esc(P.name)}…<small>Ringing</small></p></div>`;
      owner.log("phone", "Inbound call", "Front desk busy with a patient");
      await wait(2200);
      m.thread.innerHTML = `<div class="ring missed"><svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${ICON.missed}</svg><p>Missed call<small>The front desk was with a patient</small></p></div>`;
      owner.log("missed", "Missed call detected", "Text-back triggered automatically");
      await wait(1400);
      m.thread.innerHTML = "";
      m.sys("8 seconds later");
      await m.them(`Hi, this is ${P.name}. Sorry we missed your call! Reply BOOK and we'll text you open times, or reply with your question.`, "Automatic text-back");
      owner.log("msg", "Text-back sent", "Within seconds of the missed call");
      m.buttons([["Reply BOOK", book, true], ["Reply with a question", question]]);
    };
    const book = async () => {
      m.me("BOOK"); m.act.innerHTML = "";
      const picks = [];
      for (const { d, s } of openDays(3)) { const x = s.find((y) => !y.taken); if (x) picks.push({ d, m: x.m }); }
      await m.them(`Here are the next openings: ${picks.map((p, i) => `${i + 1}) ${DOW[p.d.getUTCDay()]} ${fmtShort(p.m)}`).join("  ")}. Reply 1, 2 or 3.`);
      m.buttons(picks.map((p, i) => [`${i + 1}`, async () => {
        m.me(String(i + 1)); m.act.innerHTML = "";
        await m.them(`Great. You're requested for ${dayLabel(p.d)} at ${fmtT(p.m)}. The office will confirm, and you'll get reminders before your visit.`);
        owner.addLead({ name: "Caller ···0100", source: "Missed-call text-back", stage: "Appointment requested", when: `${dayLabel(p.d)} at ${fmtT(p.m)}` });
        owner.log("cal", "Appointment requested by text", "Recovered from a missed call");
        m.buttons([["Start over", reset]]);
      }, i === 0]));
    };
    const question = async () => {
      m.me("Do you take Medicare?"); m.act.innerHTML = "";
      await m.them(`Medicare is listed for the practice in public directories. The office will confirm your coverage. Want to book a time? Reply BOOK.`);
      owner.log("bot", "Question answered by text", "Insurance question");
      m.buttons([["Reply BOOK", book, true], ["Start over", reset]]);
    };
    reset();
  });

  // ---------- AI front desk ----------
  const fdHost = $("[data-frontdesk]");
  if (fdHost) {
    fdHost.innerHTML = `
      <button class="fd-launch" type="button" aria-expanded="false" aria-controls="fd">${'<span class="av">' + icon("bot") + "</span>"}<span class="lbl">Ask the front desk</span></button>
      <section class="fd" id="fd" hidden aria-label="AI front desk">
        <div class="fd-head"><span class="av">${icon("bot")}</span><span><b>${esc(P.name)} front desk</b><small>AI assistant · usually replies in seconds</small></span><button type="button" data-fd-close aria-label="Close">${icon("x")}</button></div>
        <div class="fd-log" data-fd-log role="log" aria-live="polite"></div>
        <form class="fd-form" data-fd-form><input name="q" autocomplete="off" placeholder="Ask about hours, insurance, booking…" aria-label="Message"><button type="button" data-fd-mic aria-pressed="false" aria-label="Talk instead of typing">${icon("mic")}</button><button type="submit" aria-label="Send">${icon("send")}</button></form>
        <p class="fd-foot">An AI assistant for this demo. It can't see your records and never books on its own; the office confirms.</p>
      </section>`;
    const launch = $(".fd-launch", fdHost), panel = $(".fd", fdHost), log = $("[data-fd-log]", fdHost), form = $("[data-fd-form]", fdHost), input = form.elements.q, mic = $("[data-fd-mic]", fdHost);
    const msgs = [];
    let opened = false, busy = false;
    const add = (role, text) => { const d = document.createElement("div"); d.className = `msg ${role === "user" ? "me" : "ai"}`; d.textContent = text; log.append(d); log.scrollTop = 1e6; };
    const chips = (list) => { const c = document.createElement("div"); c.className = "chips"; list.forEach((t) => { const b = document.createElement("button"); b.type = "button"; b.textContent = t; b.addEventListener("click", () => { c.remove(); send(t); }); c.append(b); }); log.append(c); };
    const greet = `Hi! You've reached the virtual front desk for ${P.name}. I'm an AI assistant. How can I help today?`;
    const open = () => {
      panel.hidden = false; launch.hidden = true; launch.setAttribute("aria-expanded", "true");
      if (!opened) { opened = true; add("assistant", greet); msgs.push({ role: "assistant", text: greet }); chips(["What are your hours?", "Do you take Medicare?", "I'd like an appointment"]); owner.log("bot", "AI front desk opened", "Visitor started a conversation"); }
      input.focus();
    };
    const close = () => { panel.hidden = true; launch.hidden = false; launch.setAttribute("aria-expanded", "false"); launch.focus(); speechSynthesis?.cancel?.(); };
    launch.addEventListener("click", open);
    $$("[data-open-frontdesk]").forEach((b) => b.addEventListener("click", open));
    $("[data-fd-close]", fdHost).addEventListener("click", close);
    panel.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    let voiceMode = false;
    const speak = (text) => { if (!voiceMode || !("speechSynthesis" in window)) return; const u = new SpeechSynthesisUtterance(text); u.rate = 1; speechSynthesis.cancel(); speechSynthesis.speak(u); };
    const send = async (text) => {
      if (busy || !text.trim()) return;
      busy = true; add("user", text); msgs.push({ role: "user", text });
      if (msgs.filter((m) => m.role === "user").length === 1) owner.log("msg", "Question asked", `“${text.slice(0, 60)}”`);
      const typing = document.createElement("div"); typing.className = "typing"; typing.innerHTML = "<i></i><i></i><i></i>"; log.append(typing); log.scrollTop = 1e6;
      let reply;
      try {
        const r = await fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ practice: P.key, messages: msgs.slice(-16) }) });
        const j = await r.json().catch(() => ({}));
        reply = j.reply || (r.status === 429 ? "We're getting a lot of questions right now. Please try again in a moment, or call the office." : `I'm having trouble right now. Please call ${P.phone}.`);
      } catch { reply = `I can't connect right now. Please call ${P.phone}.`; }
      typing.remove(); add("assistant", reply); msgs.push({ role: "assistant", text: reply }); speak(reply);
      if (/appointment|book|schedule/i.test(text)) owner.log("cal", "Appointment intent detected", "AI front desk collecting details for the office");
      busy = false;
    };
    form.addEventListener("submit", (e) => { e.preventDefault(); const t = input.value; input.value = ""; send(t); });
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) mic.hidden = true;
    else mic.addEventListener("click", () => {
      voiceMode = true;
      const rec = new SR(); rec.lang = "en-US"; rec.interimResults = false;
      mic.setAttribute("aria-pressed", "true");
      rec.onresult = (e) => send(e.results[0][0].transcript);
      rec.onend = () => mic.setAttribute("aria-pressed", "false");
      rec.onerror = () => mic.setAttribute("aria-pressed", "false");
      rec.start();
    });
  }

  // ---------- owner view ----------
  const ovHost = $("[data-owner]");
  if (ovHost) {
    ovHost.innerHTML = `
      <button class="ov-launch" type="button" aria-expanded="false" aria-controls="ov">${icon("eye")}<span>Owner view</span><span class="ov-count" data-ov-count>0</span></button>
      <aside class="ov" id="ov" hidden aria-label="Owner view">
        <div class="ov-head"><p>Blair Digital Studios · demo</p><h2>What runs behind this site</h2><small>Every action on the site, as the practice would see it in the CRM.</small><button class="ov-close" type="button" data-ov-close aria-label="Close">${icon("x")}</button></div>
        <div class="ov-stats"><div><b data-s-leads>0</b><small>Leads captured</small></div><div><b data-s-texts>0</b><small>Texts sent</small></div><div><b data-s-rem>0</b><small>Reminders set</small></div></div>
        <ol class="ov-feed" data-ov-feed></ol>
        <div class="ov-foot"><a href="/revenue-system">Open the full revenue system</a><button type="button" data-ov-reset>Reset demo</button></div>
      </aside>`;
    const btn = $(".ov-launch", ovHost), ov = $(".ov", ovHost), feed = $("[data-ov-feed]", ovHost);
    let seen = readLog().length;
    const render = () => {
      const l = readLog();
      $("[data-ov-count]", ovHost).textContent = l.length;
      $("[data-s-leads]", ovHost).textContent = l.filter((e) => e.lead).length;
      $("[data-s-texts]", ovHost).textContent = l.filter((e) => /text|Confirmation/i.test(e.title)).length;
      $("[data-s-rem]", ovHost).textContent = l.filter((e) => /Reminders/.test(e.title)).length * 2;
      feed.innerHTML = l.length ? l.slice().reverse().map((e, i) => `<li class="${i < l.length - seen ? "fresh" : ""}"><span class="ic">${icon(e.ic in ICON ? e.ic : "check")}</span><span><b>${esc(e.title)}</b><small>${esc(e.detail || "")}</small><time>${new Date(e.t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" })}</time></span></li>`).join("") : '<li class="ov-empty">Use the site: book a time, ask the front desk, or try the missed-call text-back.</li>';
    };
    render();
    document.addEventListener("owner:event", () => { render(); btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump"); });
    btn.addEventListener("click", () => { ov.hidden = false; btn.setAttribute("aria-expanded", "true"); render(); seen = readLog().length; $("[data-ov-close]", ovHost).focus(); });
    $("[data-ov-close]", ovHost).addEventListener("click", () => { ov.hidden = true; btn.setAttribute("aria-expanded", "false"); btn.focus(); });
    ov.addEventListener("keydown", (e) => { if (e.key === "Escape") $("[data-ov-close]", ovHost).click(); });
    $("[data-ov-reset]", ovHost).addEventListener("click", () => { writeLog([]); seen = 0; render(); document.dispatchEvent(new CustomEvent("owner:reset")); });
  }

  // ---------- revenue system page ----------
  const rs = $("[data-rs]");
  if (rs) {
    const JOURNEY = [["phone", "Call or web inquiry", "A prospect calls, texts or books online."], ["bot", "Instant response", "AI front desk or auto-text replies in seconds."], ["user", "Contact created", "The person becomes a tracked contact."], ["layers", "CRM record", "Source, history and notes in one place."], ["refresh", "Pipeline", "An opportunity enters the new-patient pipeline."], ["cal", "Appointment", "A visit is requested, then confirmed."], ["msg", "Text and email confirmation", "Sent the moment the request lands."], ["bell", "Reminders", "Two-way texts at 24 hours and 2 hours."], ["check", "Show or no-show", "The outcome is logged."], ["refresh", "Follow-up", "No-shows and open leads get automatic follow-up."], ["star", "Review request", "Happy patients are asked for a review."], ["refresh", "Reactivation", "Patients who drift away are invited back."], ["chart", "Reporting", "Every step is measured."]];
    const MODULES = [["bot", "AI front desk", "Answers questions and takes appointment requests on the website, 24/7.", "Live in this demo"], ["missed", "Missed-call text-back", "An unanswered call gets a text within seconds with a way to book.", "Live in this demo"], ["cal", "Online booking", "Real time slots from the practice's hours, with instant confirmation.", "Live in this demo"], ["bell", "No-show protection", "Two-way reminders and waitlist backfill keep the schedule full.", "Ready to configure"], ["star", "Review automation", "Neutral review requests after visits; concerns routed privately.", "Ready to configure"], ["refresh", "Patient reactivation", "Re-engages patients who haven't been in for a while.", "Ready to configure"]];
    const STAGES = ["New inquiry", "Contacted", "Appointment requested", "Scheduled", "Confirmed", "Showed", "Follow-up", "Reactivation"];
    const SAMPLE = { "New inquiry": ["Test Lead 01", "Test Lead 02", "Test Lead 03"], Contacted: ["Test Lead 04", "Test Lead 05"], "Appointment requested": ["Test Lead 06"], Scheduled: ["Demo Patient A", "Demo Patient B"], Confirmed: ["Demo Patient A"], Showed: ["Demo Patient C"], "Follow-up": ["Test Lead 04"], Reactivation: ["Demo Patient D"] };
    const INTENTS = [["New patient", "First visit questions"], ["Book appointment", "Collects details for the office"], ["Reschedule", "Passes the request to staff"], ["Office hours", "Listed hours, call to confirm"], ["Location", "Address and directions"], ["Insurance", "Listed plans, confirm by phone"], ["Services", "Care the practice offers"], ["Speak to a person", "Hands off to the office"], ["Clinical concern", "No advice; 911 or doctor guidance"], ["General question", "Anything else"], ["Records", "Fax line for physicians and attorneys"], ["Accessibility", "Wheelchair access details"]];
    const panels = {
      journey: `<h2 class="h2">One connected patient journey</h2><p class="lede">A single person flows through the entire system automatically, from the first contact to a scheduled, reminded, reviewed patient.</p><ol class="journey">${JOURNEY.map(([ic, t, d]) => `<li>${icon(ic)}<b>${t}</b><small>${d}</small></li>`).join("")}</ol>`,
      modules: `<h2 class="h2">System modules</h2><p class="lede">Each module works on its own and better together. Three are running on this demo site right now.</p><div class="modules">${MODULES.map(([ic, t, d, s]) => `<div class="module">${icon(ic)}<b>${t}</b><p>${d}</p><span class="tag${s.startsWith("Live") ? " live" : ""}">${s}</span></div>`).join("")}</div>`,
      crm: `<h2 class="h2">CRM pipeline</h2><p class="lede">Sample leads, plus any request you make on this site from this browser, highlighted so you can follow it.</p><div class="board" data-board></div>`,
      voice: `<h2 class="h2">AI front desk</h2><p class="lede">Grounded in ${esc(P.name)}'s public details. It answers questions, collects appointment requests for the office, and never gives medical advice or claims to book on its own.</p><div class="voice-row"><button type="button" class="btn btn-brand" data-open-frontdesk>${icon("bot")}Talk to it now</button><span class="muted">Type or use your microphone. Pretend you're a new patient.</span></div><h3 class="h3" style="margin-top:28px">What it recognizes</h3><div class="intents">${INTENTS.map(([t, d]) => `<div class="intent"><b>${t}</b><small>${d}</small></div>`).join("")}</div>`,
      flows: `<h2 class="h2">Workflow demos</h2><p class="lede">Trigger a practice event and watch the automation respond.</p><div class="flows"><div><div class="flow-btns"><button class="btn btn-line" data-flow="missed">${icon("missed")}Missed call</button><button class="btn btn-line" data-flow="web">${icon("cal")}Web booking</button><button class="btn btn-line" data-flow="noshow">${icon("bell")}No-show</button><button class="btn btn-line" data-flow="inactive">${icon("refresh")}Inactive patient</button></div><div class="console" data-console aria-live="polite"><span class="t">Choose a trigger above to run a demo workflow…</span></div></div></div>`,
      reports: `<h2 class="h2">Reporting</h2><p class="lede">What the practice sees each month. <b>Sample data for illustration only</b>, not results for ${esc(P.name)}.</p><div class="kpis"><div class="kpi"><b>48</b><small>New inquiries (sample)</small></div><div class="kpi"><b>31</b><small>Appointments requested (sample)</small></div><div class="kpi"><b>12</b><small>Missed calls recovered (sample)</small></div><div class="kpi"><b>9</b><small>New reviews (sample)</small></div></div><h3 class="h3" style="margin-top:28px">Where inquiries came from (sample)</h3><div class="bars">${[["Online booking", 38], ["Phone", 27], ["AI front desk", 17], ["Missed-call text-back", 12], ["Reactivation", 6]].map(([l, v]) => `<div class="bar"><span>${l}</span><span><i style="width:${v * 2.4}%"></i></span><span>${v}%</span></div>`).join("")}</div>`,
    };
    rs.innerHTML = Object.entries(panels).map(([id, html], i) => `<div class="panel" role="tabpanel" id="p-${id}" aria-labelledby="t-${id}" ${i ? "hidden" : ""} tabindex="0">${html}</div>`).join("");
    const tabs = $$('[role="tab"]');
    const show = (t) => { tabs.forEach((x) => { const on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; $(`#${x.getAttribute("aria-controls")}`).hidden = !on; }); };
    tabs.forEach((t, i) => { t.addEventListener("click", () => show(t)); t.addEventListener("keydown", (e) => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0; if (d) { const n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); show(n); } }); });
    $$("[data-open-frontdesk]", rs).forEach((b) => b.addEventListener("click", () => $(".fd-launch")?.click()));
    const board = () => {
      const mine = owner.leads();
      $("[data-board]").innerHTML = STAGES.map((s) => {
        const you = mine.filter((l) => l.stage === s);
        const cards = [...you.map((l) => `<div class="card you">${esc(l.name)}<small>${esc(l.source)}${l.when ? " · " + esc(l.when) : ""}</small></div>`), ...(SAMPLE[s] || []).map((n) => `<div class="card">${n}<small>Demo data</small></div>`)];
        return `<div class="col"><h3><span>${s}</span><span>${cards.length}</span></h3>${cards.join("")}</div>`;
      }).join("");
    };
    board();
    document.addEventListener("owner:event", board);
    document.addEventListener("owner:reset", board);

    const con = $("[data-console]");
    let running = false;
    const line = (cls, text) => { const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }); con.insertAdjacentHTML("beforeend", `<div><span class="t">${ts}</span> <span class="${cls}">${esc(text)}</span></div>`); con.scrollTop = 1e6; };
    const FLOWS = {
      missed: [["ev", "TRIGGER  Inbound call not answered (front desk busy)"], ["ok", "ACTION   Text-back sent: 'Sorry we missed your call! Reply BOOK…'"], ["ok", "ACTION   Contact created · source: missed call"], ["ok", "ACTION   Opportunity → New inquiry"], ["ev", "WAIT     Reply received: BOOK"], ["ok", "ACTION   Three open times texted"], ["ok", "ACTION   Opportunity → Appointment requested · staff notified"]],
      web: [["ev", "TRIGGER  Online booking request"], ["ok", "ACTION   Contact created · source: website"], ["ok", "ACTION   Confirmation text + email sent"], ["ok", "ACTION   Reminders scheduled: −24h, −2h"], ["ok", "ACTION   Opportunity → Appointment requested"], ["ev", "WAIT     Staff confirms in calendar"], ["ok", "ACTION   Opportunity → Scheduled"]],
      noshow: [["ev", "TRIGGER  Appointment marked no-show"], ["ok", "ACTION   Text: 'We missed you today. Want to pick a new time?'"], ["ok", "ACTION   Opportunity → Follow-up"], ["ev", "WAIT     2 days, no reply"], ["ok", "ACTION   Second follow-up text with open times"], ["ok", "ACTION   Task created for the front desk to call"]],
      inactive: [["ev", "TRIGGER  Patient not seen in 6 months"], ["ok", "ACTION   Friendly check-in text sent"], ["ev", "WAIT     Reply received: 'yes, my back is acting up'"], ["ok", "ACTION   Booking link texted"], ["ok", "ACTION   Opportunity → Reactivation → Appointment requested"]],
    };
    $$("[data-flow]").forEach((b) => b.addEventListener("click", async () => {
      if (running) return; running = true;
      con.innerHTML = "";
      for (const [c, t] of FLOWS[b.dataset.flow]) { line(c, t); await wait(650); }
      line("t", "Workflow complete · demo only, no messages were sent");
      owner.log("refresh", "Workflow demo run", b.textContent.trim());
      running = false;
    }));
  }
})();
