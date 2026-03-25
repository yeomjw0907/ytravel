# Ytravel Cycle Plan

## Goal

이번 사이클의 목표는 `기획 검증 -> 메시지 정합화 -> 구현 -> QA -> 성능 점검 -> 배포`를 한 번에 끝내는 것이다.

## Planning conclusions

### 1. Office Hours

- 가장 설득력 있는 문제 정의는 `이미 예약한 사용자가 내가 비싸게 예약했는지 다시 확인하고 싶다`이다.
- `전수 비교`나 `최저가 보장`은 이번 단계에서 비현실적이다.
- 출시 가치는 `빠른 점검`, `신뢰 가능한 안내`, `바로 재확인 가능한 링크`에 있다.

### 2. CEO Review

- 범위는 넓히지 않는다.
- 대신 메시지를 더 날카롭게 만든다.
- 이번 출시에서는 `포스트-부킹 가격 점검 도구`로 포지셔닝을 고정한다.
- BRG는 보조 가치로만 남긴다.

### 3. Design Review

- 홈 첫 화면에서 `예약가 점검`과 `후보 탐색`이 바로 이해되어야 한다.
- 결과 화면은 숫자보다 `상태`, `조건 차이`, `직접 확인 필요`를 먼저 보여야 한다.
- 깨진 한글과 애매한 문구는 전부 제거한다.

### 4. Eng Review

- 코드와 문서의 공급처 모델을 일치시킨다.
- `live`와 `reference` 상태를 명확히 구분한다.
- 검색, 결과, 상세, 법무 페이지의 문구와 상태를 정리한다.
- 이번 사이클에서는 새 데이터 소스 확장보다 신뢰 품질을 우선한다.

## Skills to use in order

1. `gstack-office-hours`
2. `gstack-plan-ceo-review`
3. `gstack-plan-design-review`
4. `gstack-plan-eng-review`
5. implementation + `gstack-browse`
6. `gstack-review`
7. `gstack-qa`
8. `gstack-benchmark`
9. `gstack-ship`

## Execution scope for this cycle

- 홈, 검색, 상세, 가이드, 면책, 문의 페이지의 문구와 상태 정리
- 공통 라벨과 카드 문구 정리
- 문서와 코드의 공급처/데이터 모드 설명 일치
- QA와 성능 점검 후 push

## Non-goals for this cycle

- 신규 OTA 파트너 API 추가
- 결제/예약 기능 추가
- 대규모 디자인 리브랜딩
- 광범위한 크롤링 도입
