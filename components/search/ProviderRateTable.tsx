import type { RateOffer, Provider, ProviderFetchStatus } from "@/lib/types/schema";
import { formatPrice } from "@/lib/search/format";
import { getProviderDisplayName } from "@/lib/search/format";
import { CONDITION_LABELS } from "@/lib/search/format";
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui";
import { ConditionBadge } from "@/components/ui";

interface ProviderRateTableProps {
  offers: RateOffer[];
  providers: Provider[];
  fetchStatuses: ProviderFetchStatus[];
  lowestOtaOfferId: string | null;
}

function getStatusForProvider(
  providerId: string,
  fetchStatuses: ProviderFetchStatus[]
): ProviderFetchStatus | undefined {
  return fetchStatuses.find((s) => s.providerId === providerId);
}

/**
 * 데스크탑: 공급처별 가격 비교 표 (12-component-spec §5)
 * 공식 홈페이지 상단 고정, 나머지 총액 오름차순. 실패 행은 메시지 표시.
 */
export function ProviderRateTable({
  offers,
  providers,
  fetchStatuses,
  lowestOtaOfferId,
}: ProviderRateTableProps) {
  const offerByProvider = new Map(offers.map((o) => [o.providerId, o]));

  const rows: { providerId: string; name: string; offer: RateOffer | null; status: ProviderFetchStatus | undefined }[] = [];
  for (const p of providers) {
    const offer = offerByProvider.get(p.id) ?? null;
    const status = getStatusForProvider(p.id, fetchStatuses);
    rows.push({
      providerId: p.id,
      name: getProviderDisplayName(p.id),
      offer,
      status,
    });
  }

  return (
    <Table>
      <TableHead>
        <TableHeaderCell>공급처</TableHeaderCell>
        <TableHeaderCell align="right">총액</TableHeaderCell>
        <TableHeaderCell>취소</TableHeaderCell>
        <TableHeaderCell>조식</TableHeaderCell>
        <TableHeaderCell>세금</TableHeaderCell>
        <TableHeaderCell>결제</TableHeaderCell>
        <TableHeaderCell align="center">보기</TableHeaderCell>
      </TableHead>
      <TableBody>
        {rows.map(({ providerId, name, offer, status }) => {
          const isFailed = status?.status === "failed" || status?.status === "timeout";
          const isLowest = offer?.id === lowestOtaOfferId;

          return (
            <TableRow key={providerId}>
              <TableCell>
                <span className="font-medium">{name}</span>
                {isLowest && (
                  <span className="ml-wt-2 text-wt-caption text-wt-success-text">(최저가)</span>
                )}
              </TableCell>
              {isFailed ? (
                <>
                  <TableCell align="right" className="text-wt-text-secondary">
                    —
                  </TableCell>
                  <td colSpan={5} className="px-wt-3 py-wt-3">
                    <span className="text-wt-caption text-wt-danger-text">
                      {status?.message ?? "수집 실패"}
                    </span>
                  </td>
                </>
              ) : offer ? (
                <>
                  <TableCell align="right" className="tabular-nums font-medium">
                    {formatPrice(offer.totalPrice, offer.currency)}
                  </TableCell>
                  <TableCell>
                    <ConditionBadge variant="neutral">
                      {CONDITION_LABELS.cancellationType[offer.condition.cancellationType]}
                    </ConditionBadge>
                  </TableCell>
                  <TableCell>
                    <ConditionBadge variant="neutral">
                      {CONDITION_LABELS.boardType[offer.condition.boardType]}
                    </ConditionBadge>
                  </TableCell>
                  <TableCell>
                    {offer.condition.taxIncluded === true
                      ? "포함"
                      : offer.condition.taxIncluded === false
                        ? "미포함"
                        : "—"}
                  </TableCell>
                  <TableCell>
                    <ConditionBadge variant="neutral">
                      {CONDITION_LABELS.paymentType[offer.condition.paymentType]}
                    </ConditionBadge>
                  </TableCell>
                  <TableCell align="center">
                    <a
                      href={offer.deeplink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-wt-body-sm font-medium text-wt-brand-500 hover:underline focus-wt"
                    >
                      가격 보기
                    </a>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell align="right" className="text-wt-text-secondary">—</TableCell>
                  <td colSpan={5} className="px-wt-3 py-wt-3 text-wt-text-secondary">—</td>
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
