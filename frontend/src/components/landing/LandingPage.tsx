import { FinalCTA } from "./FinalCTA";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { LivePreview } from "./LivePreview";
import { Navbar } from "./Navbar";
import { Pricing } from "./Pricing";
import { SignalFooter } from "./SignalFooter";
import { UseCases } from "./UseCases";

export function LandingPage() {
  return (
    <main className="bg-[#0F0F11] text-[#EEEEEF]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <LivePreview />
      <UseCases />
      <Pricing />
      <FinalCTA />
      <SignalFooter />
    </main>
  );
}
