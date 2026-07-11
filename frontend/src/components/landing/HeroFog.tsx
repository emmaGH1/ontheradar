"use client";

import { useEffect, useRef } from "react";

type VantaEffect = { destroy: () => void };

/**
 * Vanta FOG — lime/dark palette, calm motion.
 * Loaded only in the browser (parent uses next/dynamic ssr:false).
 */
export default function HeroFog() {
  const elRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<VantaEffect | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function mount() {
      if (!elRef.current) return;

      const THREE = await import("three");
      const FOG = (await import("vanta/dist/vanta.fog.min")).default;

      if (cancelled || !elRef.current) return;

      effectRef.current = FOG({
        el: elRef.current,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        highlightColor: 0xc6ff3a, // lime accent
        midtoneColor: 0x2a3a1a,
        lowlightColor: 0x0f0f11,
        baseColor: 0x0f0f11,
        blurFactor: 0.55,
        speed: 0.65,
        zoom: 0.85,
      }) as VantaEffect;
    }

    mount().catch((err) => {
      console.warn("Vanta FOG failed to load", err);
    });

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  return (
    <div
      ref={elRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
