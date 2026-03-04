# Ytravel 디자인 시스템

## 1. 목적

Ytravel 디자인 시스템은 제품 전반의 UI 일관성을 유지하고, 검색 중심 서비스에서 가장 중요한 `가독성`, `비교 효율`, `신뢰감`을 안정적으로 구현하기 위한 기준 문서다.

이 문서는 아래를 정의한다.

- 디자인 토큰
- 레이아웃 규칙
- 타이포 체계
- 색상 시스템
- 컴포넌트 규칙
- 상태 표현 방식
- 반응형 원칙

## 2. 디자인 시스템 원칙

### 2.1 Compare First

UI는 장식보다 비교 효율을 우선한다.

- 가격 비교가 첫 시선에 들어와야 한다.
- 조건 차이는 숨기지 않고 명확히 보여준다.
- CTA보다 정보 구조가 먼저 읽혀야 한다.

### 2.2 Calm Precision

시각적 어조는 차분해야 하지만 흐리면 안 된다.

- 컬러는 절제해서 쓴다.
- 강한 포인트는 핵심 액션과 BRG 상태에만 사용한다.
- 정보 밀도가 높아도 정돈된 여백을 유지한다.

### 2.3 Trust Through Consistency

신뢰는 반복되는 규칙에서 나온다.

- 같은 정보는 같은 방식으로 보여준다.
- 상태 색상은 언제나 동일한 의미를 가진다.
- 공식가, OTA가, 예상 BRG가는 모든 화면에서 같은 위계로 표시한다.

## 3. Foundations

## 3.1 Color Tokens

### Brand

- `--wt-color-brand-900`: `#050606`
- `--wt-color-brand-700`: `#04345A`
- `--wt-color-brand-500`: `#06588C`
- `--wt-color-brand-300`: `#626979`
- `--wt-color-brand-100`: `#C8C6C6`

### Neutral

- `--wt-color-bg`: `#F5F3F0`
- `--wt-color-surface`: `#E7E4DF`
- `--wt-color-panel`: `#FFFFFF`
- `--wt-color-text-primary`: `#1B1F27`
- `--wt-color-text-secondary`: `#626979`
- `--wt-color-border`: `#D8D4CF`

### Semantic

- `--wt-color-success-bg`: `#E7F3EC`
- `--wt-color-success-text`: `#2D6A4F`
- `--wt-color-warning-bg`: `#F6EEDC`
- `--wt-color-warning-text`: `#8B6508`
- `--wt-color-danger-bg`: `#F3E4E4`
- `--wt-color-danger-text`: `#A63A3A`
- `--wt-color-info-bg`: `#EAF1F6`
- `--wt-color-info-text`: `#04345A`

## 3.2 Typography Tokens

### Font Families

- Display/Heading: `Cormorant Garamond`, `Playfair Display`, serif
- Body/UI: `Pretendard`, `SUIT`, sans-serif
- Numeric/Tabular: `Inter`, `IBM Plex Sans`, sans-serif with tabular numerals enabled

### Type Scale

- `--wt-text-display-xl`: 64px / 1.05 / 600
- `--wt-text-display-lg`: 48px / 1.1 / 600
- `--wt-text-h1`: 36px / 1.2 / 600
- `--wt-text-h2`: 28px / 1.25 / 600
- `--wt-text-h3`: 22px / 1.3 / 600
- `--wt-text-body-lg`: 18px / 1.6 / 400
- `--wt-text-body-md`: 16px / 1.6 / 400
- `--wt-text-body-sm`: 14px / 1.5 / 400
- `--wt-text-caption`: 12px / 1.4 / 500

### Typography Rules

- 히어로 타이틀만 세리프 사용
- 본문, 표, 입력값, 상태값은 산세리프 사용
- 가격 숫자는 탭 정렬이 가능한 숫자 스타일 사용
- 긴 설명문보다 짧은 정보 블록 중심으로 작성

## 3.3 Spacing Tokens

- `--wt-space-1`: 4px
- `--wt-space-2`: 8px
- `--wt-space-3`: 12px
- `--wt-space-4`: 16px
- `--wt-space-5`: 20px
- `--wt-space-6`: 24px
- `--wt-space-8`: 32px
- `--wt-space-10`: 40px
- `--wt-space-12`: 48px
- `--wt-space-16`: 64px
- `--wt-space-20`: 80px

규칙

- 카드 내부 패딩은 최소 20px
- 주요 섹션 간격은 최소 64px
- 데이터 표 셀 간격은 12px 또는 16px 기준

## 3.4 Radius Tokens

- `--wt-radius-sm`: 10px
- `--wt-radius-md`: 16px
- `--wt-radius-lg`: 24px
- `--wt-radius-xl`: 32px
- `--wt-radius-pill`: 999px

## 3.5 Shadow Tokens

- `--wt-shadow-soft`: `0 10px 30px rgba(5, 6, 6, 0.08)`
- `--wt-shadow-card`: `0 6px 18px rgba(5, 6, 6, 0.06)`
- `--wt-shadow-focus`: `0 0 0 4px rgba(6, 88, 140, 0.18)`

