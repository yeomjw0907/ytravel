import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SearchForm } from "./SearchForm";

const HERO_BG_IMAGE =
  "https://images.unsplash.com/photo-1531366937177-6ac4c16a2111?auto=format&fit=crop&w=1920&q=90";

export function HeroSection() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden bg-wt-brand-700 px-4 py-wt-12 sm:px-5 md:min-h-[90vh] md:py-wt-16 lg:py-wt-20">
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={HERO_BG_IMAGE}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(4,52,90,0.25) 0%, transparent 40%, transparent 55%, rgba(5,6,6,0.4) 100%)",
        }}
        aria-hidden
      />

      <Container
        size="lg"
        className="relative z-10 flex min-h-[78vh] flex-col items-center justify-center gap-wt-8 md:gap-wt-10"
      >
        <div className="flex max-w-2xl flex-col items-center text-center">
          <p className="rounded-wt-pill border border-white/25 bg-white/10 px-wt-3 py-wt-1 text-wt-caption font-medium tracking-wide text-white/90">
            예약가 점검 + 후보 탐색
          </p>
          <h1 className="mt-wt-4 font-display text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] sm:text-3xl md:text-4xl md:leading-[1.15]">
            예약한 호텔 가격,
            <br />
            지금 다시 점검해보세요
          </h1>
          <p className="mt-wt-4 font-body text-base leading-relaxed !text-white md:text-lg [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
            호텔, 일정, 객실, 예약가를 입력하면 지원 사이트 기준으로 더 저렴한 후보와
            조건 차이를 빠르게 보여드립니다.
          </p>
        </div>

        <div className="w-full max-w-4xl">
          <div className="rounded-wt-xl border border-white/25 bg-white px-wt-5 py-wt-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] sm:px-wt-6 sm:py-wt-6 md:border-white/30 md:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.22)]">
            <SearchForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
