"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#how-it-works", label: "How it works", hideOnMobile: true },
  { href: "#live-preview", label: "Live preview", hideOnMobile: true },
  { href: "#pricing", label: "Pricing", hideOnMobile: false },
  { href: "/app", label: "Dashboard", hideOnMobile: false },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");

    const update = () => {
      if (hero) {
        setScrolled(window.scrollY > hero.offsetHeight - 72);
      } else {
        setScrolled(window.scrollY > 80);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-2xl px-3 py-2.5 transition-all duration-300 sm:px-5 sm:py-3 ${
          scrolled
            ? "border border-white/10 bg-[#1A1A1E]/55 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="shrink-0 font-[family-name:var(--font-syne)] text-sm font-extrabold tracking-tight text-[#EEEEEF] transition hover:text-[#C6FF3A] sm:text-base"
        >
          OnTheRadar
        </Link>

        <ul className="flex items-center gap-0.5 sm:gap-2">
          {LINKS.map((link) => (
            <li
              key={link.href}
              className={link.hideOnMobile ? "hidden md:list-item" : undefined}
            >
              <Link
                href={link.href}
                className={`inline-block rounded-full px-2 py-1.5 text-[11px] transition hover:text-[#C6FF3A] sm:px-3 sm:text-sm ${
                  link.href === "/app"
                    ? "bg-[#C6FF3A] font-medium text-[#0F0F11] hover:scale-95 hover:bg-[#D4FF6A] hover:text-[#0F0F11] active:scale-90"
                    : "text-[#A0A0AB]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
