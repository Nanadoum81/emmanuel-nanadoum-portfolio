import type { Metadata } from "next";
import { ReceptionistConsole } from "@/components/ReceptionistConsole";
import { Flow } from "@/components/Flow";
import { Stamp } from "@/components/Stamp";

export const metadata: Metadata = {
  title: "AI receptionist — live voice demo",
  description: "Talk to the Blair Digital Studios AI receptionist in your browser: it qualifies practice owners, runs a front-desk demo, and hands off to Emmanuel.",
  alternates: { canonical: "/receptionist" },
};

export default async function ReceptionistPage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const { demo } = await searchParams;
  const isDemo = demo === "1" || demo === "chiro";
  return (
    <section className="mx-auto grid max-w-[1360px] grid-cols-1 gap-12 px-[var(--gutter)] pb-24 pt-12 lg:grid-cols-12 lg:pt-16">
      <div className="lg:col-span-5">
        <h1 className="text-[clamp(40px,5.6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.04em]">AI receptionist</h1>
        <p className="mt-5 max-w-[36ch] text-[clamp(19px,1.8vw,23px)] font-medium leading-[1.35]">
          {isDemo
            ? "You're talking to the front desk of Blair Demo Chiropractic, a fictional practice. Ask about a visit and request an appointment."
            : "Talk to it the way a patient or practice owner would. It qualifies the caller, runs a front-desk demo on request, and hands off to Emmanuel."}
        </p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Status">
          <li><Stamp tally="live">Live in your browser</Stamp></li>
          <li><Stamp tally="demo">Nothing is booked</Stamp></li>
        </ul>
        <div className="mt-10">
          <h2 className="text-[18px] font-bold tracking-normal">How it works</h2>
          <div className="mt-4">
            <Flow
              stack
              steps={[
                { label: "Browser speech recognition", note: "Your words become text on your device" },
                { label: "/api/receptionist", note: "Conversation + instructions" },
                { label: "Google Gemini", note: "Short, guarded replies" },
                { label: "Browser voice", note: "The reply is spoken back" },
                { label: "Hand-off", note: "Email the conversation to Emmanuel" },
              ]}
            />
          </div>
          <p className="mt-4 max-w-[52ch] text-[15px] text-ink-2">
            Guardrails: it says it's an AI, never quotes prices or results, gives no medical advice, and only collects details for a human to confirm. A phone line can be attached to the same instructions later.
          </p>
        </div>
      </div>
      <div className="lg:col-span-7">
        <ReceptionistConsole demo={isDemo} />
        <p className="mt-3 text-[13.5px] text-ink-2">Works best in Chrome, Edge or Safari. Firefox can type instead of talk.</p>
      </div>
    </section>
  );
}
