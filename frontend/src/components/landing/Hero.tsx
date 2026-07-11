import { Button } from "./Button";
import { FluxField } from "./FluxField";
import { GlowWord } from "./GlowWord";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden px-6 pt-28 pb-24">
      <FluxField />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#6C6C74]">
          OnTheRadar
        </p>
        <h1 className="max-w-3xl font-[family-name:var(--font-syne)] text-5xl font-extrabold leading-[1.05] tracking-tight text-[#EEEEEF] md:text-7xl">
          The report card for your{" "}
          <GlowWord>CAP agent</GlowWord>
          <span style={{ WebkitTextStroke: "1.5px #EEEEEF", color: "transparent" }}>
            .
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#A0A0AB] md:text-xl">
          Post-launch metrics from real CAP order history — orders, revenue,
          buyers, and completion rate. Nothing pre-launch. Nothing simulated.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/app">Open dashboard</Button>
          <Button href="#how-it-works" variant="ghost">
            How it works
          </Button>
        </div>
      </div>
    </section>
  );
}
