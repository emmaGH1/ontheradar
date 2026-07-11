"use client";

/**
 * Arc glow background — flowing ribbon light trails like design-reference/arc-glow.png,
 * tinted brand lime. CSS/SVG only (no three/vanta). Slow calm motion.
 */
export function HeroArcGlow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0F0F11]"
    >
      {/* Soft ambient washes behind the arcs */}
      <div
        className="absolute -left-[20%] top-[5%] h-[70%] w-[70%] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 40% 45%, rgba(198,255,58,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute -right-[10%] bottom-[10%] h-[55%] w-[60%] opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 60% 55%, rgba(198,255,58,0.1) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* SVG arc ribbons — focused strokes with layered glow */}
      <svg
        className="absolute inset-0 h-full w-full hero-arc-drift"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="arc-a" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#C6FF3A" stopOpacity="0" />
            <stop offset="22%" stopColor="#C6FF3A" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#C6FF3A" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#C6FF3A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="arc-b" x1="100%" y1="40%" x2="0%" y2="70%">
            <stop offset="0%" stopColor="#C6FF3A" stopOpacity="0" />
            <stop offset="30%" stopColor="#D4FF6A" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#C6FF3A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C6FF3A" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="arc-c" x1="0%" y1="80%" x2="100%" y2="20%">
            <stop offset="0%" stopColor="#C6FF3A" stopOpacity="0" />
            <stop offset="40%" stopColor="#C6FF3A" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C6FF3A" stopOpacity="0" />
          </linearGradient>
          <filter id="arc-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="arc-bloom" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="22" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
            </feMerge>
          </filter>
          <filter id="arc-tight" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bloom layers (wide soft ribbons) */}
        <g opacity="0.55" filter="url(#arc-bloom)">
          <path
            d="M -80 520 C 180 180, 520 80, 780 220 C 980 320, 1180 280, 1520 120"
            stroke="url(#arc-a)"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M -60 720 C 220 620, 480 780, 760 680 C 1040 580, 1280 640, 1520 560"
            stroke="url(#arc-b)"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M 200 -40 C 360 160, 420 360, 560 480 C 720 620, 980 700, 1500 640"
            stroke="url(#arc-c)"
            strokeWidth="18"
            strokeLinecap="round"
          />
        </g>

        {/* Soft mid strokes */}
        <g opacity="0.75" filter="url(#arc-soft)">
          <path
            d="M -80 520 C 180 180, 520 80, 780 220 C 980 320, 1180 280, 1520 120"
            stroke="url(#arc-a)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M -60 720 C 220 620, 480 780, 760 680 C 1040 580, 1280 640, 1520 560"
            stroke="url(#arc-b)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 200 -40 C 360 160, 420 360, 560 480 C 720 620, 980 700, 1500 640"
            stroke="url(#arc-c)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>

        {/* Focused core lines — the “sharp” light inside the glow */}
        <g opacity="0.95" filter="url(#arc-tight)">
          <path
            d="M -80 520 C 180 180, 520 80, 780 220 C 980 320, 1180 280, 1520 120"
            stroke="#E8FF9A"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M -60 720 C 220 620, 480 780, 760 680 C 1040 580, 1280 640, 1520 560"
            stroke="#C6FF3A"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M 200 -40 C 360 160, 420 360, 560 480 C 720 620, 980 700, 1500 640"
            stroke="#D4FF6A"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.65"
          />
        </g>
      </svg>

      {/* Bottom handoff into page bg */}
      <div
        className="absolute inset-x-0 bottom-0 h-36 sm:h-48"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #0F0F11 92%)",
        }}
      />
    </div>
  );
}
