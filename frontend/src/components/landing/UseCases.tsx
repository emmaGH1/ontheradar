import { MotionSection } from "./MotionSection";
import { SectionBody, SectionEyebrow, SectionTitle } from "./Section";

const CASES = [
  {
    title: "Seller traction check",
    body: "Know if real buyers are completing orders — not just browsing the store listing.",
  },
  {
    title: "Post-launch health",
    body: "Completion rate and rejections surface SLA issues before reputation quietly erodes.",
  },
  {
    title: "Buyer diversity",
    body: "Unique buyer count shows whether revenue is broad demand or a single whale.",
  },
];

export function UseCases() {
  return (
    <MotionSection id="use-cases" className="relative overflow-hidden">
      {/* optional morphing accent behind this section only */}
      <div
        className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#C6FF3A]/[0.06] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#FF9F1C]/[0.05] blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <SectionEyebrow>Who it is for</SectionEyebrow>
        <SectionTitle>Built for agents already live.</SectionTitle>
        <SectionBody>
          Pre-launch tools stop at ship day. OnTheRadar starts when orders start
          clearing.
        </SectionBody>
        <div className="grid gap-4 md:grid-cols-3">
          {CASES.map((c) => (
            <article
              key={c.title}
              className="rounded-2xl border border-[#2A2A2F] bg-[#1A1A1E] p-6"
            >
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-extrabold tracking-tight text-[#EEEEEF]">
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#A0A0AB]">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
