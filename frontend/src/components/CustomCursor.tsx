"use client";

import { useEffect, useState } from "react";

/**
 * Modern circular cursor — soft gray disc, slightly larger, subtle hover grow.
 * Disabled on coarse pointers (touch).
 */
export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-custom");

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest) return;
      const interactive = t.closest(
        "a, button, [role='button'], input, textarea, select, label, summary",
      );
      setHover(!!interactive);
    };

    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("cursor-custom");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!enabled) return null;

  // Slightly bigger default; expands on interactive targets
  const size = hover ? 52 : 32;
  const scale = down ? 0.88 : 1;
  const blurAmount = hover ? "2px" : "6px";

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        width: size,
        height: size,
        transform: `translate3d(${pos.x - size / 2}px, ${pos.y - size / 2}px, 0) scale(${scale})`,
        transition:
          "width 0.22s cubic-bezier(0.22, 1, 0.36, 1), height 0.22s cubic-bezier(0.22, 1, 0.36, 1), transform 0.1s ease-out",
      }}
      aria-hidden
    >
      <div
        className="h-full w-full rounded-full"
        style={{
          background: hover
            ? "transparent"
            : "rgba(106, 106, 116, 0.45)", // text-3 gray fill
          border: "1px solid rgba(238, 238, 239, 0.2)",
          boxShadow: hover
            ? "0 0 0 1px rgba(238,238,239,0.08), 0 4px 24px rgba(0,0,0,0.15)" // Softer shadow on hover
            : "0 2px 16px rgba(0,0,0,0.28)",
          backdropFilter: `blur(${blurAmount})`,
          WebkitBackdropFilter: `blur(${blurAmount})`,
          transition: "background 0.22s ease, backdrop-filter 0.22s ease, -webkit-backdrop-filter 0.22s ease, box-shadow 0.22s ease",
        }}
      />
    </div>
  );
}