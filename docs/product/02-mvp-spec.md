# Ytravel MVP 기능명세서

## 1. 목표

MVP는 사용자가 호텔 검색 한 번으로 공홈과 OTA 가격을 비교하고, BRG 후보를 식별할 수 있게 만드는 데 집중한다.

## 2. 기능 목록

### 2.1 검색

- 입력값
  - 호텔명
  - 체크인 날짜
  - 체크아웃 날짜
  - 성인 수
  - 객실 수
- 검증 규칙
  - 호텔명 필수
  - 체크인/체크아웃 필수
  - 체크아웃은 체크인 이후여야 함
  - 최소 1명, 최소 1객실

### 2.2 검색 결과

- 호텔 기본 정보 표시
  - 호텔명
  - 도시/국가
  - 공식 사이트 링크
- 가격 비교 결과 표시
  - 공식 홈페이지 가격
  - OTA별 가격
  - 통화
  - 세금 포함 여부
  - 취소 가능 여부
  - 조식 포함 여부
  - 객실명
- 최저가 강조 표시
- 공급처별 딥링크 제공

### 2.3 BRG 평가

- 공식가보다 더 낮은 OTA가 있는지 확인
- 동일 조건 일치 수준 계산
  - 완전 일치
  - 유사 조건
  - 비교 불가
- BRG 예상 결과 계산
  - 기본 계산 정책: `최저 OTA 가격에서 25% 추가 할인`
  - 추후 확장: 브랜드별 정책 룰 지원
- 상태 표시
  - BRG 가능성 높음
  - 검토 필요
  - BRG 어려움

### 2.4 상세 비교

- 객실 조건 비교 테이블
- 공홈/OTA별 상세 정책 비교
- 차이 항목 하이라이트
  - 객실 타입
  - 취소 정책
  - 조식 포함 여부
  - 선결제/현장결제
  - 세금 포함 여부

## 3. 사용자 플로우

1. 사용자가 검색 폼에 호텔명과 날짜를 입력한다.
2. 시스템이 가격 수집 요청을 생성한다.
3. 결과 페이지에서 공홈과 OTA 가격을 정렬해 보여준다.
4. 시스템이 최저가와 BRG 가능성을 계산한다.
5. 사용자가 공급처 링크 또는 상세 비교로 이동한다.

## 4. 비기능 요구사항

- 첫 화면은 직관적으로 검색을 시작할 수 있어야 한다.
- 결과 화면은 데스크탑에서 한눈에 비교 가능해야 한다.
- 모바일에서도 카드 단위로 읽을 수 있어야 한다.
- 결과 계산 로직은 공급처가 늘어나도 확장 가능해야 한다.

## 5. 데이터 엔티티

### SearchQuery

- hotelName
- checkIn
- checkOut
- adults
- rooms

### Hotel

- id
- name
- city
- country
- officialSiteUrl

### Provider

- id
- name
- type

### RateOffer

- providerId
- hotelId
- roomName
- totalPrice
- currency
- taxIncluded
- freeCancellation
- breakfastIncluded
- paymentType
- deeplink

### BrgEvaluation

- officialPrice
- lowestOtaPrice
- priceGap
- brgEligible
- confidence
- estimatedBrgPrice
- reasons

## 6. MVP 성공 기준

- 최소 1개 호텔 검색 흐름이 끝까지 동작
- 공식가와 OTA가 같은 포맷으로 렌더링
- BRG 상태값이 사용자에게 이해 가능
- 공급처 3개 이상 비교 가능

## 7. 제외 항목

- 사용자 즐겨찾기
- 알림 기능
- 결제 연동
- 자동 클레임 제출
- 대시보드/관리자 기능
