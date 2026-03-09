import type { RateOffer } from "@/lib/types/schema";
import { getProviderDisplayName } from "@/lib/search/format";
import { CONDITION_LABELS_KO } from "@/lib/search/format";
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
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
  if (key === "rawRoomName")
    return offer.rawRoomName ?? offer.condition.roomName ?? "—";
  const c = offer.condition;
  if (key === "taxIncluded")
    return c.taxIncluded === true ? "포함" : c.taxIncluded === false ? "미포함" : "—";
  if (key === "cancellationType")
    return CONDITION_LABELS_KO.cancellationType[c.cancellationType];
  if (key === "boardType") return CONDITION_LABELS_KO.boardType[c.boardType];
  if (key === "paymentType") return CONDITION_LABELS_KO.paymentType[c.paymentType];
  return "—";
}

interface ConditionComparisonTableProps {
  offers: RateOffer[];
}

/**
 * 객실 조건 비교 표 (15-page-wireframes §6) — 차이 항목 시각적 정리
 */
export function ConditionComparisonTable({ offers }: ConditionComparisonTableProps) {
  if (offers.length === 0) return null;

  return (
    <Table>
      <TableHead>
        <TableHeaderCell>항목</TableHeaderCell>
        {offers.map((o) => (
          <TableHeaderCell key={o.id}>{getProviderDisplayName(o.providerId)}</TableHeaderCell>
        ))}
      </TableHead>
      <TableBody>
        {ROW_DEFS.map(({ key, label }) => (
          <TableRow key={key}>
            <TableCell className="font-medium text-wt-text-secondary">{label}</TableCell>
            {offers.map((o) => (
              <TableCell key={o.id}>{getCellValue(o, key)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
