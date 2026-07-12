"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#live-preview", label: "Live preview" },
  { href: "#pricing", label: "Pricing" },
  { href: "/app", label: "Dashboard" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  // Prevent background scroll when mobile menu overlay is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-0.5 sm:gap-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`inline-block rounded-full px-2 py-1.5 text-[11px] transition sm:px-3 sm:text-sm ${
                  link.href === "/app"
                    ? "bg-[#C6FF3A] font-medium text-[#0F0F11] ring-1 ring-[#C6FF3A]/40 hover:scale-95 hover:bg-[#D4FF6A] hover:text-[#0F0F11] active:scale-90"
                    : "text-[#A0A0AB] hover:text-[#C6FF3A]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile 2-Dash Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 focus:outline-none md:hidden"
          aria-label="Toggle Menu"
        >
          <span
            className={`h-0.5 w-6 rounded bg-[#EEEEEF] transition-all duration-300 ${
              isOpen ? "translate-y-[4px] rotate-45 bg-[#C6FF3A]" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 rounded bg-[#EEEEEF] transition-all duration-300 ${
              isOpen ? "-translate-y-[4px] -rotate-45 bg-[#C6FF3A]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#0F0F11]/98 px-6 backdrop-blur-2xl md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
                hidden: {},
              }}
              className="flex flex-col items-center gap-8 text-center"
            >
              {LINKS.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight ${
                      link.href === "/app"
                        ? "inline-block rounded-full bg-[#C6FF3A] px-8 py-3 text-lg font-medium text-[#0F0F11] shadow-lg active:scale-95 transition-all duration-200"
                        : "text-[#A0A0AB] hover:text-[#C6FF3A] transition-colors duration-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
