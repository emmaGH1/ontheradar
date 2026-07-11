import { Button } from "./Button";
import { Typewriter } from "./Typewriter";

/**
 * Premium bottom orb — stacked, heavily blurred circular light sources
 * half-sunk below the fold (like a soft-focus photo of a glowing sphere),
 * not a flat multi-stop gradient. Lime stand-in for the red in hero-inspo.png.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0F0F11] px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Outer atmospheric halo */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[40%]">
          <div
            className="hero-orb hero-orb--halo"
            style={{
              width: "min(165vw, 1480px)",
              height: "min(165vw, 1480px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 42%, rgba(198,255,58,0.5) 0%, rgba(198,255,58,0.16) 42%, transparent 70%)",
              filter: "blur(72px)",
            }}
          />
        </div>

        {/* Mid body — denser orb mass */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[46%]">
          <div
            className="hero-orb hero-orb--body"
            style={{
              width: "min(115vw, 1000px)",
              height: "min(115vw, 1000px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 40%, rgba(198,255,58,0.78) 0%, rgba(198,255,58,0.3) 36%, transparent 64%)",
              filter: "blur(52px)",
            }}
          />
        </div>

        {/* Hot core — tighter, brighter, less blur */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[50%]">
          <div
            className="hero-orb hero-orb--core"
            style={{
              width: "min(72vw, 640px)",
              height: "min(72vw, 640px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 50% 38%, rgba(236,255,170,0.95) 0%, rgba(198,255,58,0.58) 30%, transparent 60%)",
              filter: "blur(30px)",
            }}
          />
        </div>

        {/* Specular crown — faint upper rim for depth */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[12%] opacity-50"
          style={{
            width: "min(100vw, 860px)",
            height: "min(30vw, 240px)",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse 85% 100% at 50% 100%, rgba(198,255,58,0.5) 0%, transparent 72%)",
            filter: "blur(22px)",
          }}
        />

        {/* Side vignette — orb falls into pure black at edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 85% at 50% 100%, transparent 28%, #0F0F11 80%)",
          }}
        />
      </div>

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
