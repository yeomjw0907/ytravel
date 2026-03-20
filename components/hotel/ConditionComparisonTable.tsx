import type { RateOffer } from "@/lib/types/schema";
import { CONDITION_LABELS_KO, getProviderDisplayName } from "@/lib/search/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui";

const ROW_DEFS: { key: keyof RateOffer["condition"] | "rawRoomName"; label: string }[] = [
  { key: "rawRoomName", label: "객실명" },
  { key: "cancellationType", label: "취소 정책" },
  { key: "boardType", label: "조식" },
  { key: "taxIncluded", label: "세금" },
  { key: "paymentType", label: "결제 방식" },
];

function getCellValue(
  offer: RateOffer,
  key: (typeof ROW_DEFS)[number]["key"]
): string {
  if (key === "rawRoomName") {
    return offer.rawRoomName ?? offer.condition.roomName ?? "-";
  }

  const condition = offer.condition;

  if (key === "taxIncluded") {
    return condition.taxIncluded === true
      ? "포함"
      : condition.taxIncluded === false
        ? "별도"
        : "정보 없음";
  }

  if (key === "cancellationType") {
    return CONDITION_LABELS_KO.cancellationType[condition.cancellationType];
  }

  if (key === "boardType") {
    return CONDITION_LABELS_KO.boardType[condition.boardType];
  }

  if (key === "paymentType") {
    return CONDITION_LABELS_KO.paymentType[condition.paymentType];
  }

  return "-";
}

interface ConditionComparisonTableProps {
  offers: RateOffer[];
}

export function ConditionComparisonTable({
  offers,
}: ConditionComparisonTableProps) {
  if (offers.length === 0) return null;

  return (
    <Table>
      <TableHead>
        <TableHeaderCell>항목</TableHeaderCell>
        {offers.map((offer) => (
          <TableHeaderCell key={offer.id}>
            {getProviderDisplayName(offer.providerId)}
          </TableHeaderCell>
        ))}
      </TableHead>
      <TableBody>
        {ROW_DEFS.map(({ key, label }) => (
          <TableRow key={key}>
            <TableCell className="font-medium text-wt-text-secondary">
              {label}
            </TableCell>
            {offers.map((offer) => (
              <TableCell key={offer.id}>{getCellValue(offer, key)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
