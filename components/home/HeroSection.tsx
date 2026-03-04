import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SearchForm } from "./SearchForm";

/* 파도 이미지 - Next.js가 프록시해서 로드 (깨짐 방지) */
const HERO_BG_IMAGE =
  "https://images.unsplash.com/photo-1531366937177-6ac4c16a2111?auto=format&fit=crop&w=1920&q=90";

/**
 * 히어로: 파도가 뚜렷한 바다 배경 + 가벼운 오버레이, 헤드라인·서브카피, 검색 카드.
 */
export function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] overflow-hidden bg-[#04345a] px-4 py-wt-14 sm:px-5 md:min-h-[92vh] md:py-wt-20 lg:py-wt-24"
      aria-label="메인 히어로"
    >
      {/* 배경: Next.js Image로 프록시 로드 (깨진 이미지 방지) */}
      <div className="absolute inset-0 relative" aria-hidden>
        <Image
          src={HERO_BG_IMAGE}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>
      {/* 오버레이: 아주 얇게 — 파도가 보이도록, 하단만 살짝 어둡게 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,52,90,0.18) 0%, transparent 45%, transparent 60%, rgba(5,6,6,0.35) 100%)",
        }}
        aria-hidden
      />

      <Container
        size="lg"
        className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center"
      >
        {/* 상단 문구 영역 */}
        <div className="flex max-w-2xl flex-col items-center text-center">
          <p className="font-body text-sm font-medium uppercase tracking-[0.2em] text-white/80 md:text-wt-caption">
            BRG를 위한 호텔 요금 비교
          </p>
          <h1 className="mt-wt-4 font-display text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] sm:text-3xl md:text-4xl md:leading-[1.15] lg:text-[2.75rem]">
            공식보다 낮은 요금,
            <br />
            더 정교하게 확인하세요
          </h1>
          <p className="mt-wt-4 max-w-lg font-body text-base leading-relaxed text-white/95 md:mt-wt-5 md:text-lg">
            국내·해외 숙소 공식 홈페이지와 OTA 요금을 한눈에 비교하고,
            <br className="hidden sm:block" />
            BRG 가능성을 탐색하세요.
          </p>
        </div>

        {/* 검색 카드 */}
        <div className="mt-wt-10 w-full max-w-4xl md:mt-wt-14">
          <div className="rounded-2xl border border-white/25 bg-white/97 px-wt-5 py-wt-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:px-wt-6 sm:py-wt-7 md:rounded-wt-xl md:px-wt-8 md:py-wt-8">
            <p className="mb-wt-4 font-body text-sm font-semibold text-wt-text-secondary md:mb-wt-5 md:text-wt-body-md">
              검색 조건
            </p>
            <SearchForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
