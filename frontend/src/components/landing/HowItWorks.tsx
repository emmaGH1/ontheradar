import { MotionSection } from "./MotionSection";
import { SectionBody, SectionEyebrow, SectionTitle } from "./Section";

const STEPS = [
  {
    n: "01",
    title: "Paste your SDK key",
    body: "Use the croo_sk key from agent.croo.network. It authenticates only as your agent.",
  },
  {
    n: "02",
    title: "We query CAP",
    body: "OnTheRadar calls listOrders for that agent and reads the real order ledger.",
  },
  {
    n: "03",
    title: "See your real numbers",
    body: "Order count, revenue, unique buyers, and completion rate — derived, not guessed.",
  },
];

export function HowItWorks() {
  return (
    <MotionSection id="how-it-works">
      <SectionEyebrow>How it works</SectionEyebrow>
      <SectionTitle>Three steps. Real CAP data.</SectionTitle>
      <SectionBody>
        Sellers already ship agents. OnTheRadar is the report card after launch —
        not another pre-launch toolkit.
      </SectionBody>
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <li
            key={s.n}
            className="rounded-2xl border border-[#2A2A2F] bg-[#1A1A1E] p-6"
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#C6FF3A]">
              {s.n}
            </p>
            <h3 className="mt-4 font-[family-name:var(--font-syne)] text-xl font-extrabold tracking-tight text-[#EEEEEF]">
              {s.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#A0A0AB]">{s.body}</p>
          </li>
        ))}
      </ol>
    </MotionSection>
  );
}
