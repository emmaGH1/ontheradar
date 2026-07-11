import { Button } from "./Button";
import { MotionSection } from "./MotionSection";
import { SectionBody, SectionEyebrow, SectionTitle } from "./Section";

export function Pricing() {
  return (
    <MotionSection id="pricing">
      <SectionEyebrow>Pricing</SectionEyebrow>
      <SectionTitle>$1 per report. No subscription.</SectionTitle>
      <SectionBody>
        Pay when you want a fresh scorecard. One agent, one pull from CAP, one
        clear report card.
      </SectionBody>
      <div className="max-w-md rounded-2xl border border-[#2A2A2F] bg-[#1A1A1E] p-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6C6C74]">
          Single report
        </p>
        <p className="mt-4 font-[family-name:var(--font-syne)] text-5xl font-extrabold tracking-tight text-[#C6FF3A]">
          $1
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#A0A0AB]">
          Includes order count, revenue, unique buyers, and completion rate from
          your live CAP ledger.
        </p>
        <div className="mt-8">
          <Button href="/app">Get a report</Button>
        </div>
      </div>
    </MotionSection>
  );
}
