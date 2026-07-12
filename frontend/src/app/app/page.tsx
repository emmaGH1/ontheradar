import Link from "next/link";
import { Dashboard } from "@/components/Dashboard";

export default function AppPage() {
  return (
    <div className="min-h-screen bg-[#0F0F11]">
      <nav className="border-b border-[#2A2A2F] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-[0.2em] text-[#6C6C74] transition hover:text-[#C6FF3A]"
          >
            OnTheRadar
          </Link>
          <Link
            href="/"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#1A1A1E]/50 text-[#A0A0AB] transition-all duration-200 hover:-translate-x-0.5 hover:border-white/20 hover:text-[#C6FF3A]"
            title="Back to site"
            aria-label="Back to site"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
        </div>
      </nav>
      <Dashboard />
    </div>
  );
}
