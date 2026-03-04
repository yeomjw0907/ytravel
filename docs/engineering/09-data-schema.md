# Ytravel 데이터 스키마

## 1. 목적

이 문서는 Ytravel의 핵심 데이터 엔티티와 필드 구조를 정의한다.

원칙

- 공급처별 원본 구조와 내부 공통 구조를 분리한다.
- UI는 공통 정규화 모델을 기준으로 동작한다.
- BRG 계산은 정규화된 가격 데이터만 사용한다.

## 2. 엔티티 목록

- SearchQuery
- Hotel
- Provider
- RateOffer
- RateCondition
- BrgEvaluation
- SearchResult
- ProviderFetchStatus

## 3. Entity Definitions

## 3.1 SearchQuery

설명

- 사용자가 입력한 검색 조건

필드

- `hotelName`: string
- `destination`: string | null
- `checkIn`: string (ISO date)
- `checkOut`: string (ISO date)
- `adults`: number
- `children`: number
- `rooms`: number
- `currency`: string
- `locale`: string

예시

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

## 3.2 Hotel

설명

- Ytravel 내부 기준 호텔 정보

필드

- `id`: string
- `slug`: string
- `name`: string
- `brand`: string | null
- `city`: string
- `country`: string
- `officialSiteUrl`: string
- `stars`: number | null
- `thumbnailUrl`: string | null

## 3.3 Provider

설명

- 가격 공급처 정보

필드

- `id`: string
- `name`: string
- `type`: `"official" | "ota"`
- `baseUrl`: string
- `logoUrl`: string | null
- `status`: `"active" | "beta" | "disabled"`

예시 provider id

- `official`
- `trip-com`
- `agoda`
- `booking-com`

## 3.4 RateCondition

설명

- 동일 조건 비교에 필요한 메타데이터

필드

- `roomName`: string
- `boardType`: `"room_only" | "breakfast_included" | "half_board" | "unknown"`
- `cancellationType`: `"free_cancellation" | "non_refundable" | "partial_refund" | "unknown"`
- `paymentType`: `"pay_now" | "pay_later" | "pay_at_hotel" | "unknown"`
- `taxIncluded`: boolean | null
- `occupancy`: number | null
- `bedType`: string | null
- `viewType`: string | null
- `notes`: string[]

## 3.5 RateOffer

설명

- 공급처별 정규화된 가격 제안

필드

- `id`: string
- `hotelId`: string
- `providerId`: string
- `providerType`: `"official" | "ota"`
- `deeplink`: string
- `currency`: string
- `basePrice`: number
- `taxAmount`: number | null
- `totalPrice`: number
- `collectedAt`: string (ISO datetime)
- `condition`: RateCondition
- `rawRoomName`: string | null
- `available`: boolean
- `disclaimer`: string | null

## 3.6 ProviderFetchStatus

설명

- 공급처별 수집 성공 여부와 상태 추적

필드

- `providerId`: string
- `status`: `"success" | "partial" | "failed" | "timeout"`
- `message`: string | null
- `latencyMs`: number | null
- `fetchedAt`: string (ISO datetime)

## 3.7 BrgEvaluation

설명

- BRG 관점의 비교 결과

필드

- `officialOfferId`: string | null
- `lowestOtaOfferId`: string | null
- `officialPrice`: number | null
- `lowestOtaPrice`: number | null
- `priceGap`: number | null
- `priceGapPercent`: number | null
- `eligibility`: `"likely" | "review" | "not_eligible" | "insufficient_data"`
- `confidence`: `"high" | "medium" | "low"`
- `estimatedBrgPrice`: number | null
- `matchedFields`: string[]
- `mismatchedFields`: string[]
- `reasons`: string[]

## 3.8 SearchResult

설명

- 검색 결과 화면에서 사용하는 집계 객체

필드

- `query`: SearchQuery
- `hotel`: Hotel | null
- `providers`: Provider[]
- `offers`: RateOffer[]
- `fetchStatuses`: ProviderFetchStatus[]
- `brgEvaluation`: BrgEvaluation | null
- `generatedAt`: string (ISO datetime)

## 4. 비교 로직용 파생 필드

UI 또는 계산에서 파생 가능한 값

- `isLowestPrice`
- `isOfficial`
- `formattedTotalPrice`
- `hasFreeCancellation`
- `hasBreakfast`
- `isComparable`

## 5. 정규화 원칙

- 공급처 원본 객실명은 `rawRoomName`에 유지한다.
- 내부 비교에는 정규화된 `condition.roomName`을 우선 사용한다.
- 세금 불명확 시 `taxIncluded`는 `null` 허용
- 수집 실패한 공급처도 상태 객체는 남긴다.

## 6. 향후 확장 필드

- `screenshotUrl`
- `memberOnlyRate`
- `loyaltyDiscount`
- `refundableUntil`
- `roomInventoryLeft`
- `brandBrgPolicyId`

## 7. 타입 설계 원칙

- 숫자 가격은 문자열이 아니라 number로 저장
- 시간은 ISO 문자열 사용
- 금액 계산은 가능한 총액 기준으로 수행
- UI용 포맷 값은 저장하지 않고 렌더링 시 생성
