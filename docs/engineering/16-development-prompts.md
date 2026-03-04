# Ytravel 개발용 프롬프트

## 1. 목적

이 문서는 Ytravel을 구현할 때 AI 코딩 도구에 바로 입력할 수 있는 개발용 프롬프트를 정리한 문서다.

목표

- 기획 문서와 디자인 시스템을 구현 작업으로 정확히 연결
- 한국어 서비스 특성과 브랜드 톤을 유지
- MVP를 단계적으로 안정적으로 구현

## 2. 사용 원칙

- 프롬프트는 가능한 한 한 번에 하나의 목표만 수행하게 쓴다.
- 구현 전에 반드시 기존 파일 구조를 먼저 읽게 한다.
- 문서 기준을 우선시하도록 명시한다.
- 한국어 UI, 절제된 고급감, BRG 특화 서비스라는 정체성을 반복해서 고정한다.

## 3. 참조 문서 목록

프롬프트에 함께 전달하거나 참조 대상으로 언급할 문서

- `docs/product/01-prd.md`
- `docs/product/02-mvp-spec.md`
- `docs/design/05-design-guide.md`
- `docs/design/06-design-system.md`
- `docs/engineering/09-data-schema.md`
- `docs/engineering/10-api-spec.md`
- `docs/design/12-component-spec.md`
- `docs/design/13-copywriting-guide.md`
- `docs/design/14-brand-guidelines.md`
- `docs/design/15-page-wireframes.md`

## 4. 통합 마스터 프롬프트

아래 프롬프트는 Ytravel MVP를 처음부터 구현할 때 사용하는 기준 프롬프트다.

```text
당신은 숙련된 시니어 프론트엔드/풀스택 엔지니어입니다.
현재 프로젝트는 Ytravel이며, 호텔 공식 홈페이지와 OTA 가격을 비교해 BRG(Best Rate Guarantee) 가능성을 탐색하는 한국 서비스입니다.

구현 전에 아래 문서를 먼저 읽고, 그 기준을 엄격히 따르세요.
- docs/product/01-prd.md
- docs/product/02-mvp-spec.md
- docs/design/05-design-guide.md
- docs/design/06-design-system.md
- docs/engineering/09-data-schema.md
- docs/engineering/10-api-spec.md
- docs/design/12-component-spec.md
- docs/design/13-copywriting-guide.md
- docs/design/14-brand-guidelines.md
- docs/design/15-page-wireframes.md

작업 원칙:
1. 먼저 현재 파일 구조와 기존 코드를 읽고, 가정하지 말고 실제 구조를 파악하세요.
2. 한국어 서비스에 맞는 자연스럽고 전문적인 UI 문구를 사용하세요.
3. 디자인은 가벼운 OTA 스타일이 아니라 절제된 프리미엄 톤으로 구현하세요.
4. 단순 최저가 서비스가 아니라 BRG 특화 비교 서비스라는 점을 유지하세요.
5. 가격 숫자보다 조건 비교를 함께 보여주는 구조를 우선하세요.
6. 공식 홈페이지, OTA 최저가, 예상 BRG가의 정보 위계를 명확히 하세요.
7. 기존 문서와 충돌하는 구현은 하지 마세요.
8. 먼저 필요한 파일과 폴더 구조를 정리한 뒤 구현하세요.
9. 구현 후에는 변경 파일, 핵심 결정, 남은 리스크를 간단히 정리하세요.

기술 방향:
- Next.js
- TypeScript
- Tailwind CSS
- 컴포넌트 중심 구조
- 디자인 토큰 기반 스타일
- mock 데이터 기반 MVP부터 구현

구현 목표:
- 홈 페이지
- 검색 결과 페이지
- 호텔 상세 페이지
- BRG 안내 페이지
- 기본 API 또는 mock 데이터 연결
- 디자인 시스템 토큰 반영

중요:
- 모든 사용자 노출 텍스트는 한국어로 작성하세요.
- 과장 광고 문구, 싸구려 할인 문구, 지나친 여행 감성 문구는 금지합니다.
- 브랜드 톤은 전문적이고 고급스럽고 차분해야 합니다.
- 모바일과 데스크탑 모두 고려하세요.

이제 먼저 현재 코드베이스를 분석하고, 구현 계획을 짧게 정리한 뒤 작업을 시작하세요.
```

