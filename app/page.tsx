import { HeroSection } from "@/components/home/HeroSection";
import { BrgExplainSection } from "@/components/home/BrgExplainSection";
import { DifferentiatorSection } from "@/components/home/DifferentiatorSection";
import { CompareCriteriaSection } from "@/components/home/CompareCriteriaSection";
import { TrustCtaSection } from "@/components/home/TrustCtaSection";

/**
 * Ytravel 홈 (15-page-wireframes §3)
 * 히어로 → BRG 설명 → 차별점 → 비교 기준 → 하단 CTA/신뢰
 */
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
