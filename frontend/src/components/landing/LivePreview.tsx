"use client";

import { useEffect, useState } from "react";
import { MotionSection } from "./MotionSection";
import { RefractionGlass } from "./RefractionGlass";
import { SectionBody, SectionEyebrow, SectionTitle } from "./Section";

const METRICS = [
  { label: "Orders", value: "128", hint: "All provider orders" },
  { label: "Revenue", value: "$42.50", hint: "Sum of order price" },
  { label: "Unique buyers", value: "37", hint: "Distinct buyer ids" },
  { label: "Completion rate", value: "91.2%", hint: "Completed ÷ terminal" },
];

function SkeletonMesh({ progress }: { progress: number }) {
  const opacity = Math.max(0, 1 - progress * 1.15);
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 800 360"
      preserveAspectRatio="none"
      aria-hidden
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="meshGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C6FF3A" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6C6C74" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {Array.from({ length: 14 }).map((_, i) => {
        const y = 20 + i * 24 + Math.sin(i * 1.7) * 6;
        return (
          <path
            key={`h-${i}`}
            d={`M 20 ${y} Q 200 ${y + Math.sin(i) * 18} 400 ${y - Math.cos(i) * 12} T 780 ${y}`}
            fill="none"
            stroke="url(#meshGrad)"
            strokeWidth="1"
            style={{
              strokeDasharray: 900,
              strokeDashoffset: 900 * (1 - Math.min(1, progress * 1.4 + i * 0.02)),
            }}
          />
        );
      })}
      {Array.from({ length: 10 }).map((_, i) => {
        const x = 40 + i * 80;
        return (
          <path
            key={`v-${i}`}
            d={`M ${x} 10 Q ${x + Math.sin(i * 2) * 30} 180 ${x} 350`}
            fill="none"
            stroke="#2A2A2F"
            strokeWidth="1"
            opacity={0.7}
          />
        );
      })}
      {Array.from({ length: 18 }).map((_, i) => (
        <circle
          key={`n-${i}`}
          cx={60 + (i % 6) * 120 + (i % 2) * 20}
          cy={40 + Math.floor(i / 6) * 100 + (i % 3) * 12}
          r={2 + (i % 3)}
          fill="#C6FF3A"
          opacity={0.25 + (i % 4) * 0.08}
        />
      ))}
    </svg>
  );
}

export function LivePreview() {
  const [progress, setProgress] = useState(0);
  const loaded = progress >= 0.99;

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    let holdTimer: number | undefined;
    let cancelled = false;

    const run = () => {
      start = null;
      setProgress(0);
      const tick = (now: number) => {
        if (cancelled) return;
        if (start == null) start = now;
        const p = Math.min(1, (now - start) / 2200);
        setProgress(1 - Math.pow(1 - p, 3));
        if (p < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          holdTimer = window.setTimeout(run, 4800);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const delay = window.setTimeout(run, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(delay);
      if (holdTimer) window.clearTimeout(holdTimer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <MotionSection id="live-preview">
      <SectionEyebrow>Live preview</SectionEyebrow>
      <SectionTitle>Empty mesh loads into real metrics.</SectionTitle>
      <SectionBody>
        The same path the dashboard takes: skeleton signal resolving into order
        count, revenue, unique buyers, and completion rate.
      </SectionBody>

      <RefractionGlass>
        <div className="relative min-h-[320px]">
          <SkeletonMesh progress={progress} />

          <div
            className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            style={{
              opacity: Math.max(0, (progress - 0.35) / 0.65),
              transform: `translateY(${(1 - progress) * 12}px)`,
            }}
          >
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-white/10 bg-[#1A1A1E]/75 p-5 backdrop-blur-sm"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6C6C74]">
                  {m.label}
                </p>
                <p
                  className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-extrabold tracking-tight tabular-nums"
                  style={{ color: progress > 0.7 ? "#C6FF3A" : "#A0A0AB" }}
                >
                  {progress > 0.55 ? m.value : "—"}
                </p>
                <p className="mt-2 text-xs text-[#6C6C74]">{m.hint}</p>
              </div>
            ))}
          </div>

          <p className="relative mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6C6C74]">
            {loaded ? "Preview resolved · sample figures" : "Resolving CAP signal…"}
          </p>
        </div>
      </RefractionGlass>
    </MotionSection>
  );
}