## 5. 프로젝트 초기 세팅 프롬프트

```text
Ytravel 프로젝트의 초기 프론트엔드 구조를 세팅하세요.

먼저 아래 문서를 읽고 반영하세요.
- docs/design/05-design-guide.md
- docs/design/06-design-system.md
- docs/design/12-component-spec.md
- docs/design/14-brand-guidelines.md

작업 범위:
- Next.js + TypeScript 프로젝트 구조 세팅
- app router 기준 폴더 구조 설계
- 공통 레이아웃 구성
- 글로벌 스타일 파일 생성
- 디자인 토큰 CSS 변수 작성
- 기본 폰트 전략 반영
- Header, Footer, Container 같은 공통 레이아웃 컴포넌트 생성

요구사항:
- 한국어 서비스에 맞는 정보 밀도와 여백 사용
- 과한 애니메이션이나 상업적 톤 금지
- 절제된 블루/그레이 계열의 프리미엄 톤 유지
- 추후 검색/비교 페이지를 붙이기 쉬운 구조로 만들 것

산출물:
- 폴더 구조
- 공통 레이아웃
- 디자인 토큰
- 기본 컴포넌트 스켈레톤

작업 전에 현재 구조를 읽고, 작업 후 변경 내용을 요약하세요.
```

## 6. 홈 화면 구현 프롬프트

```text
Ytravel 홈 화면을 구현하세요.

반드시 먼저 아래 문서를 읽으세요.
- docs/product/01-prd.md
- docs/design/05-design-guide.md
- docs/design/13-copywriting-guide.md
- docs/design/14-brand-guidelines.md
- docs/design/15-page-wireframes.md

구현 대상:
- 서비스 소개형 홈 화면
- 히어로 섹션
- 검색 시작 폼
- BRG 설명 섹션
- Ytravel 차별점 섹션
- 비교 기준 안내 섹션

디자인 요구사항:
- 첫 화면에서 검색을 시작할 수 있어야 함
- 고급스럽고 차분한 느낌
- 여행사 광고 페이지처럼 보이면 안 됨
- 텍스트는 한국어로, 짧고 단정하게 작성
- 브랜드 컬러와 타이포 가이드를 준수

기능 요구사항:
- 호텔명, 체크인, 체크아웃, 인원, 객실 수 입력 UI 제공
- 검색 버튼 클릭 시 검색 페이지로 이동 가능한 구조
- 아직 백엔드가 없어도 동작 가능한 방식으로 구현

구현 후:
- 섹션 구성과 UI 의도를 짧게 설명
- 반응형 고려사항을 함께 정리
```

## 7. 검색 결과 페이지 구현 프롬프트

```text
Ytravel 검색 결과 페이지를 구현하세요.

먼저 아래 문서를 읽고 그 기준을 따르세요.
- docs/product/02-mvp-spec.md
- docs/design/06-design-system.md
- docs/engineering/09-data-schema.md
- docs/design/12-component-spec.md
- docs/design/13-copywriting-guide.md
- docs/design/15-page-wireframes.md

페이지 목표:
- 사용자가 한눈에 공식 홈페이지 가격, OTA 최저가, 예상 BRG가를 파악할 수 있게 만들 것

반드시 포함할 것:
- 검색 요약 바
- BRG 요약 카드
- 공급처별 가격 비교 표 또는 카드
- 조건 비교 태그
- 일부 실패 상태, 결과 없음 상태 UI

데이터 조건:
- 우선 mock 데이터로 구현
- 공식 홈페이지, Trip.com, Agoda, Booking.com 4개 공급처 예시 반영
- 한국 원화 표기 반영

중요한 UX 원칙:
- 가격만 강조하지 말고 조건 비교를 함께 드러낼 것
- 한국어 라벨은 짧고 전문적으로 유지할 것
- 과장 표현 금지

구현 후:
- 어떤 컴포넌트를 만들었는지
- 어떤 데이터 구조를 사용했는지
- 추후 API 연결 포인트가 어디인지 정리하세요.
```

