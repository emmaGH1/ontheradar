"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** Fade + slide-up when section enters the viewport. */
export function MotionSection({
  children,
  id,
  className = "",
  bare = false,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
  bare?: boolean;
}) {
  if (bare) {
    return (
      <motion.section
        id={id}
        className={className}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        variants={fadeUp}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <motion.section
      id={id}
      className={`border-t border-[#2A2A2F] py-28 px-6 ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </motion.section>
  );
}
