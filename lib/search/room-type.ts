import type { RateOffer } from "@/lib/types/schema";

export interface RoomGroup {
  roomName: string;
  offers: RateOffer[];
}

/**
 * 오퍼를 객실명(룸타입)별로 그룹화.
 * condition.roomName → 없으면 rawRoomName → 둘 다 없으면 "객실".
 */
export function groupOffersByRoomName(offers: RateOffer[]): RoomGroup[] {
  const byRoom = new Map<string, RateOffer[]>();
  for (const o of offers) {
    const name =
      o.condition?.roomName ?? o.rawRoomName ?? "객실";
    if (!byRoom.has(name)) byRoom.set(name, []);
    byRoom.get(name)!.push(o);
  }
  return Array.from(byRoom.entries()).map(([roomName, offers]) => ({
    roomName,
    offers,
  }));
}