## 4. Layout System

## 4.1 Container Width

- `container-sm`: 720px
- `container-md`: 960px
- `container-lg`: 1200px
- `container-xl`: 1320px

권장 사용

- 홈 히어로: `1200px`
- 검색 결과: `1320px`
- 상세 설명 페이지: `960px`

## 4.2 Grid Rules

### Desktop

- 12-column grid
- gutter 24px
- section margin 80px

### Tablet

- 8-column grid
- gutter 20px

### Mobile

- 4-column grid
- gutter 16px
- side padding 20px

## 4.3 Section Structure

모든 페이지는 아래 순서를 기본으로 삼는다.

1. Intro or Search Context
2. Summary
3. Primary Comparison
4. Supporting Details
5. Secondary Actions

## 5. Interaction States

## 5.1 Button States

### Primary Button

- Default: `#04345A` 배경, `#F5F3F0` 텍스트
- Hover: `#06588C`
- Active: `#032844`
- Disabled: `#C8C6C6`

### Secondary Button

- Default: 투명 배경, `#04345A` 텍스트, `#04345A` 보더
- Hover: `#EAF1F6`
- Disabled: `#D8D4CF`

## 5.2 Input States

- Default: 연한 배경 + 얇은 보더
- Hover: 보더 명도 소폭 상승
- Focus: `--wt-shadow-focus`
- Error: danger text/border 사용
- Disabled: muted 배경과 muted 텍스트

## 5.3 Card States

- Default: white panel
- Hover: shadow-card 강화
- Selected: info border 또는 info background
- Warning: warning top bar 또는 배지 사용

## 6. Semantic Status System

Ytravel은 상태 표현을 아래 4단계로 통일한다.

### 6.1 Positive

의미

- BRG 가능성 높음
- 조건이 거의 일치함

표현

- 초록 계열 배경
- 초록 텍스트
- 체크 아이콘 가능

### 6.2 Caution

의미

- 일부 조건 검토 필요
- 자동 판단이 애매함

표현

- 옐로우/골드 계열 배경
- 경고 아이콘 가능

### 6.3 Negative

의미

- 동일 조건이 아님
- 공식가보다 저렴한 OTA가 없음

표현

- 연한 레드 배경
- 짙은 레드 텍스트

### 6.4 Informational

의미

- 공식가 기준
- 세금 포함 여부
- 환불 정책 정보

표현

- 블루/그레이 계열

## 7. Component Inventory

## 7.1 Core Components

- `Logo`
- `Header`
- `Footer`
- `SectionHeading`
- `SearchBar`
- `DatePickerField`
- `GuestSelector`
- `Button`
- `IconButton`
- `LinkButton`

## 7.2 Data Comparison Components

- `BrgSummaryCard`
- `ProviderRateCard`
- `ProviderRateTable`
- `RateRow`
- `ConditionBadge`
- `StatusPill`
- `PriceDelta`
- `MatchConfidencePill`

## 7.3 Content Components

- `InfoPanel`
- `FeatureCard`
- `GuideStep`
- `EmptyState`
- `ErrorState`
- `Tooltip`

## 8. Component Specifications

## 8.1 Button

### Variants

- `primary`
- `secondary`
- `ghost`
- `danger`

### Sizes

- `sm`: 36px height
- `md`: 44px height
- `lg`: 52px height

### Rules

- 한 화면의 주 CTA는 하나만 `primary`
- `danger`는 삭제/위험 동작에만 사용
- 아이콘만 있는 버튼은 정사각형 유지

## 8.2 SearchBar

구성

- 호텔명 입력
- 체크인
- 체크아웃
- 인원/객실
- 검색 버튼

규칙

- 데스크탑에서는 한 줄 정렬
- 모바일에서는 세로 스택
- 가장 중요한 입력은 호텔명 필드

## 8.3 BrgSummaryCard

필수 정보

- 호텔명
- 공식가
- 최저 OTA가
- 예상 BRG가
- BRG 상태

규칙

- 숫자 강조 우선
- 상태 배지는 항상 노출
- 가격 단위와 통화는 축약하지 않음

## 8.4 ProviderRateCard

필수 정보

- 공급처명
- 가격
- 무료 취소 여부
- 조식 포함 여부
- 세금 포함 여부
- 보기 버튼

규칙

- 카드 상단에 공급처명과 가격 배치
- 하단에 조건 태그 배치
- 최저가인 경우 별도 배지 부착

## 8.5 ConditionBadge

Variants

- `neutral`
- `success`
- `warning`
- `danger`
- `info`

텍스트 예시

- 무료 취소
- 조식 포함
- 세금 포함
- 선결제
- 객실명 유사

## 8.6 StatusPill

용도

- BRG 상태
- 수집 상태
- 비교 가능 여부

규칙

- 라벨은 2~8자 수준으로 짧게
- 색상만이 아니라 명시적 텍스트 포함

## 9. Data Display Rules

## 9.1 Price

