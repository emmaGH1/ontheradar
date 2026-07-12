"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Modern circular cursor: soft gray disc (always visible, not see-through empty).
 * Grows with a longer ease on links/buttons. Fine pointers only.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const hover = useRef(false);
  const down = useRef(false);
  const raf = useRef(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-custom");

    const paint = () => {
      const { x, y } = pos.current;
      const isHover = hover.current;
      const isDown = down.current;

      // Inner dot — always gray fill (consistent local + prod)
      if (dotRef.current) {
        const s = isHover ? 6 : 10;
        const scale = isDown ? 0.75 : 1;
        dotRef.current.style.transform = `translate3d(${x - s / 2}px, ${y - s / 2}px, 0) scale(${scale})`;
        dotRef.current.style.width = `${s}px`;
        dotRef.current.style.height = `${s}px`;
      }

      // Outer ring — grows clearly on interactive hover
      if (ringRef.current) {
        const s = isHover ? 76 : 36;
        const scale = isDown ? 0.9 : 1;
        ringRef.current.style.transform = `translate3d(${x - s / 2}px, ${y - s / 2}px, 0) scale(${scale})`;
        ringRef.current.style.width = `${s}px`;
        ringRef.current.style.height = `${s}px`;
        ringRef.current.style.opacity = isHover ? "1" : "0.85";
        ringRef.current.style.outline = "none";
        ringRef.current.style.border = "none";
        ringRef.current.dataset.hover = isHover ? "true" : "false";
      }

      raf.current = 0;
    };

    const schedule = () => {
      if (!raf.current) raf.current = requestAnimationFrame(paint);
    };

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t?.closest) return;
      const interactive = t.closest(
        "a, button, [role='button'], input, textarea, select, label, summary",
      );
      const next = !!interactive;
      if (next !== hover.current) {
        hover.current = next;
        schedule();
      }
    };

    const onDown = () => {
      down.current = true;
      schedule();
    };
    const onUp = () => {
      down.current = false;
      schedule();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    schedule();

    return () => {
      document.documentElement.classList.remove("cursor-custom");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Outer ring — gray glass, expands on hover */}
      <div
        ref={ringRef}
        className="otr-cursor otr-cursor-ring"
        aria-hidden
      />
      {/* Center dot — solid gray core so it never “disappears” */}
      <div
        ref={dotRef}
        className="otr-cursor otr-cursor-dot"
        aria-hidden
      />
    </>
  );
}