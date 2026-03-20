# Ytravel Launch Positioning

## Core message

- Ytravel은 `예약한 가격이 지금도 적정한지 빠르게 점검하는 서비스`다.
- Ytravel은 `호텔 예약 대행 서비스`가 아니다.
- Ytravel은 `BRG 승인 여부를 보장하는 서비스`가 아니다.

## Public copy rules

- 사용해도 되는 표현
  - `예약가 점검`
  - `더 저렴한 후보 탐색`
  - `지원 사이트 기준 비교`
  - `수동 확인 필요`
  - `BRG 가능성 참고`

- 피해야 하는 표현
  - `최저가 보장`
  - `확정 할인`
  - `100% BRG 성공`
  - `공홈 직접 비교 보장`

## Launch defaults

- 호텔 자동완성은 Amadeus 사용 가능
- 가격 비교는 제한 공급처 기준
- 실데이터 가격 노출은 `AMADEUS_HOTEL_OFFERS_ENABLED=true`일 때만 사용
- 실데이터 가격 노출 전에는 공급처 매핑, fetch status, outbound flow를 함께 검증

## Required trust elements

- `/guide`
- `/disclaimer`
- `/contact`
- 검색 결과 하단 면책 문구
- 수집 시각 노출
- 외부 사이트 재확인 안내
