import { Button } from "./Button";
import { Section } from "./Section";

export function FinalCTA() {
  return (
    <Section id="open-app">
      <div className="relative overflow-hidden rounded-[32px] border border-[#2A2A2F] bg-[#1A1A1E] px-8 py-16 text-center md:px-16">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#C6FF3A]/10 to-transparent"
          aria-hidden
        />
        <p className="relative font-mono text-xs uppercase tracking-[0.2em] text-[#6C6C74]">
          Open the dashboard
        </p>
        <h2 className="relative mx-auto mt-6 max-w-2xl font-[family-name:var(--font-syne)] text-4xl font-extrabold leading-tight tracking-tight text-[#EEEEEF] md:text-5xl">
          Paste your key. Read the report card.
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-lg leading-relaxed text-[#A0A0AB]">
          The next screen is the live tool — SDK key, agent id, four metrics from
          CAP. No demo data.
        </p>
        <div className="relative mt-10 flex justify-center">
          <Button href="/app">Launch OnTheRadar</Button>
        </div>
      </div>
    </Section>
  );
}
