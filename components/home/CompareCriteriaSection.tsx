import { Container } from "@/components/layout/Container";

/**
 * 비교 기준 안내 - 짧은 블록 (01-prd: 조건 비교 우선)
 */
export function CompareCriteriaSection() {
  return (
    <section className="bg-wt-bg py-wt-16 md:py-wt-20">
      <Container size="md">
        <div className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-8 shadow-wt-card md:p-wt-10">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">
            비교 기준
          </h2>
          <p className="mt-wt-5 font-body text-wt-body-md leading-relaxed text-wt-text-secondary">
            동일 객실·동일 날짜·동일 인원을 기준으로, 취소 정책·조식·세금 포함 여부를 함께 비교합니다.
            BRG 가능성은 이 조건 일치 여부에 따라 달라질 수 있습니다.
          </p>
        </div>
      </Container>
    </section>
  );
}
