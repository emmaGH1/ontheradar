import { Button } from "./Button";
import { HeroArcGlow } from "./HeroArcGlow";
import { Typewriter } from "./Typewriter";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0F0F11] px-4 pb-24 pt-28 sm:px-6 sm:pb-28 sm:pt-32"
    >
      <HeroArcGlow />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start">
        <h1 className="max-w-3xl font-[family-name:var(--font-syne)] text-4xl font-extrabold leading-[1.08] tracking-tight text-[#EEEEEF] sm:text-5xl md:text-7xl">
          The report card for your{" "}
          <Typewriter text="CAP agent." />
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-[#A0A0AB] sm:mt-6 sm:text-lg md:text-xl">
          Post-launch metrics from real CAP order history — orders, revenue,
          buyers, and completion rate. Nothing pre-launch. Nothing simulated.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <Button href="/app" className="w-full sm:w-auto">
            Open dashboard
          </Button>
          <Button href="#how-it-works" variant="ghost" className="w-full sm:w-auto">
            How it works
          </Button>
        </div>
      </div>
    </section>
  );
}
