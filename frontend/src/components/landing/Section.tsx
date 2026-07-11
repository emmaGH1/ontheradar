import type { ReactNode } from "react";

/** Skill section wrapper: py-28 px-6 border-t, max-w-6xl */
export function Section({
  children,
  id,
  className = "",
  bare = false,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Skip outer border/padding when parent handles layout */
  bare?: boolean;
}) {
  if (bare) {
    return (
      <section id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <section id={id} className={`border-t border-[#2A2A2F] py-28 px-6 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-[#6C6C74]">
      {children}
    </p>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-6 font-[family-name:var(--font-syne)] text-4xl font-extrabold leading-tight tracking-tight text-[#EEEEEF] md:text-5xl">
      {children}
    </h2>
  );
}

export function SectionBody({ children }: { children: ReactNode }) {
  return <p className="mb-8 text-lg leading-relaxed text-[#A0A0AB]">{children}</p>;
}