## 8. 호텔 상세 페이지 구현 프롬프트

```text
Ytravel 호텔 상세 페이지를 구현하세요.

아래 문서를 먼저 읽으세요.
- docs/product/02-mvp-spec.md
- docs/engineering/09-data-schema.md
- docs/design/12-component-spec.md
- docs/design/15-page-wireframes.md

구현 목표:
- BRG 판단 근거를 상세하게 확인할 수 있는 페이지

반드시 포함할 요소:
- 호텔 헤더
- BRG 요약
- 공급처별 상세 가격 카드
- 객실 조건 비교 표
- BRG 진행 전 확인 패널
- 외부 링크 버튼

표현 원칙:
- 설명보다 비교 근거가 먼저 보여야 함
- 차이 나는 조건은 분명히 표시
- 사용자에게 판단 보조를 제공하는 톤 유지

구현 후:
- 비교 로직상 어떤 필드가 핵심인지
- 화면에서 어떤 위계로 보여주었는지
- 모바일에서 어떻게 축약했는지 정리하세요.
```

## 9. 디자인 시스템 반영 프롬프트

```text
Ytravel 디자인 시스템을 코드로 반영하세요.

먼저 아래 문서를 읽으세요.
- docs/design/05-design-guide.md
- docs/design/06-design-system.md
- docs/design/12-component-spec.md

작업 목표:
- 디자인 토큰을 코드로 정의
- 버튼, 배지, 카드, 입력창, 테이블 등 공통 UI 컴포넌트 구성
- 페이지들이 동일한 규칙을 사용하도록 기반 마련

반드시 포함할 항목:
- color tokens
- spacing tokens
- radius tokens
- shadow tokens
- typography tokens
- semantic status styles

컴포넌트 우선순위:
- Button
- StatusPill
- ConditionBadge
- Card
- SearchBar 관련 필드
- Table 스타일

중요:
- 디자인 시스템은 장식용이 아니라 운영 기준이어야 함
- 클래스 중복을 줄이고 재사용 가능한 구조를 만들 것
- 브랜드의 절제된 프리미엄 톤을 유지할 것

작업 후:
- 토큰 정의 위치
- 공통 컴포넌트 구조
- 재사용 규칙을 설명하세요.
```

## 10. 데이터 모델 및 mock API 구현 프롬프트

```text
Ytravel MVP용 데이터 모델과 mock API를 구현하세요.

반드시 먼저 아래 문서를 읽으세요.
- docs/engineering/09-data-schema.md
- docs/engineering/10-api-spec.md
- docs/product/02-mvp-spec.md

작업 목표:
- TypeScript 타입 정의
- mock 호텔 데이터
- mock 공급처 데이터
- mock rate offer 데이터
- 검색 결과를 반환하는 API 또는 mock service 구현

반드시 포함할 항목:
- SearchQuery
- Hotel
- Provider
- RateCondition
- RateOffer
- BrgEvaluation
- SearchResult

기능 요구사항:
- 공식 홈페이지와 OTA 가격 데이터를 공통 타입으로 정규화
- BRG 평가 결과를 함께 반환
- 일부 공급처 실패 상태도 처리 가능하게 설계

구현 후:
- 타입 구조
- mock 데이터 위치
- 추후 실제 공급처 어댑터로 확장 가능한 포인트를 설명하세요.
```

## 11. BRG 평가 엔진 구현 프롬프트

```text
Ytravel의 BRG 평가 엔진을 구현하세요.

아래 문서를 먼저 읽으세요.
- docs/product/02-mvp-spec.md
- docs/engineering/09-data-schema.md
- docs/operations/11-operations-legal.md

구현 목표:
- 공식 홈페이지 가격과 OTA 가격을 비교해 BRG 가능성을 평가
- 동일 조건 여부와 신뢰도를 함께 계산

입력:
- 공식 홈페이지 offer 1개 이상
- OTA offers 여러 개

출력:
- officialPrice
- lowestOtaPrice
- priceGap
- priceGapPercent
- eligibility
- confidence
- estimatedBrgPrice
- matchedFields
- mismatchedFields
- reasons

기본 규칙:
- 공식 홈페이지보다 더 낮은 OTA가 없으면 not_eligible
- 조건이 충분히 일치하면 likely
- 일부 조건이 애매하면 review
- 데이터가 부족하면 insufficient_data

중요:
- BRG 성공을 보장하는 로직처럼 구현하지 말 것
- 추정 결과라는 점이 드러나는 구조일 것
- 계산식은 추후 브랜드별 정책으로 확장 가능하게 작성할 것

구현 후:
- 평가 규칙
- 예외 처리
- 확장 포인트를 설명하세요.
```

