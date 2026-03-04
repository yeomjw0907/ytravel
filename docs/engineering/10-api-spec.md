# Ytravel API 명세 초안

## 1. 목적

이 문서는 Ytravel MVP의 내부/외부 API 계약 초안을 정의한다.

원칙

- 검색 중심 구조
- 공급처별 수집 실패를 허용하는 응답 구조
- UI는 부분 성공 응답도 렌더링 가능해야 함

## 2. API 목록

- `GET /api/health`
- `POST /api/search`
- `GET /api/hotels` — 등록된 호텔 목록
- `GET /api/hotels/autocomplete?q=xxx` — 호텔명 자동완성 (내부 목록 또는 Amadeus)
- `GET /api/hotels/:slug`
- `GET /api/hotels/:slug/rates`
- `GET /api/providers`

## 3. Endpoint Specifications

## 3.1 GET /api/health

설명

- 서비스 상태 확인

응답 예시

```json
{
  "status": "ok",
  "service": "ytravel",
  "timestamp": "2026-03-04T12:00:00.000Z"
}
```

## 3.2 POST /api/search

설명

- 호텔명과 일정 기준으로 가격 비교 결과를 반환

요청 본문

```json
{
  "hotelName": "Grand Hyatt Seoul",
  "destination": "Seoul",
  "checkIn": "2026-05-10",
  "checkOut": "2026-05-12",
  "adults": 2,
  "children": 0,
  "rooms": 1,
  "currency": "KRW",
  "locale": "ko-KR"
}
```

응답

```json
{
  "query": {
    "hotelName": "Grand Hyatt Seoul",
    "destination": "Seoul",
    "checkIn": "2026-05-10",
    "checkOut": "2026-05-12",
    "adults": 2,
    "children": 0,
    "rooms": 1,
    "currency": "KRW",
    "locale": "ko-KR"
  },
  "hotel": {
    "id": "hotel_gh_seoul",
    "slug": "grand-hyatt-seoul",
    "name": "Grand Hyatt Seoul",
    "brand": "Hyatt",
    "city": "Seoul",
    "country": "KR",
    "officialSiteUrl": "https://example.com"
  },
  "providers": [
    { "id": "official", "name": "Official Website", "type": "official" },
    { "id": "trip-com", "name": "Trip.com", "type": "ota" },
    { "id": "agoda", "name": "Agoda", "type": "ota" }
  ],
  "offers": [],
  "fetchStatuses": [],
  "brgEvaluation": null,
  "generatedAt": "2026-03-04T12:00:00.000Z"
}
```

성공 코드

- `200 OK`

에러 코드

- `400 Bad Request`
- `404 Not Found`
- `422 Unprocessable Entity`
- `500 Internal Server Error`

## 3.2.5 GET /api/hotels

설명

- 등록된 호텔 전체 목록 반환. 검색 자동완성·유효 slug 검증 등에 사용.

응답 예시

```json
{
  "hotels": [
    {
      "id": "hotel_gh_seoul",
      "slug": "grand-hyatt-seoul",
      "name": "그랜드 하얏트 서울",
      "brand": "Hyatt",
      "city": "서울",
      "country": "KR",
      "officialSiteUrl": "https://example.com",
      "stars": 5,
      "thumbnailUrl": null
    }
  ]
}
```

성공 코드

- `200 OK`

## 3.3 GET /api/hotels/:slug

설명

- 호텔 메타 정보 반환

응답 예시

```json
{
  "id": "hotel_gh_seoul",
  "slug": "grand-hyatt-seoul",
  "name": "Grand Hyatt Seoul",
  "brand": "Hyatt",
  "city": "Seoul",
  "country": "KR",
  "officialSiteUrl": "https://example.com"
}
```

## 3.4 GET /api/hotels/:slug/rates

설명

- 특정 호텔의 가격 및 BRG 평가 반환

권장 쿼리 파라미터

- `checkIn`
- `checkOut`
- `adults`
- `children`
- `rooms`
- `currency`

예시

