"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { person } from "@/lib/site";
import { track } from "@vercel/analytics";

type Msg = { role: "user" | "assistant"; text: string };
type Status = "idle" | "listening" | "thinking" | "speaking" | "offline" | "error" | "nomic";

/* Minimal typing for the Web Speech API (not in lib.dom for all targets). */
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

const GREETING = {
  blair: "Thanks for visiting Blair Digital Studios. I'm the studio's AI receptionist. Are you here about a system for your practice, or would you like to hear a demo of an AI front desk?",
  demo: "Thanks for calling Blair Demo Chiropractic, this is the AI front desk. How can I help you today?",
};

const statusText: Record<Status, string> = {
  idle: "Ready",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
  offline: "The receptionist is offline right now",
  error: "Something went wrong — try again or type instead",
  nomic: "Microphone is blocked — type instead",
};

export function ReceptionistConsole({ demo = false }: { demo?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);
  const [handsFree, setHandsFree] = useState(true);
  const [draft, setDraft] = useState("");
  const [canListen, setCanListen] = useState(false);
  const recRef = useRef<Recognition | null>(null);
  const msgsRef = useRef<Msg[]>([]);
  const handsFreeRef = useRef(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    msgsRef.current = messages;
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    handsFreeRef.current = handsFree;
  }, [handsFree]);
  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    setCanListen(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
    return () => {
      recRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  const pickVoice = () => {
    const voices = window.speechSynthesis?.getVoices() || [];
    const prefs = [/Google US English/i, /Samantha/i, /Ava/i, /Allison/i, /Microsoft (Aria|Jenny)/i, /en-US/i];
    for (const p of prefs) {
      const v = voices.find((x) => p.test(x.name) || p.test(x.lang));
      if (v) return v;
    }
    return voices[0];
  };

  const speak = useCallback((text: string) =>
    new Promise<void>((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth) return resolve();
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if (v) u.voice = v;
      u.rate = 1.02;
      // Some browsers never fire onend; never let speech block the conversation.
      const fallback = window.setTimeout(() => resolve(), Math.min(20000, 1500 + text.length * 75));
      const done = () => {
        window.clearTimeout(fallback);
        resolve();
      };
      u.onend = done;
      u.onerror = done;
      setStatus("speaking");
      synth.speak(u);
    }), []);

  const listen = useCallback(() => {
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    recRef.current?.abort();
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setDraft(finalText || interim);
    };
    rec.onerror = (e) => {
      // Only a live listening session may change the status; never mask offline or thinking.
      setStatus((s) => {
        if (s !== "listening") return s;
        if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "audio-capture") {
          setHandsFree(false);
          return "nomic";
        }
        return e.error === "no-speech" || e.error === "aborted" ? "idle" : "error";
      });
    };
    rec.onend = () => {
      const said = finalText.trim();
      setDraft("");
      if (said) void send(said);
      else setStatus((s) => (s === "listening" ? "idle" : s));
    };
    recRef.current = rec;
    setStatus("listening");
    rec.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const send = useCallback(
    async (text: string) => {
      const next = [...msgsRef.current, { role: "user" as const, text }];
      setMessages(next);
      setStatus("thinking");
      try {
        const res = await fetch("/api/receptionist", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: next, demo }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.status === 503) return setStatus("offline");
        if (!res.ok || !data.reply) {
          const reply = res.status === 429 ? "I'm getting a lot of questions right now. Please try again in a minute, or email Emmanuel." : "Sorry, I had trouble with that. Could you try again?";
          setMessages((m) => [...m, { role: "assistant", text: reply }]);
          await speak(reply);
          return setStatus("idle");
        }
        setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
        await speak(data.reply);
        if (handsFreeRef.current && canListenNow()) listen();
        else setStatus("idle");
      } catch {
        setStatus("error");
      }
    },
    [demo, listen, speak]
  );

  const canListenNow = () => {
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
  };

  const start = async () => {
    setStarted(true);
    track("receptionist_start", { demo: String(demo) });
    const greeting = demo ? GREETING.demo : GREETING.blair;
    setMessages([{ role: "assistant", text: greeting }]);
    await speak(greeting);
    if (handsFreeRef.current && canListenNow()) listen();
    else setStatus("idle");
  };

  const stopAll = () => {
    recRef.current?.abort();
    window.speechSynthesis?.cancel();
    setStatus("idle");
  };

  const transcript = messages.map((m) => `${m.role === "user" ? "Me" : "Receptionist"}: ${m.text}`).join("\n");
  const mailHref = `mailto:${person.email}?subject=${encodeURIComponent(demo ? "AI receptionist demo — my conversation" : "Blair Digital Studios — from the AI receptionist")}&body=${encodeURIComponent((transcript || "").slice(0, 1800))}`;

  const busy = status === "thinking";

  return (
    <div className="border border-ink bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink px-4 py-3">
        <p className="flex items-center gap-2 text-[14.5px] font-semibold" aria-live="polite">
          <span
            aria-hidden
            className={`size-2.5 rounded-full ${status === "listening" ? "animate-pulse bg-red" : status === "speaking" ? "bg-blue" : status === "thinking" ? "animate-pulse bg-yellow" : status === "offline" || status === "error" || status === "nomic" ? "bg-ink-3" : "bg-green"}`}
          />
          {started ? statusText[status] : demo ? "Demo: Blair Demo Chiropractic front desk" : "Blair Digital Studios AI receptionist"}
        </p>
        <label className="flex items-center gap-2 text-[14px] text-ink-2">
          <input type="checkbox" checked={handsFree} onChange={(e) => setHandsFree(e.target.checked)} className="size-4 accent-[var(--color-blue)]" />
          Hands-free
        </label>
      </div>

      <div className="h-[min(52vh,440px)] overflow-y-auto px-4 py-4" role="log" aria-live="polite" aria-label="Conversation">
        {!started ? (
          <div className="grid h-full place-content-center gap-4 text-center">
            <p className="mx-auto max-w-[40ch] text-ink-2">
              Press start and talk normally. {canListen ? "Your browser listens and speaks; nothing is recorded on this site." : "Your browser doesn't support voice input, so you can type instead."}
            </p>
            <button type="button" onClick={start} className="mx-auto inline-flex min-h-12 items-center gap-2 rounded-[2px] bg-blue px-6 text-[16px] font-semibold text-white hover:bg-blue-deep">
              <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="currentColor"><path d="M8 1.5a2.5 2.5 0 0 0-2.5 2.5v4a2.5 2.5 0 0 0 5 0V4A2.5 2.5 0 0 0 8 1.5zM3.5 7.5a.75.75 0 0 1 .75.75 3.75 3.75 0 0 0 7.5 0 .75.75 0 0 1 1.5 0 5.25 5.25 0 0 1-4.5 5.2V15a.75.75 0 0 1-1.5 0v-1.55A5.25 5.25 0 0 1 2.75 8.25a.75.75 0 0 1 .75-.75z" /></svg>
              Start conversation
            </button>
          </div>
        ) : (
          <ol className="grid gap-3">
            {messages.map((m, i) => (
              <li key={i} className={`max-w-[85%] px-3.5 py-2.5 text-[16px] leading-snug ${m.role === "user" ? "ml-auto bg-ink text-paper" : "border border-rule bg-paper-2"}`}>
                <span className="sr-only">{m.role === "user" ? "You: " : "Receptionist: "}</span>
                {m.text}
              </li>
            ))}
            {draft && <li className="ml-auto max-w-[85%] bg-ink/60 px-3.5 py-2.5 text-[16px] text-paper">{draft}</li>}
            {status === "offline" && (
              <li className="border border-red px-3.5 py-2.5 text-[15px] text-red">
                The receptionist is offline right now. You can still reach Emmanuel at <a className="underline" href={`mailto:${person.email}`}>{person.email}</a>.
              </li>
            )}
          </ol>
        )}
        <div ref={endRef} />
      </div>

      {started && (
        <div className="grid gap-3 border-t border-ink px-4 py-3">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const t = draft.trim();
              if (!t || busy) return;
              setDraft("");
              recRef.current?.abort();
              window.speechSynthesis?.cancel();
              void send(t);
            }}
          >
            <label htmlFor="receptionist-input" className="sr-only">Type a message</label>
            <input
              id="receptionist-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => {
                if (status === "listening") {
                  recRef.current?.abort();
                  setStatus("idle");
                }
              }}
              placeholder="Type instead of talking…"
              className="min-h-11 min-w-0 flex-1 border border-rule-strong bg-paper px-3 text-[16px] outline-none focus:border-blue"
            />
            <button type="submit" disabled={busy || !draft.trim()} className="min-h-11 rounded-[2px] bg-ink px-4 text-[15px] font-semibold text-paper disabled:opacity-40">
              Send
            </button>
          </form>
          <div className="flex flex-wrap items-center gap-3">
            {canListen && (
              <button type="button" onClick={status === "listening" ? stopAll : listen} disabled={status === "thinking"} className="inline-flex min-h-11 items-center gap-2 rounded-[2px] border border-ink px-4 text-[15px] font-semibold hover:bg-ink hover:text-paper disabled:opacity-40">
                {status === "listening" ? "Stop listening" : "Talk"}
              </button>
            )}
            {status === "speaking" && (
              <button type="button" onClick={stopAll} className="inline-flex min-h-11 items-center rounded-[2px] border border-rule-strong px-4 text-[15px]">
                Stop speaking
              </button>
            )}
            <a href={mailHref} onClick={() => track("receptionist_email", { demo: String(demo) })} className="doc-link ml-auto inline-flex min-h-11 items-center text-[15px] font-semibold">
              Email this conversation to Emmanuel
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
