# Ytravel Launch Positioning

## Core message

- Ytravel은 `예약한 호텔 가격이 적정한지 빠르게 점검하는 서비스`다.
- Ytravel은 `시장 전체 최저가를 보장하는 서비스`가 아니다.
- Ytravel은 `BRG 승인 결과를 보장하는 서비스`가 아니다.

## Most credible wedge

- 가장 설득력 있는 포지션은 `포스트-부킹 가격 점검`이다.
- 핵심 사용자는 `이미 예약했고, 더 싼 후보가 있는지 다시 확인하고 싶은 사람`이다.
- BRG는 주 메시지가 아니라 `추가로 확인해볼 수 있는 참고 시나리오`로만 다룬다.

## Public copy rules

### Use

- `예약가 점검`
- `더 저렴한 후보 탐색`
- `지원 사이트 기준 비교`
- `조건 차이 확인`
- `최종 예약 전 직접 확인 필요`
- `BRG 가능성 참고`

### Avoid

- `최저가 보장`
- `확정 할인`
- `100% BRG 성공`
- `공홈 직접 비교 보장`
- `시장 전체 전수 비교`

## Product truth we must keep aligned

- 호텔 자동완성은 Amadeus를 사용할 수 있다.
- 실시간 자동 가격 비교는 `AMADEUS_HOTEL_OFFERS_ENABLED=true`일 때만 켠다.
- 기본 출시 모드는 `reference`다.
- 기본 출시 모드에서는 `Trip.com`, `Traveloka`, `Vio.com`을 참고 후보로 보여주고, `KAYAK`, `momondo`, `Wego`, `trivago`는 링크아웃 fallback으로 제공한다.

## Required trust elements

- 홈, 검색, 상세, 푸터에서 같은 메시지를 써야 한다.
- 결과 화면에는 `수집 시각`, `지원 사이트 기준`, `최종 직접 확인`, `BRG 비보장`이 항상 보여야 한다.
- 법무/운영 문서는 실제 코드 동작과 맞아야 한다.
- 깨진 한글이나 과장된 문구가 한 곳이라도 남으면 출시 신뢰를 해친다.

## Launch recommendation

- 이번 주에는 `reference-first`로 여는 것이 맞다.
- `실시간 자동 비교`는 실제 API 품질이 검증된 뒤 점진적으로 켠다.
- 출시 성공 기준은 더 많은 공급처가 아니라 `믿을 수 있는 비교 경험`이다.