`GET /api/hotels/grand-hyatt-seoul/rates?checkIn=2026-05-10&checkOut=2026-05-12&adults=2&rooms=1&currency=KRW`

응답 예시

```json
{
  "hotel": {
    "id": "hotel_gh_seoul",
    "slug": "grand-hyatt-seoul",
    "name": "Grand Hyatt Seoul",
    "brand": "Hyatt",
    "city": "Seoul",
    "country": "KR",
    "officialSiteUrl": "https://example.com"
  },
  "offers": [
    {
      "id": "offer_official_1",
      "hotelId": "hotel_gh_seoul",
      "providerId": "official",
      "providerType": "official",
      "deeplink": "https://example.com",
      "currency": "KRW",
      "basePrice": 290000,
      "taxAmount": 30000,
      "totalPrice": 320000,
      "collectedAt": "2026-03-04T12:00:00.000Z",
      "condition": {
        "roomName": "King Room",
        "boardType": "room_only",
        "cancellationType": "free_cancellation",
        "paymentType": "pay_now",
        "taxIncluded": true,
        "occupancy": 2,
        "bedType": "king",
        "viewType": null,
        "notes": []
      },
      "rawRoomName": "1 King Bed Standard Room",
      "available": true,
      "disclaimer": null
    }
  ],
  "fetchStatuses": [
    {
      "providerId": "official",
      "status": "success",
      "message": null,
      "latencyMs": 1200,
      "fetchedAt": "2026-03-04T12:00:00.000Z"
    }
  ],
  "brgEvaluation": {
    "officialOfferId": "offer_official_1",
    "lowestOtaOfferId": "offer_trip_1",
    "officialPrice": 320000,
    "lowestOtaPrice": 268000,
    "priceGap": 52000,
    "priceGapPercent": 16.25,
    "eligibility": "likely",
    "confidence": "high",
    "estimatedBrgPrice": 201000,
    "matchedFields": ["roomName", "boardType", "cancellationType", "taxIncluded"],
    "mismatchedFields": [],
    "reasons": ["OTA 가격이 공식가보다 낮고 동일 조건으로 판단됨"]
  }
}
```

## 3.5 GET /api/providers

설명

- 지원 공급처 목록 반환

응답 예시

```json
{
  "providers": [
    {
      "id": "official",
      "name": "Official Website",
      "type": "official",
      "baseUrl": "https://example.com",
      "status": "active"
    },
    {
      "id": "trip-com",
      "name": "Trip.com",
      "type": "ota",
      "baseUrl": "https://trip.com",
      "status": "beta"
    }
  ]
}
```

## 4. Validation Rules

### Search Request Validation

- `hotelName` 필수
- `checkIn`, `checkOut` 필수
- `checkOut > checkIn`
- `adults >= 1`
- `rooms >= 1`
- 지원하지 않는 통화는 기본 통화로 fallback 가능

## 5. Error Response Format

표준 에러 응답

```json
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "checkOut must be later than checkIn"
  }
}
```

에러 코드 후보

- `INVALID_REQUEST`
- `INVALID_DATE_RANGE`
- `HOTEL_NOT_FOUND`
- `NO_RESULTS`
- `PROVIDER_TIMEOUT`
- `UPSTREAM_ERROR`

## 6. Partial Success Rules

- 일부 공급처 실패 시 전체 응답은 `200` 유지 가능
- 실패한 공급처는 `fetchStatuses`에 반영
- `offers`는 성공한 공급처만 포함
- UI는 실패 상태를 배지 또는 안내 문구로 표시

## 7. Versioning Strategy

초기 권장

- `/api/v1/...`

MVP에서는 단순화를 위해 생략 가능하지만, 운영 전환 시 버저닝 추가 권장

## 8. Security and Rate Limiting Notes

- 클라이언트가 직접 공급처를 호출하지 않음
- 외부 수집은 서버 레이어에서 수행
- 검색 API에는 rate limit 필요
- 민감한 공급처 키가 생기면 서버 환경변수로 분리
