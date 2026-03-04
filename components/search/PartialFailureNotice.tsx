import type { ProviderFetchStatus } from "@/lib/types/schema";
import { getProviderDisplayName } from "@/lib/search/format";

interface PartialFailureNoticeProps {
  fetchStatuses: ProviderFetchStatus[];
}

/**
 * 일부 공급처 수집 실패 시 안내 (13-copywriting, 10-api-spec 부분 성공)
 */
export function PartialFailureNotice({ fetchStatuses }: PartialFailureNoticeProps) {
  const failed = fetchStatuses.filter(
    (s) => s.status === "failed" || s.status === "timeout"
  );
  if (failed.length === 0) return null;

  return (
    <div className="rounded-wt-md border border-wt-warning-bg bg-wt-warning-bg px-wt-4 py-wt-3">
      <p className="font-body text-wt-body-sm font-medium text-wt-warning-text">
        일부 요금을 불러오지 못했습니다
      </p>
      <p className="mt-wt-1 text-wt-body-sm text-wt-text-secondary">
        {failed.map((s) => getProviderDisplayName(s.providerId)).join(", ")} — 현재 확인 가능한
        공급처 기준으로 결과를 보여드립니다.
      </p>
    </div>
  );
}
