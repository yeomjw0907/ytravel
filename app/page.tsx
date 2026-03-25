import { HeroSection } from "@/components/home/HeroSection";
import { BrgExplainSection } from "@/components/home/BrgExplainSection";
import { DifferentiatorSection } from "@/components/home/DifferentiatorSection";
import { CompareCriteriaSection } from "@/components/home/CompareCriteriaSection";
import { TrustCtaSection } from "@/components/home/TrustCtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrgExplainSection />
      <DifferentiatorSection />
      <CompareCriteriaSection />
      <TrustCtaSection />
    </>
  );
}
