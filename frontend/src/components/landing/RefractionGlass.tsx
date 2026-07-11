import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Tighter padding for small step cards */
  compact?: boolean;
  /** Soften morphing blobs for smaller cards */
  subtle?: boolean;
};

/**
 * Shared refraction-glass shell: backdrop blur, soft border glow, morphing
 * colour blobs behind content (DESIGN_BRIEF + live-preview reference).
 */
export function RefractionGlass({
  children,
  className = "",
  compact = false,
  subtle = false,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] border border-white/10 bg-[#1A1A1E]/55 p-1 shadow-[0_20px_60px_-28px_rgba(0,0,0,0.75)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[24px]"
        aria-hidden
      >
        <div
          className={`absolute -left-8 top-0 rounded-full bg-[#C6FF3A] blur-3xl animate-[blob_12s_ease-in-out_infinite] ${
            subtle ? "h-28 w-28 opacity-20" : "h-44 w-44 opacity-25"
          }`}
        />
        <div
          className={`absolute -right-4 top-6 rounded-full bg-[#4ADE80] blur-3xl animate-[blob_14s_ease-in-out_infinite_reverse] ${
            subtle ? "h-32 w-32 opacity-15" : "h-48 w-48 opacity-20"
          }`}
        />
        <div
          className={`absolute bottom-0 left-1/3 rounded-full bg-[#38BDF8] blur-3xl animate-[blob_16s_ease-in-out_infinite] ${
            subtle ? "h-24 w-24 opacity-10" : "h-36 w-36 opacity-15"
          }`}
        />
        {!subtle ? (
          <div className="absolute bottom-2 right-1/4 h-32 w-32 animate-[blob_11s_ease-in-out_infinite_reverse] rounded-full bg-[#FF9F1C]/12 blur-3xl" />
        ) : null}
      </div>
      <div
        className={`relative rounded-[20px] border border-white/10 bg-[#0F0F11]/45 backdrop-blur-xl ${
          compact ? "p-5" : "p-6 md:p-8"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
