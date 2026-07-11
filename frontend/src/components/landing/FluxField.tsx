"use client";

import { useEffect, useRef } from "react";

/**
 * Slow, subtle lime-tinted flux field for hero.
 * Calm / premium — not dramatic (DESIGN_BRIEF motion rule).
 */
export function FluxField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let w = 0;
    let h = 0;

    const blobs = [
      { x: 0.28, y: 0.35, r: 0.38, c: [198, 255, 58], a: 0.14 },
      { x: 0.72, y: 0.42, r: 0.42, c: [120, 200, 80], a: 0.1 },
      { x: 0.5, y: 0.7, r: 0.35, c: [80, 160, 90], a: 0.08 },
      { x: 0.15, y: 0.75, r: 0.28, c: [198, 255, 58], a: 0.06 },
    ];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas!.parentElement;
      w = parent?.clientWidth ?? window.innerWidth;
      h = parent?.clientHeight ?? window.innerHeight;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame() {
      t += 0.0035;
      ctx!.fillStyle = "#0F0F11";
      ctx!.fillRect(0, 0, w, h);

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const ox = Math.sin(t * (0.7 + i * 0.15) + i) * 0.06;
        const oy = Math.cos(t * (0.55 + i * 0.12) + i * 1.3) * 0.05;
        const pr = b.r + Math.sin(t * 0.4 + i) * 0.03;
        const x = (b.x + ox) * w;
        const y = (b.y + oy) * h;
        const radius = pr * Math.max(w, h);
        const g = ctx!.createRadialGradient(x, y, 0, x, y, radius);
        const [r, gch, bl] = b.c;
        g.addColorStop(0, `rgba(${r},${gch},${bl},${b.a})`);
        g.addColorStop(0.45, `rgba(${r},${gch},${bl},${b.a * 0.35})`);
        g.addColorStop(1, "rgba(15,15,17,0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(x, y, radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      // soft vignette
      const vg = ctx!.createRadialGradient(
        w * 0.5,
        h * 0.4,
        Math.min(w, h) * 0.15,
        w * 0.5,
        h * 0.45,
        Math.max(w, h) * 0.75,
      );
      vg.addColorStop(0, "rgba(15,15,17,0)");
      vg.addColorStop(1, "rgba(15,15,17,0.85)");
      ctx!.fillStyle = vg;
      ctx!.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
