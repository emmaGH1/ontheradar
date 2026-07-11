import Link from "next/link";

export function SignalFooter() {
  return (
    <footer className="border-t border-[#2A2A2F] px-6 py-16">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-[#2A2A2F] bg-[#1A1A1E] p-8 md:p-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF9F1C] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF9F1C]" />
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#A0A0AB]">
                Live signal
              </p>
            </div>
            <p className="mt-4 font-[family-name:var(--font-syne)] text-2xl font-extrabold tracking-tight text-[#EEEEEF]">
              OnTheRadar
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#A0A0AB]">
              The report card for CAP agents after launch. Built for the CROO
              Agent Hackathon.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="mb-4 text-sm font-medium text-[#EEEEEF]">Product</p>
              <ul className="space-y-2 text-sm text-[#6C6C74]">
                <li>
                  <Link href="#how-it-works" className="hover:text-[#C6FF3A]">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="#live-preview" className="hover:text-[#C6FF3A]">
                    Live preview
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-[#C6FF3A]">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/app" className="hover:text-[#C6FF3A]">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-medium text-[#EEEEEF]">Signal</p>
              <ul className="space-y-2 text-sm text-[#6C6C74]">
                <li>
                  <a
                    href="https://cap.croo.network/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#C6FF3A]"
                  >
                    CAP protocol
                  </a>
                </li>
                <li>
                  <a
                    href="https://agent.croo.network/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#C6FF3A]"
                  >
                    CROO agents
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.croo.network/developer-docs/quick-start"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#C6FF3A]"
                  >
                    SDK docs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-medium text-[#EEEEEF]">Meta</p>
              <ul className="space-y-2 text-sm text-[#6C6C74]">
                <li>
                  <a
                    href="https://github.com/CROO-Network/node-sdk"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#C6FF3A]"
                  >
                    CAP SDK
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#2A2A2F] pt-6 text-xs text-[#6C6C74] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OnTheRadar. All rights reserved.</p>
          <p className="font-mono uppercase tracking-[0.15em]">
            CAP post-launch · single agent view
          </p>
        </div>
      </div>
    </footer>
  );
}
