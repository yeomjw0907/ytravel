import type { ProviderFetchStatus } from "@/lib/types/schema";
import { getProviderDisplayName } from "@/lib/search/format";

interface PartialFailureNoticeProps {
  fetchStatuses: ProviderFetchStatus[];
}

export function PartialFailureNotice({
  fetchStatuses,
}: PartialFailureNoticeProps) {
  const failed = fetchStatuses.filter(
    (status) => status.status === "failed" || status.status === "timeout"
  );

  if (failed.length === 0) return null;

  return (
    <div className="mb-wt-6 rounded-wt-lg border border-wt-warning-bg bg-wt-warning-bg px-wt-4 py-wt-3 md:mb-wt-8">
      <p className="font-body text-wt-body-sm font-semibold text-wt-warning-text">
        일부 공급처 결과를 불러오지 못했습니다.
      </p>
      <p className="mt-wt-1 text-wt-body-sm leading-relaxed text-wt-text-secondary">
        {failed.map((status) => getProviderDisplayName(status.providerId)).join(", ")}{" "}
        공급처는 이번 검색에서 제외되었고, 현재 응답 가능한 공급처 기준으로 결과를 보여주고 있습니다.
      </p>
    </div>
  );
}