## 12. 한국어 UI 품질 개선 프롬프트

```text
현재 Ytravel UI의 모든 한국어 문구를 점검하고 개선하세요.

반드시 아래 문서를 먼저 읽으세요.
- docs/design/13-copywriting-guide.md
- docs/design/14-brand-guidelines.md
- docs/operations/11-operations-legal.md

작업 목표:
- 어색한 번역투 제거
- 과장된 표현 제거
- 브랜드 톤에 맞는 전문적이고 고급스러운 한국어로 통일

점검 대상:
- 페이지 제목
- 버튼 텍스트
- 상태 배지
- 안내 문구
- 오류 문구
- 빈 상태 문구
- 면책 문구

기준:
- 차분하고 단정할 것
- 사용자 판단을 돕는 문장일 것
- 너무 길지 않을 것
- 법적 오해 가능성을 낮출 것

작업 후:
- 수정 전/후 핵심 차이
- 대표적으로 바꾼 문구 예시를 정리하세요.
```

## 13. 반응형 점검 프롬프트

```text
Ytravel 주요 페이지의 반응형 UI를 점검하고 수정하세요.

먼저 아래 문서를 읽으세요.
- docs/design/06-design-system.md
- docs/design/12-component-spec.md
- docs/design/15-page-wireframes.md

점검 대상:
- 홈
- 검색 결과
- 호텔 상세

점검 기준:
- 모바일에서 가격, 상태, 버튼이 한눈에 읽히는가
- 표 구조가 무너지지 않는가
- 한국어 텍스트 줄바꿈이 부자연스럽지 않은가
- CTA가 과도하게 커지거나 밀리지 않는가

작업 후:
- 수정한 반응형 이슈
- 모바일에서 카드형으로 바뀐 요소
- 남은 제약 사항을 정리하세요.
```

## 14. 품질 점검 프롬프트

```text
Ytravel MVP 구현 결과를 리뷰하세요.

먼저 아래 문서를 읽고, 그 기준으로 검토하세요.
- docs/product/01-prd.md
- docs/product/02-mvp-spec.md
- docs/design/06-design-system.md
- docs/design/13-copywriting-guide.md
- docs/design/15-page-wireframes.md

리뷰 우선순위:
1. BRG 특화 서비스라는 정체성이 화면에 드러나는가
2. 공식 홈페이지 / OTA 최저가 / 예상 BRG가 위계가 분명한가
3. 조건 비교가 가격 비교에 묻히지 않는가
4. 한국어 문구가 전문적이고 자연스러운가
5. 모바일과 데스크탑 모두 읽기 좋은가

응답 방식:
- 문제점 위주로 정리
- 심각도 순서로 작성
- 파일명과 개선 방향을 함께 제시
```

## 15. 실전 사용 추천 순서

Ytravel MVP를 구현할 때는 아래 순서를 권장한다.

1. 프로젝트 초기 세팅 프롬프트
2. 디자인 시스템 반영 프롬프트
3. 데이터 모델 및 mock API 구현 프롬프트
4. 홈 화면 구현 프롬프트
5. 검색 결과 페이지 구현 프롬프트
6. 호텔 상세 페이지 구현 프롬프트
7. BRG 평가 엔진 구현 프롬프트
8. 한국어 UI 품질 개선 프롬프트
9. 반응형 점검 프롬프트
10. 품질 점검 프롬프트

## 16. 한 줄 요약

Ytravel 개발용 프롬프트는 `기획 문서 준수`, `한국어 전문성`, `절제된 프리미엄 톤`, `BRG 특화 비교 구조`를 구현에 강하게 고정하는 데 목적이 있다.
