"use client";

import dynamic from "next/dynamic";

const HeroFog = dynamic(() => import("./HeroFog"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[#0F0F11]"
    />
  ),
});

/** Client-only Vanta FOG shell — keeps three/vanta out of the SSR graph. */
export function HeroAtmosphere() {
  return <HeroFog />;
}
