# 데이터 확보 및 DB 전략

## 1. 목적

Ytravel에서 **호텔 DB**, **공식 홈페이지 가격**, **서드파티(OTA) 가격**을 어떻게 확보할지, 그리고 **DB(Supabase 등)가 언제 필요한지**를 정리한다.

---

## 2. 호텔 DB

**역할**: `Hotel` (id, name, slug, officialSiteUrl, city, country 등) 마스터 데이터.

| 방식 | 설명 |
|------|------|
| **직접 DB 구축** | 호텔 마스터를 자체 설계·운영. `lib/mock/hotels.ts`를 DB/API 조회로 교체. 자동완성·검색은 이 DB를 쿼리. |
| **외부 호텔 API** | Google Places, Amadeus, Skyscanner Hotel API 등에서 호텔 목록·기본 정보 수집 후 **캐시/DB에 저장**하고 `Hotel` 형태로 매핑. |
| **오픈 데이터** | 공개 호텔 목록(CSV/JSON)을 임포트해 DB화하거나 시드 데이터로 활용. |

**권장**: 단기에는 mock을 파일/간단 DB(SQLite, Supabase 등)로 이전하고 `findHotelByQuery`를 해당 저장소 조회로 교체. 중장기에는 Amadeus/Google 등으로 호텔 목록을 채우고, 내부에는 `hotel_id`·`officialSiteUrl` 등만 유지.

---

## 3. 공식 홈페이지(공홈) 가격

**역할**: `providerType: "official"` 인 `RateOffer` 생성.

| 방식 | 설명 |
|------|------|
| **스크래핑** | 공홈 예약 페이지 크롤링. ToS 위반·차단·구조 변경 리스크 있음. |
| **공식 API/제휴** | 호텔·체인(마리오트, 힐튼, 아맥스 등)이 제공하는 API·제휴 프로그램 사용. 합법·안정적, 가입·비용 필요. |
| **파트너/어그리게이터** | SiteMinder, CloudBeds, Booking.com Connectivity 등 채널 매니저/예약 엔진 API로 “공식”에 가까운 가격 수집. |

**권장**: 스크래핑은 법·운영 리스크가 크므로 **공식 API·제휴·어그리게이터** 위주. 당장 API가 없으면 공홈 가격은 수동 입력/제한적 채널로 두고, OTA·제휴 API로 먼저 실서비스 구축.

---

## 4. 서드파티(OTA) 가격 — 메타 검색 API

**역할**: `providerType: "ota"` 인 `RateOffer` (Agoda, Booking, Trip.com 등).

- **60개 사이트 직접 크롤링**은 기술적으로 가능하나, 사이트별 ToS·법적 리스크·유지보수 비용이 커서 **권장하지 않음**.
- **대안**: **메타 검색 API**로 대체. 한 번의 요청으로 여러 OTA 가격을 받아와 `RateOffer[]`로 매핑.

| 서비스 | 비고 |
|--------|------|
| **Skyscanner (RapidAPI 등)** | 호텔 검색·가격, 여러 OTA 집계. API 키·사용량 과금. |
| **Kayak** | B2B/제휴·API 문의. |
| **Trivago** | B2B 메타 검색. |
| **Amadeus** | 호텔 검색·가격·예약 API. 개발자 프로그램·샌드박스 제공. |
| **RapidAPI 호텔 APIs** | 여러 호텔 API 조합 가능. |

**권장**: Amadeus Hotel Search 또는 Skyscanner(RapidAPI) 등으로 **한 번에 여러 OTA** 가격 수집 후, `providerId`별로 `RateOffer`로 정규화. 공홈 가격은 메타 API에 없으므로 별도 채널(공식 API/제휴) 필요.

---

## 5. 현재 코드에 붙이는 방식

- **호텔 DB**: `findHotelByQuery`를 실제 DB/API 조회로 교체. 반환 타입은 기존 `Hotel | null` 유지.
- **가격 수집**: “공급처별 어댑터” 패턴.  
  - 입력: `(Hotel, SearchQuery)` 또는 `(hotelId, checkIn, checkOut, adults, rooms, currency)`  
  - 출력: `Promise<{ offers: RateOffer[]; status: ProviderFetchStatus }>`  
  - 예: `OfficialSiteAdapter`, 메타 검색 API용 `MetaSearchAdapter`(응답을 공급처별로 쪼개어 여러 `RateOffer` 생성).  
- **캐시**: 가격은 수집 비용·Rate limit 때문에 **짧은 TTL 캐시**(예: 15분~1시간) 권장. 동일 검색 조건이면 캐시된 `RateOffer[]` 사용.

---

## 6. DB(Supabase) 필요 여부

**현재**: DB 없음. 호텔·오퍼·공급처 모두 mock (`lib/mock/*.ts`).

| 필요 시점 | 용도 |
|-----------|------|
| **호텔 DB** | mock 대신 실제 호텔 목록·공식 URL·지역 등 저장·검색. |
| **가격 캐시** | 메타 검색 API 결과를 15~30분 TTL로 저장해 호출 수·비용 절감. |
| **사용자·로그인** | 회원가입, 로그인, 프로필 — Supabase Auth 활용 가능. |
| **저장/위시리스트** | “저장한 호텔”, “비교한 검색” 등 사용자별 데이터. |
| **검색/클릭 로그** | 어떤 검색·어떤 공급처 클릭이 많았는지 분석. |
| **관리자/운영** | 호텔·공급처 on/off, 노출 순서 등 설정 저장. |

**정리**  
- mock + 메타 검색 API만 붙이고 “검색 시마다 API 호출 → 화면에만 표시”면 **Supabase 없이 동작 가능**.  
- 호텔 마스터 저장, 가격 캐시, 회원, 저장 목록, 로그 등이 필요해지면 **Supabase(또는 Postgres 등) 도입** 검토.

---

## 7. 참고 문서

- 데이터 스키마: `09-data-schema.md`
- API 스펙: `10-api-spec.md`
- 운영·법적: `../operations/11-operations-legal.md`
