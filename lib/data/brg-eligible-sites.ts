/**
 * BRG(Best Rate Guarantee) 비교 가능 사이트 목록.
 * 사용자 제공 리스트 기반. 참고/문서/향후 연동용.
 * UI 공급처 비교 테이블은 lib/mock/providers + offers 사용.
 */

export interface BrgEligibleSite {
  id: string;
  name: string;
  domain: string;
  url: string;
}

function site(domain: string, name?: string): BrgEligibleSite {
  const raw = domain.trim();
  const d = raw.toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] ?? raw;
  const id = d.replace(/\./g, "-").replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "site";
  const baseUrl = d.startsWith("http") ? d : `https://www.${d}`;
  return {
    id,
    name: name ?? d,
    domain: d,
    url: baseUrl,
  };
}

/** 등록된 BRG 비교 가능 사이트 (도메인 기준 정규화·중복 제거) */
export const BRG_ELIGIBLE_SITES: BrgEligibleSite[] = [
  site("ab-in-den-urlaub.de"),
  site("tui.com", "TUI"),
  site("b2c.wbe.travel"),
  site("barakehtravel.com"),
  site("bookerflash.com"),
  site("bookingbro.com"),
  site("destination2.co.uk"),
  site("dwidayatour.co.id"),
  site("esky.com", "eSky"),
  site("elfondok.com"),
  site("esky.de", "eSky DE"),
  site("expediafortd.com"),
  site("fliggy.com"),
  site("flightcatchers.com"),
  site("flightcentre.co.uk"),
  site("hotelplanner.com", "HotelPlanner"),
  site("gdspnr.com"),
  site("hotelsugogo.com"),
  site("musafir.com"),
  site("interpark.com", "인터파크"),
  site("itinera.com"),
  site("ivivu.com"),
  site("locktrip.com"),
  site("monkeytravel.com"),
  site("privateupgrades.com"),
  site("regencyholidays.com"),
  site("rehlat.com"),
  site("reservationday.com"),
  site("reserving.com"),
  site("sitc.sa"),
  site("smshoteldeals.com", "SMS Hotel Deals"),
  site("southwest.com", "Southwest"),
  site("stayforlong.co.uk", "Stayforlong"),
  site("stayforless.com"),
  site("super.com", "Super.com"),
  site("travelko.com", "Travelko"),
  site("travelocity.com", "Travelocity"),
  site("traveloka.com", "Traveloka"),
  site("travelzodiac.com"),
  site("trip.com", "Trip.com"),
  site("tripbtoz.com"),
  site("trivago.com", "Trivago"),
  site("tui.co.uk", "TUI UK"),
  site("vacationdeck.com"),
  site("vectatravels.com"),
  site("vegas.com"),
  site("via.com"),
  site("vio.com"),
  site("virginholidays.co.uk"),
  site("webjet.com", "WebJet"),
  site("wego.com", "Wego"),
  site("wingontravel.com"),
  site("wizfairtravels.com"),
  site("yatra.com", "Yatra"),
  site("roomsxxl.com"),
  site("tripening.com"),
  site("bookonline.com", "Book Online Deals"),
  site("fareobuddy.com"),
  site("catchit.com"),
  site("billabook.com"),
  site("lastminute.com", "Lastminute"),
  site("destinia.com", "Destinia"),
  site("clicktrip.com"),
  site("logitravel.com"),
  site("alghanimtravel.com"),
  site("vrbo.com", "VRBO"),
  site("airasia.com", "AirAsia"),
  site("algotels.com"),
  site("hyperair.com"),
  site("halalbooking.com"),
  site("laterooms.com"),
  site("enuygun.com"),
  site("amimir.com"),
  site("musetrip.com"),
  site("almosafer.com", "Almosafer"),
  site("morerooms.com"),
  site("momondo.com", "Momondo"),
  site("orbitz.com", "Orbitz"),
  site("hotwire.com", "Hotwire"),
  site("hoteltonight.com", "Hotel Tonight"),
  site("hopper.com", "Hopper"),
  site("rioca.eu"),
  site("dnatatravel.com"),
  site("ebookers.com", "Ebookers"),
  site("hotel.de"),
  site("easemytrip.com"),
  site("travellergram.com"),
  site("quehoteles.com"),
  site("dertour.de"),
  site("sitelike.org"),
  site("fti.de"),
  site("revngo.com"),
  site("travala.com", "Travala"),
  site("destinia.kr", "Destinia KR"),
  site("yamsafer.com"),
  site("tajawal.com"),
  site("tathkarah.com", "Tathkarah Hotels"),
  site("despegar.com"),
  site("akbartravels.com"),
  site("kayak.com", "Kayak"),
  site("hutchgo.co.hk"),
  site("rakuten.com", "Rakuten Travel"),
  site("cleartrip.ae"),
  site("easyclicktravel.com"),
  site("elvoline.com"),
  site("getaroom.com"),
  site("hotelclick.com"),
  site("latestays.com"),
  site("nusatrip.com"),
  site("otel.com"),
  site("skoosh.com"),
  site("splendia.com"),
  site("travelnow.com"),
  site("travelzoo.com"),
  site("wego.co.kr", "Wego Korea"),
  site("asiatravel.com"),
  site("hotelgo24.com"),
  site("hotelquickly.com"),
  site("ticati.com"),
  site("omegatravel.net"),
  site("amoma.com"),
  site("urlaub.de"),
  site("centraldereservas.com"),
  site("cheaptickets.com"),
  site("snaptravel.com"),
  site("elong.com"),
  site("hotelpass.com"),
  site("hotelnjoy.com"),
  site("hotelreservierung.de"),
  site("lastminutetravel.com"),
  site("yeego.com"),
  site("hotellook.com"),
  site("getawayholidays.com"),
  site("hoteljava.co.kr", "호텔자바"),
  site("skylark.com"),
  site("flyin.com"),
  site("majedtravelonline.com"),
  site("zeeyarah.com"),
  site("qunar.com", "Qunar Hotel"),
  site("holidayme.com"),
  site("skiplagged.com"),
  site("city.travel"),
  site("dohop.com"),
  site("edreams.com"),
  // 한국 사이트 (도메인 없이 브랜드명만 있는 경우)
  { id: "hanatour", name: "하나투어", domain: "hanatour.com", url: "https://www.hanatour.com" },
  { id: "yellowballoon", name: "노랑풍선", domain: "yellowballoon.co.kr", url: "https://www.yellowballoon.co.kr" },
  { id: "interpark", name: "인터파크", domain: "interpark.com", url: "https://www.interpark.com" },
];

/** id로 조회 */
export function getBrgEligibleSiteById(id: string): BrgEligibleSite | undefined {
  return BRG_ELIGIBLE_SITES.find((s) => s.id === id);
}

/** 도메인 포함 검색 */
export function findBrgEligibleSitesByDomain(domainPart: string): BrgEligibleSite[] {
  const lower = domainPart.toLowerCase();
  return BRG_ELIGIBLE_SITES.filter((s) => s.domain.includes(lower) || s.name.toLowerCase().includes(lower));
}
