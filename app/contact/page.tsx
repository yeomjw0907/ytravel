import { Container } from "@/components/layout/Container";

const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "support@ytravel.kr";

export default function ContactPage() {
  return (
    <Container size="md" className="py-wt-12 md:py-wt-16">
      <div className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-8 shadow-wt-card md:p-wt-10">
        <p className="text-wt-caption font-semibold uppercase tracking-wider text-wt-brand-500">
          Contact
        </p>
        <h1 className="mt-wt-3 font-display text-wt-h1 text-wt-text-primary">
          문의 및 오류 제보
        </h1>
        <p className="mt-wt-4 text-wt-body-md leading-relaxed text-wt-text-secondary">
          현재 문의 채널은 이메일 1개로 운영합니다. 가격 오류, 수집 실패, 잘못된 호텔
          매칭, 외부 링크 문제가 있으면 아래 주소로 보내 주세요.
        </p>

        <div className="mt-wt-8 rounded-wt-lg border border-wt-border bg-wt-surface p-wt-5">
          <p className="text-wt-caption font-medium text-wt-text-secondary">문의 이메일</p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Ytravel%20문의`}
            className="mt-wt-2 inline-flex text-wt-body-lg font-semibold text-wt-brand-700 hover:underline focus-wt"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mt-wt-3 text-wt-body-sm leading-relaxed text-wt-text-secondary">
            영업일 기준 24시간 이내 1차 응답을 목표로 합니다.
          </p>
        </div>

        <section className="mt-wt-8 text-wt-body-sm leading-relaxed text-wt-text-secondary">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">
            함께 보내주시면 좋은 정보
          </h2>
          <ul className="mt-wt-3 list-inside list-disc space-y-wt-1.5">
            <li>호텔명, 체크인/체크아웃 날짜, 성인 수, 객실 수</li>
            <li>문제가 발생한 화면 URL</li>
            <li>외부 사이트에서 확인한 실제 가격 또는 조건 차이</li>
            <li>가능하다면 캡처 이미지나 짧은 설명</li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
