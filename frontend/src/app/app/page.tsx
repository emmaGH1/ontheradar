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
            className="text-sm text-[#A0A0AB] transition hover:text-[#C6FF3A]"
          >
            Back to site
          </Link>
        </div>
      </nav>
      <Dashboard />
    </div>
  );
}
