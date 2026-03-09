import type {
  Provider,
  ProviderFetchStatus,
  RateOffer,
} from "@/lib/types/schema";
import {
  CONDITION_LABELS_KO,
  formatPrice,
  getProviderDisplayName,
} from "@/lib/search/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui";
import { ConditionBadge } from "@/components/ui";

interface ProviderRateTableProps {
  offers: RateOffer[];
  providers: Provider[];
  fetchStatuses: ProviderFetchStatus[];
  highlightedOfferId: string | null;
  userBookedPrice?: number;
  currency?: string;
}

function getStatusForProvider(
  providerId: string,
  fetchStatuses: ProviderFetchStatus[]
): ProviderFetchStatus | undefined {
  return fetchStatuses.find((status) => status.providerId === providerId);
}

export function ProviderRateTable({
  offers,
  providers,
  fetchStatuses,
  highlightedOfferId,
  userBookedPrice,
  currency = "KRW",
}: ProviderRateTableProps) {
  const offerByProvider = new Map(offers.map((offer) => [offer.providerId, offer]));
  const showVsUserPrice =
    userBookedPrice != null && Number.isFinite(userBookedPrice);

  return (
    <Table>
      <TableHead>
        <TableHeaderCell>공급처</TableHeaderCell>
        <TableHeaderCell align="right">총액</TableHeaderCell>
        {showVsUserPrice && (
          <TableHeaderCell align="right">내 예약가 대비</TableHeaderCell>
        )}
        <TableHeaderCell>취소</TableHeaderCell>
        <TableHeaderCell>조식</TableHeaderCell>
        <TableHeaderCell>세금</TableHeaderCell>
        <TableHeaderCell>결제</TableHeaderCell>
        <TableHeaderCell align="center">보기</TableHeaderCell>
      </TableHead>
      <TableBody>
        {providers.map((provider) => {
          const offer = offerByProvider.get(provider.id) ?? null;
          const status = getStatusForProvider(provider.id, fetchStatuses);
          const isFailed = status?.status === "failed" || status?.status === "timeout";
          const isHighlighted = offer?.id === highlightedOfferId;

          return (
            <TableRow key={provider.id}>
              <TableCell>
                <span className="font-medium">
                  {getProviderDisplayName(provider.id)}
                </span>
                {isHighlighted && (
                  <span className="ml-wt-2 text-wt-caption text-wt-success-text">
                    최적 후보
                  </span>
                )}
              </TableCell>
              {isFailed ? (
                <>
                  <TableCell align="right" className="text-wt-text-secondary">
                    -
                  </TableCell>
                  {showVsUserPrice && (
                    <TableCell align="right" className="text-wt-text-secondary">
                      -
                    </TableCell>
                  )}
                  <td colSpan={5} className="px-wt-3 py-wt-3">
                    <span className="text-wt-caption text-wt-danger-text">
                      {status?.message ?? "요금을 불러오지 못했습니다."}
                    </span>
                  </td>
                </>
              ) : offer ? (
                <>
                  <TableCell align="right" className="tabular-nums font-medium">
                    {formatPrice(offer.totalPrice, offer.currency)}
                  </TableCell>
                  {showVsUserPrice && (
                    <TableCell align="right" className="tabular-nums text-wt-text-secondary">
                      {formatPrice(
                        userBookedPrice! - offer.totalPrice,
                        currency
                      )}{" "}
                      {userBookedPrice! - offer.totalPrice > 0 ? (
                        <span className="text-wt-success-text">저렴</span>
                      ) : (
                        <span className="text-wt-danger-text">비쌈</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <ConditionBadge variant="neutral">
                      {CONDITION_LABELS_KO.cancellationType[offer.condition.cancellationType]}
                    </ConditionBadge>
                  </TableCell>
                  <TableCell>
                    <ConditionBadge variant="neutral">
                      {CONDITION_LABELS_KO.boardType[offer.condition.boardType]}
                    </ConditionBadge>
                  </TableCell>
                  <TableCell>
                    {offer.condition.taxIncluded === true
                      ? "포함"
                      : offer.condition.taxIncluded === false
                        ? "별도"
                        : "모름"}
                  </TableCell>
                  <TableCell>
                    <ConditionBadge variant="neutral">
                      {CONDITION_LABELS_KO.paymentType[offer.condition.paymentType]}
                    </ConditionBadge>
                  </TableCell>
                  <TableCell align="center">
                    <a
                      href={offer.deeplink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-wt-body-sm font-medium text-wt-brand-500 hover:underline focus-wt"
                    >
                      보기
                    </a>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell align="right" className="text-wt-text-secondary">
                    -
                  </TableCell>
                  {showVsUserPrice && (
                    <TableCell align="right" className="text-wt-text-secondary">
                      -
                    </TableCell>
                  )}
                  <td colSpan={5} className="px-wt-3 py-wt-3 text-wt-text-secondary">
                    후보 없음.
                  </td>
                </>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
