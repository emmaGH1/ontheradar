"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#live-preview", label: "Live preview" },
  { href: "#pricing", label: "Pricing" },
  { href: "/app", label: "Dashboard" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");

    const update = () => {
      if (hero) {
        // Glass once the hero bottom has scrolled past the nav
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
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 sm:px-5 ${
          scrolled
            ? "border border-white/10 bg-[#1A1A1E]/55 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="font-[family-name:var(--font-syne)] text-base font-extrabold tracking-tight text-[#EEEEEF] transition hover:text-[#C6FF3A]"
        >
          OnTheRadar
        </Link>

        <ul className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-full px-2.5 py-1.5 text-xs transition hover:text-[#C6FF3A] sm:px-3 sm:text-sm ${
                  link.href === "/app"
                    ? "bg-[#C6FF3A] font-medium text-[#0F0F11] hover:bg-[#D4FF6A] hover:text-[#0F0F11] hover:scale-95 active:scale-90"
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
