import { Container } from "@/components/layout/Container";

export function CompareCriteriaSection() {
  return (
    <section className="bg-wt-bg pb-wt-14 pt-wt-16 md:pb-wt-20 md:pt-wt-24">
      <Container size="md">
        <div className="rounded-wt-xl border border-wt-border bg-wt-panel p-wt-6 shadow-wt-card md:p-wt-8">
          <h2 className="font-display text-wt-h3 text-wt-text-primary">
            비교 기준은 보수적으로
          </h2>
          <p className="mt-wt-4 font-body text-wt-body-md leading-relaxed text-wt-text-secondary">
            같은 날짜, 같은 인원, 비슷한 객실 조건을 우선 기준으로 봅니다. 취소 조건,
            조식 포함 여부, 세금 포함 여부가 다르면
            <strong className="font-semibold text-wt-text-primary"> 직접 확인 필요</strong>
            로 안내합니다.
          </p>
        </div>
      </Container>
    </section>
  );
}
