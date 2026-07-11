"use client";

import { useEffect, useState } from "react";
import { Section, SectionBody, SectionEyebrow, SectionTitle } from "./Section";

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

function RefractionGlass({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1A1A1E]/55 p-1 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
      {/* morphing colour blobs behind the glass */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]"
        aria-hidden
      >
        <div className="absolute -left-10 top-0 h-56 w-56 animate-[blob_12s_ease-in-out_infinite] rounded-full bg-[#C6FF3A]/25 blur-3xl" />
        <div className="absolute right-0 top-10 h-64 w-64 animate-[blob_14s_ease-in-out_infinite_reverse] rounded-full bg-[#4ADE80]/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 animate-[blob_16s_ease-in-out_infinite] rounded-full bg-[#38BDF8]/15 blur-3xl" />
        <div className="absolute bottom-4 right-1/4 h-40 w-40 animate-[blob_11s_ease-in-out_infinite_reverse] rounded-full bg-[#FF9F1C]/12 blur-3xl" />
      </div>
      <div className="relative rounded-[24px] border border-white/10 bg-[#0F0F11]/40 p-6 backdrop-blur-xl md:p-8">
        {children}
      </div>
    </div>
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
    <Section id="live-preview">
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
    </Section>
  );
}
