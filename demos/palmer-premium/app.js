// Palmer & Herman: colorway preview, plaque light, live hours, map, appointment request.
(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- colorways (prospect preview control) ----
  const THEME = { oxblood: "#230709", green: "#081a13", navy: "#08111f", limestone: "#2a241d" };
  const setColorway = (cw, push) => {
    if (!THEME[cw]) cw = "oxblood";
    root.dataset.colorway = cw;
    $('meta[name="theme-color"]').setAttribute("content", THEME[cw]);
    $$("[data-cw]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.cw === cw)));
    if (push) {
      const u = new URL(location.href);
      u.searchParams.set("colorway", cw);
      history.replaceState(null, "", u);
    }
  };
  setColorway(new URLSearchParams(location.search).get("colorway") || "oxblood");
  $$("[data-cw]").forEach((b) => b.addEventListener("click", () => setColorway(b.dataset.cw, true)));
  // Arrow keys move between colorways like a radio group.
  $("[data-colorways]")?.addEventListener("keydown", (e) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
    const btns = $$("[data-cw]");
    const i = btns.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    const next = btns[(i + (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : btns.length - 1)) % btns.length];
    next.focus();
    setColorway(next.dataset.cw, true);
  });

  // Collapsible on small screens so it never covers the page.
  const cwBox = $("[data-colorways]"), cwBtn = $("[data-cw-toggle]");
  const collapse = (c) => { cwBox.dataset.collapsed = String(c); cwBtn.setAttribute("aria-expanded", String(!c)); cwBtn.textContent = c ? "Colorways" : "Hide"; };
  collapse(matchMedia("(max-width: 640px)").matches);
  cwBtn.addEventListener("click", () => collapse(cwBox.dataset.collapsed !== "true"));

  // ---- plaque: light follows the pointer across the brass ----
  const plaque = $("[data-plaque]");
  if (plaque && !reduced) {
    const door = plaque.closest(".door");
    let raf = 0;
    door.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = plaque.getBoundingClientRect();
        plaque.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        plaque.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
    // One slow pass of light on arrival.
    const start = performance.now();
    const sweep = (t) => {
      const p = Math.min(1, (t - start) / 2200);
      const ease = 1 - Math.pow(1 - p, 3);
      plaque.style.setProperty("--mx", `${-20 + ease * 70}%`);
      plaque.style.setProperty("--my", `${10 + ease * 15}%`);
      if (p < 1) requestAnimationFrame(sweep);
    };
    requestAnimationFrame(sweep);
  }

  // ---- hours (as publicly listed; Naugatuck time) ----
  // minutes from midnight; day 0 = Sunday
  const SPLIT = [[480, 720], [840, 1050]];
  const SHORT = [[510, 630]];
  const HOURS = { 0: [], 1: SPLIT, 2: SPLIT, 3: SPLIT, 4: SHORT, 5: SPLIT, 6: SHORT };
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const fmt = (m) => {
    const h = Math.floor(m / 60), mm = m % 60, h12 = ((h + 11) % 12) + 1;
    return `${h12}${mm ? ":" + String(mm).padStart(2, "0") : ""} ${h < 12 ? "a.m." : "p.m."}`;
  };
  const nowCT = () => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t)?.value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, min: Number(get("hour")) * 60 + Number(get("minute")) };
  };
  const nextOpening = (day, min) => {
    for (let k = 0; k < 8; k++) {
      const d = (day + k) % 7;
      const slot = HOURS[d].find(([s]) => (k ? true : s > min));
      if (slot) return { d, s: slot[0], k };
    }
    return null;
  };
  const renderHours = () => {
    const { day, min } = nowCT();
    const open = HOURS[day].find(([s, e]) => min >= s && min < e);
    let short, long;
    if (open) {
      short = `Open now · until ${fmt(open[1])}`;
      long = `The office is open now, until ${fmt(open[1])} today.`;
    } else {
      const n = nextOpening(day, min);
      const when = !n ? "" : n.k === 0 ? `today at ${fmt(n.s)}` : n.k === 1 ? `tomorrow at ${fmt(n.s)}` : `${DAYS[n.d]} at ${fmt(n.s)}`;
      short = `Closed · opens ${when}`;
      long = `The office is closed right now. It opens ${when}.`;
    }
    const st = $("[data-status]");
    st.dataset.open = String(Boolean(open));
    $("[data-status-text]").textContent = short;
    $("[data-hours-now]").textContent = long;

    $$(".day").forEach((row) => row.classList.toggle("today", Number(row.dataset.day) === day));
    const line = $("[data-nowline]");
    const week = $("[data-week]");
    const row = $(`.day[data-day="${day}"]`, week);
    const track = row && $(".track", row);
    // Scale runs 8 a.m. to 6 p.m.
    if (track && min >= 480 && min <= 1080) {
      const wr = week.getBoundingClientRect(), tr = track.getBoundingClientRect();
      line.style.left = `${tr.left - wr.left + ((min - 480) / 600) * tr.width}px`;
      line.style.top = `${tr.top - wr.top - 6}px`;
      line.style.height = `${tr.height + 12}px`;
      line.style.bottom = "auto";
      line.style.display = "block";
    } else line.style.display = "none";
  };
  renderHours();
  setInterval(renderHours, 60_000);
  addEventListener("resize", renderHours);

  // ---- map loads only when asked ----
  $("[data-map-load]")?.addEventListener("click", () => {
    const map = $("[data-map]");
    map.innerHTML = '<iframe title="Map of 331 Church Street, Naugatuck" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=331+Church+St,+Naugatuck,+CT+06770&output=embed"></iframe>';
  });

  // ---- appointment request ----
  const form = $("[data-form]");
  const err = $("[data-form-error]");
  const btn = $("[data-submit]");
  const digits = (s) => s.replace(/\D/g, "");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.hidden = true;
    const f = new FormData(form);
    const first = String(f.get("first_name") || "").trim();
    const last = String(f.get("last_name") || "").trim();
    const phone = String(f.get("phone") || "").trim();
    const email = String(f.get("email") || "").trim();
    const problems = [];
    $$("input", form).forEach((i) => i.removeAttribute("aria-invalid"));
    if (!first) problems.push(["first_name", "your first name"]);
    if (!last) problems.push(["last_name", "your last name"]);
    if (digits(phone).length < 10) problems.push(["phone", "a phone number the office can call (10 digits)"]);
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) problems.push(["email", "a complete email address, or leave it blank"]);
    if (problems.length) {
      problems.forEach(([n]) => form.elements[n].setAttribute("aria-invalid", "true"));
      err.textContent = `Please add ${problems.map((p) => p[1]).join(", and ")}.`;
      err.hidden = false;
      form.elements[problems[0][0]].focus();
      return;
    }
    const days = f.getAll("days");
    const notes = [
      `Patient: ${f.get("patient")}`,
      `Days: ${days.length ? days.join(", ") : "any"}`,
      `Time: ${f.get("time")}`,
      f.get("reason") ? `Reason: ${String(f.get("reason")).trim()}` : "",
    ].filter(Boolean).join(" · ");
    const body = new FormData();
    body.append("event", JSON.stringify({
      type: "external_form_submission",
      formId: "palmer-premium-request",
      timestamp: Date.now(),
      formData: { first_name: first, last_name: last, phone, email, calendar_notes: notes },
    }));
    btn.disabled = true;
    btn.firstElementChild.textContent = "Sending…";
    try {
      const res = await fetch("/api/demo-lead", { method: "POST", body });
      if (!res.ok) throw new Error(String(res.status));
      $("[data-done-phone]").textContent = phone;
      form.classList.add("sent");
      const done = $("[data-form-done]");
      done.hidden = false;
      done.focus();
    } catch {
      err.textContent = "That didn't go through. Please try again, or call (203) 729-4047.";
      err.hidden = false;
    } finally {
      btn.disabled = false;
      btn.firstElementChild.textContent = "Send request";
    }
  });
})();
