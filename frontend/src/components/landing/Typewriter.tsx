"use client";

import { useEffect, useState } from "react";
import { GlowWord } from "./GlowWord";

/**
 * Types the given text on mount, then wraps it in GlowWord (lime accent).
 */
export function Typewriter({
  text,
  speed = 55,
  className = "",
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [shown, setShown] = useState("");
  const done = shown.length >= text.length;

  useEffect(() => {
    setShown("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className} aria-label={text}>
      <GlowWord>{shown}</GlowWord>
      {!done ? (
        <span
          className="ml-0.5 inline-block w-[0.08em] animate-pulse bg-[#C6FF3A] align-[-0.05em]"
          style={{ height: "0.85em" }}
          aria-hidden
        />
      ) : null}
    </span>
  );
}
