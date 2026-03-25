"use client";

import { useEffect } from "react";

const BRG_STEPS = [
  "같은 객실명, 같은 일정, 같은 인원 조건인지 먼저 확인합니다.",
  "취소 규정과 조식 포함 여부가 같은지 다시 확인합니다.",
  "외부 사이트에서 실제 총액을 다시 확인합니다.",
  "세금, 수수료, 프로모션 적용 여부를 확인합니다.",
  "해당 호텔 브랜드의 BRG 정책을 마지막으로 직접 확인합니다.",
];

interface BrgModalProps {
  onClose: () => void;
}

export function BrgModal({ onClose }: BrgModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brg-modal-title"
    >
      <div
        className="absolute inset-0 bg-wt-brand-900/60 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-wt-xl border border-wt-border bg-wt-panel shadow-wt-soft">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-wt-border bg-wt-panel px-wt-6 py-wt-4">
          <h2 id="brg-modal-title" className="font-display text-wt-h3 text-wt-text-primary">
            BRG 가이드
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-wt-md p-wt-1 text-wt-text-secondary transition-colors hover:bg-wt-surface hover:text-wt-text-primary focus-wt"
            aria-label="닫기"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        <div className="px-wt-6 py-wt-5">
          <p className="font-body text-wt-body-md font-medium text-wt-text-primary">
            Best Rate Guarantee (최저가 보장)
          </p>
          <p className="mt-wt-2 font-body text-wt-body-sm leading-relaxed text-wt-text-secondary">
            일부 호텔 브랜드는 공식 사이트보다 더 낮은 가격을 외부 사이트에서 찾으면
            가격을 맞춰주거나 추가 혜택을 주는 BRG 정책을 운영합니다.
          </p>

          <p className="mt-wt-5 font-body text-wt-body-sm font-medium text-wt-text-primary">
            Ytravel의 역할
          </p>
          <p className="mt-wt-1 font-body text-wt-body-sm leading-relaxed text-wt-text-secondary">
            Ytravel은 예약가와 외부 후보를 비교해 BRG를 검토할 만한 상황인지 빠르게
            파악하도록 돕습니다. 다만 BRG 승인 여부를 확정하지 않으며, 실제 적용 여부는
            호텔 브랜드 정책과 제출 시점 조건에 따라 달라집니다.
          </p>

          <p className="mt-wt-5 font-body text-wt-body-sm font-medium text-wt-text-primary">
            BRG 확인 체크리스트
          </p>
          <ol className="mt-wt-2 list-inside list-decimal space-y-wt-1.5 font-body text-wt-body-sm text-wt-text-primary">
            {BRG_STEPS.map((step) => (
              <li key={step} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>

          <p className="mt-wt-5 rounded-wt-md border border-wt-info-bg bg-wt-info-bg/50 px-wt-4 py-wt-3 font-body text-wt-body-sm leading-relaxed text-wt-text-secondary">
            BRG 가능성은 참고 정보입니다. 호텔 공식 정책과 실제 예약 화면을 다시 확인한
            뒤 진행해 주세요.
          </p>

          <div className="mt-wt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-wt-md bg-wt-brand-700 px-wt-5 text-wt-body-sm font-medium text-white transition-colors hover:bg-wt-brand-500 focus-wt"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