- 통화 심볼과 숫자를 분리하지 않는다.
- 천 단위 구분을 사용한다.
- 소수점은 필요한 경우만 노출한다.
- 가격 숫자는 주변 텍스트보다 1단계 이상 크게 보인다.

예시

- `₩320,000`
- `$248`

## 9.2 Table

- 비교표의 첫 열은 공급처
- 두 번째 열은 총액
- 그다음 열은 취소, 조식, 세금, 결제 조건
- 마지막 열은 액션

## 9.3 Tags and Metadata

- 태그는 4개 이상 한 줄에 몰아넣지 않는다.
- 태그가 많으면 2줄 또는 상세 영역으로 분리한다.
- 메타 정보는 본문보다 밝고 작게 처리한다.

## 10. Content Design Rules

## 10.1 Tone

- 짧고 단정하게 쓴다.
- 단언보다 설명형 문장을 사용한다.
- 법적 오해를 일으킬 수 있는 확정형 표현을 피한다.

좋은 예시

- `현재 수집 기준 최저가입니다`
- `동일 조건 여부를 확인하세요`
- `BRG 가능성이 높은 요금입니다`

피해야 할 예시

- `무조건 보장`
- `100% 최저가`
- `반드시 승인`

## 10.2 Labeling Rules

- 버튼은 동사형 사용
- 배지는 상태형 사용
- 표 헤더는 명사형 사용

예시

- 버튼: `가격 보기`, `조건 비교`, `다시 검색`
- 배지: `최저가`, `검토 필요`, `조건 불일치`
- 헤더: `총액`, `조식`, `취소`, `세금`

## 11. Responsive Design Rules

## 11.1 Mobile

- 카드 중심 구조
- 검색 입력은 세로 배치
- BRG 요약 카드 최우선
- 비교표는 카드 스택으로 변환

## 11.2 Tablet

- 검색 폼은 2행까지 허용
- 요약 카드와 비교 리스트 병행 가능

## 11.3 Desktop

- 비교표 중심
- 요약 카드와 상세 비교를 한 화면 내에서 빠르게 이동 가능하게 구성

## 12. Accessibility Rules

- 색상만으로 의미 전달 금지
- 키보드 포커스 스타일 필수
- 인터랙션 요소는 최소 44px 이상
- 상태 라벨은 스크린리더에서 이해 가능해야 함
- 테이블은 헤더 구조를 명확히 유지

## 13. Motion Rules

- enter transition: 200ms~320ms
- hover transition: 120ms~180ms
- easing: ease-out 중심
- 카운트업, 스태거는 핵심 화면에서만 제한적 사용

금지

- 과도한 bounce
- 자동 반복 애니메이션
- 정보 판독을 방해하는 움직임

## 14. CSS Variable Draft

```css
:root {
  --wt-color-brand-900: #050606;
  --wt-color-brand-700: #04345a;
  --wt-color-brand-500: #06588c;
  --wt-color-brand-300: #626979;
  --wt-color-brand-100: #c8c6c6;

  --wt-color-bg: #f5f3f0;
  --wt-color-surface: #e7e4df;
  --wt-color-panel: #ffffff;
  --wt-color-text-primary: #1b1f27;
  --wt-color-text-secondary: #626979;
  --wt-color-border: #d8d4cf;

  --wt-color-success-bg: #e7f3ec;
  --wt-color-success-text: #2d6a4f;
  --wt-color-warning-bg: #f6eedc;
  --wt-color-warning-text: #8b6508;
  --wt-color-danger-bg: #f3e4e4;
  --wt-color-danger-text: #a63a3a;
  --wt-color-info-bg: #eaf1f6;
  --wt-color-info-text: #04345a;

  --wt-space-1: 4px;
  --wt-space-2: 8px;
  --wt-space-3: 12px;
  --wt-space-4: 16px;
  --wt-space-5: 20px;
  --wt-space-6: 24px;
  --wt-space-8: 32px;
  --wt-space-10: 40px;
  --wt-space-12: 48px;
  --wt-space-16: 64px;

  --wt-radius-sm: 10px;
  --wt-radius-md: 16px;
  --wt-radius-lg: 24px;
  --wt-radius-xl: 32px;
  --wt-radius-pill: 999px;

  --wt-shadow-soft: 0 10px 30px rgba(5, 6, 6, 0.08);
  --wt-shadow-card: 0 6px 18px rgba(5, 6, 6, 0.06);
  --wt-shadow-focus: 0 0 0 4px rgba(6, 88, 140, 0.18);
}
```

## 15. 문서 운영 원칙

- 새로운 컴포넌트는 기존 토큰 조합으로 먼저 해결한다.
- 새 색상 추가보다 기존 의미 체계를 재사용한다.
- 예외 스타일은 문서에 추가하고 재사용 기준을 만든다.
- 구현 전에 이름과 책임이 먼저 합의되어야 한다.

## 16. 한 줄 요약

Ytravel 디자인 시스템은 `절제된 프리미엄`, `비교 중심 정보 설계`, `BRG 판단의 명확성`을 위한 운영 규칙 집합이다.
