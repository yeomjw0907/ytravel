"use client";

import { useEffect } from "react";

const BRG_STEPS = [
  "동일 객실·동일 날짜·동일 인원인지 확인",
  "취소 정책과 조식 포함 여부가 같은지 확인",
  "외부 사이트에서 실제 총액을 다시 확인",
  "세금·봉사료 포함 여부 확인",
  "해당 호텔 브랜드의 BRG 정책을 확인",
];

interface BrgModalProps {
  onClose: () => void;
}

/**
 * BRG(Best Rate Guarantee) 설명 모달. 13-copywriting·BrgGuidePanel 톤 유지.
 */
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
            BRG란?
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
            Best Rate Guarantee(최저가 보증)
          </p>
          <p className="mt-wt-2 font-body text-wt-body-sm leading-relaxed text-wt-text-secondary">
            많은 호텔 브랜드가 운영하는 제도로, 공식 홈페이지보다 낮은 가격을 다른 사이트에서 찾을 경우
            그 가격에 맞추거나 보상해 주는 정책입니다.
          </p>

          <p className="mt-wt-5 font-body text-wt-body-sm font-medium text-wt-text-primary">
            Ytravel이 하는 일
          </p>
          <p className="mt-wt-1 font-body text-wt-body-sm leading-relaxed text-wt-text-secondary">
            호텔 공식 홈페이지와 OTA(온라인 여행사) 요금을 같은 조건 기준으로 비교해,
            BRG 신청이 가능해 보이는지 탐색할 수 있도록 Ytravel이 돕습니다.
          </p>

          <p className="mt-wt-5 font-body text-wt-body-sm font-medium text-wt-text-primary">
            BRG 진행 전 확인 항목
          </p>
          <ol className="mt-wt-2 list-inside list-decimal space-y-wt-1.5 font-body text-wt-body-sm text-wt-text-primary">
            {BRG_STEPS.map((step, i) => (
              <li key={i} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ol>

          <p className="mt-wt-5 rounded-wt-md border border-wt-info-bg bg-wt-info-bg/50 px-wt-4 py-wt-3 font-body text-wt-body-sm leading-relaxed text-wt-text-secondary">
            BRG 가능성은 참고 정보이며, 실제 승인 여부는 호텔 브랜드 정책에 따라 달라질 수 있습니다.
            예약 전 해당 호텔의 BRG 약관을 확인해 주세요.
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
