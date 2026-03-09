# 실제 데이터 연동 가이드

## 현재 상태

| 데이터 | 소스 | 비고 |
|--------|------|------|
| **호텔 자동완성** | Amadeus API (설정 시) → mock | `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET` 있으면 실데이터 |
| **호텔 해상도** | Amadeus `by-keyword` (설정 시) → mock | 검색/상세 시 호텔 1건 식별 |
| **OTA 요금** | **전부 mock** | `lib/mock/offers.ts` 하드코딩 |

---

## 1. 호텔 데이터 (이미 연동 가능)

**.env에 추가:**

```env
AMADEUS_CLIENT_ID=your_client_id
AMADEUS_CLIENT_SECRET=your_client_secret
```

- [Amadeus for Developers](https://developers.amadeus.com/) 가입 후 Self-Service에서 앱 생성.
- 자동완성·검색 시 호텔명 해상도가 Amadeus API로 동작하고, 없으면 기존 mock 호텔로 fallback.

---

## 2. OTA 가격(실제 요금) 연동 옵션

### A. Amadeus Hotel Search API (권장)

- **장점**: 이미 Amadeus로 호텔 ID를 쓰고 있음 → 같은 hotelId로 가격 조회 가능.
- **엔드포인트**: `GET /v1/shopping/hotel-offers/by-hotel?hotelId=xxx&adults=2&checkInDate=yyyy-mm-dd&checkOutDate=yyyy-mm-dd` 등.
- **문서**: [Amadeus Hotel Search API](https://developers.amadeus.com/self-service/category/hotels) → Hotel Search v3.
- **흐름**:  
  1. `resolveHotelForSearch`로 얻은 `hotel.id`(Amadeus hotelId) 사용.  
  2. `checkIn` / `checkOut` / `adults` / `rooms`로 Amadeus 호출.  
  3. 응답의 offers를 우리 `RateOffer[]` 형태로 매핑 (providerId는 "amadeus" 또는 응답에 따른 공급처 코드).

### B. RapidAPI 호텔 API

- Skyscanner, Booking 등 호텔 검색 API가 있음. RapidAPI 가입 후 API 키로 호출.
- 응답 스키마가 제각각이므로 **어댑터**에서 `RateOffer`로 변환 필요.

### C. 기타 메타검색 / 제휴

- Kayak, Trivago 등 B2B/제휴 문의 후 API 연동.  
- 문서: `docs/engineering/17-data-sources-and-db-strategy.md` 참고.

---

## 3. 코드에서 바꿀 위치

- **검색 시 오퍼 조회**: `lib/services/search-service.ts`  
  - 현재: `const offers = hotel ? getMockOffersForHotel(hotel.id) : [];`  
  - 실데이터: `const offers = hotel ? await getOffersForHotel(hotel, query) : [];`  
  - `getOffersForHotel`는 `lib/api/offers.ts`(또는 `lib/services/offers-provider.ts`)에서 구현.

- **어댑터 패턴 권장**  
  - `getOffersForHotel(hotel, query)` 내부에서:  
    - Amadeus 설정 시 → Amadeus Hotel Search API 호출 후 `RateOffer[]` 변환.  
    - 실패/미설정 시 → `getMockOffersForHotel(hotel.id)` fallback.  
  - 나중에 RapidAPI 등 추가 시, 어댑터만 더하고 `getOffersForHotel`에서 소스 선택하면 됨.

---

## 4. Amadeus Hotel Search API 연동 시 체크리스트

1. Amadeus 개발자 포털에서 Hotel Search API 권한/할당량 확인.
2. `GET /v1/shopping/hotel-offers/by-hotel` (또는 최신 문서의 경로) 호출 스펙 확인.
3. `lib/api/amadeus.ts`에 `amadeusHotelOffers(hotelId, checkIn, checkOut, adults, rooms)` 같은 함수 추가.
4. 응답 JSON → `RateOffer` 매핑 (totalPrice, currency, condition, deeplink 등).
5. `lib/api/offers.ts`(또는 서비스 레이어)에서 Amadeus 호출 후 실패 시 mock 반환하도록 구현.
6. `search-service.ts`에서 `getMockOffersForHotel` 대신 `getOffersForHotel(hotel, query)` 사용하도록 수정.

---

## 5. 캐시·비용

- 가격 API는 호출당 비용·Rate limit이 있을 수 있음.
- 동일 `(hotelId, checkIn, checkOut, adults, rooms)`에 대해 **짧은 TTL 캐시**(예: 15~30분) 권장.
- 캐시 저장소는 메모리(단일 서버) 또는 Redis/Supabase 등 (다중 인스턴스 시).

---

## 6. 참고

- 데이터 전략: `17-data-sources-and-db-strategy.md`
- API 스펙: `10-api-spec.md`
