import Link from "next/link";
import type { ReactNode } from "react";
import { colors } from "./tokens";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

/** Button law: shrink on hover, never grow. Accent flip. */
export function Button({ href, children, variant = "primary", className = "" }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium tracking-tight transition-all duration-200 hover:scale-95 active:scale-90";

  if (variant === "ghost") {
    return (
      <Link
        href={href}
        className={`${base} border border-white/20 bg-transparent text-[#EEEEEF] hover:border-[#C6FF3A] hover:text-[#C6FF3A] ${className}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} bg-[#C6FF3A] text-[#0F0F11] hover:bg-[#D4FF6A] ${className}`}
      style={{ boxShadow: `0 0 0 1px ${colors.accent}33` }}
    >
      {children}
    </Link>
  );
}
