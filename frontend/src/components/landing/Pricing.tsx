import { Button } from "./Button";
import { MotionSection } from "./MotionSection";
import { RefractionGlass } from "./RefractionGlass";
import { SectionBody, SectionEyebrow, SectionTitle } from "./Section";

const INCLUDED = [
  "Order count from live CAP history",
  "Revenue sum (USDC)",
  "Unique buyer count",
  "Completion rate on terminal orders",
];

const NOT_INCLUDED = [
  "Multi-seller crawl",
  "Reputation / PTS queries",
  "Subscriptions or seats",
];

export function Pricing() {
  return (
    <MotionSection id="pricing">
      <div className="text-center">
        <SectionEyebrow>Pricing</SectionEyebrow>
        <SectionTitle>$0.05 per report. No subscription.</SectionTitle>
        <SectionBody>
          Pay when you want a fresh scorecard. One agent, one pull from CAP, one
          clear report card.
        </SectionBody>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2 md:items-stretch md:gap-8">
        <RefractionGlass className="h-full">
          <div className="flex h-full flex-col text-center md:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#6C6C74]">
              Single report
            </p>
            <p className="mt-4 font-[family-name:var(--font-syne)] text-5xl font-extrabold tracking-tight text-[#C6FF3A]">
              $0.05
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#A0A0AB]">
              One agent. One CAP pull. Four metrics on your post-launch report
              card.
            </p>
            <div className="mt-8 flex justify-center md:justify-start">
              <Button href="/app">Get a report</Button>
            </div>
          </div>
        </RefractionGlass>

        <RefractionGlass subtle className="h-full">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-1">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C6FF3A]">
                What&apos;s included
              </p>
              <ul className="mt-3 space-y-2.5">
                {INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-[#A0A0AB]"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C6FF3A]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6C6C74]">
                What&apos;s not
              </p>
              <ul className="mt-3 space-y-2.5">
                {NOT_INCLUDED.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-[#6C6C74]"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2A2A2F]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </RefractionGlass>
      </div>
    </MotionSection>
  );
}
