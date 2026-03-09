# Ytravel Engineering Plan: User-Booked-Price MVP

## 1. Purpose

This document turns the approved product direction into an actionable implementation plan.

Primary shift:

- Old assumption: `official price vs OTA price`
- New assumption: `user booked price vs OTA candidate price`

This plan is written for fast implementation and vibe-coding execution.

## 2. Target MVP Outcome

A user can:

1. enter reservation details including their booked price
2. search for cheaper OTA candidates
3. see the cheapest matched candidate
4. understand whether the match is exact, close, or reference-only
5. continue via direct OTA links or fallback metasearch links

## 3. Current Codebase Assessment

The current codebase already contains reusable foundations:

- home page and hero search flow
- search result page
- provider comparison UI
- condition comparison UI
- BRG summary card
- shared search schema and result schema

The main changes are not the page skeleton. The main changes are:

- search input model
- core comparison baseline
- result copy and business logic
- provider strategy
- mock data and future adapter boundaries

## 4. What Can Be Reused

### Reusable UI

- `app/page.tsx`
- `components/home/HeroSection.tsx`
- `components/home/SearchForm.tsx`
- `app/search/page.tsx`
- `components/search/ProviderRateTable.tsx`
- `components/search/ProviderRateCard.tsx`
- `components/search/ConditionSummary.tsx`
- `components/search/BrgSummaryCard.tsx`

### Reusable Logic

- `lib/search/params.ts`
- `lib/api/validate-search.ts`
- `lib/search/format.ts`
- `lib/services/search-service.ts`
- `lib/types/schema.ts`

### Reusable General Concept

- normalized provider result model
- provider fetch statuses
- field-level condition comparison
- grouped offers by room type

## 5. What Must Change

### Product-Level Change

Replace:

- "official vs OTA"

With:

- "my booking vs OTA candidates"

### Input-Level Change

Add:

- `userBookedPrice`
- `roomName`
- `breakfastIncluded` or board type
- `cancellationType`
- `taxIncluded`

Possibly later:

- `bookingSite`
- `bedType`
- `paymentType`

### Logic-Level Change

Current evaluation logic centers on:

- `officialPrice`
- `lowestOtaPrice`
- BRG-style estimated price

New evaluation logic should center on:

- `userBookedPrice`
- `bestMatchedCandidatePrice`
- `priceGap`
- `priceGapPercent`
- `confidence`
- `matchType`

### Result-Level Change

The result page should lead with:

- "You booked at X"
- "Best current candidate is Y"
- "Difference is Z"

Not:

- "Official site is X"
- "OTA is Y"

## 6. Proposed Data Model Changes

## 6.1 SearchQuery

Add fields:

- `roomName: string`
- `userBookedPrice: number`
- `bookedBoardType: BoardType`
- `bookedCancellationType: CancellationType`
- `bookedTaxIncluded: boolean | null`

Optional:

- `bookedPaymentType: PaymentType`
- `bookedProviderName: string | null`

## 6.2 New Comparison Types

Recommended additions:

```ts
export type MatchType = "exact" | "close" | "reference_only";

export interface UserBookingInput {
  roomName: string;
  userBookedPrice: number;
  boardType: BoardType;
  cancellationType: CancellationType;
  taxIncluded: boolean | null;
  paymentType: PaymentType;
}

export interface CandidateComparison {
  offerId: string;
  providerId: string;
  candidatePrice: number;
  priceGap: number;
  priceGapPercent: number;
  matchType: MatchType;
  confidence: BrgConfidence;
  matchedFields: string[];
  mismatchedFields: string[];
  reasons: string[];
}
```

## 6.3 SearchResult

Recommended shape:

- `query`
- `hotel`
- `providers`
- `offers`
- `fetchStatuses`
- `userBooking`
- `bestComparison`
- `comparisons`
- `generatedAt`
- `fallbackLinks`

## 7. Proposed Provider Strategy

## 7.1 Automated First-Wave Providers

- `trip-com`
- `traveloka`
- `vio`

## 7.2 Link-Only Fallback Providers

- `kayak`
- `momondo`
- `wego`
- `trivago`

## 7.3 Provider Category Model

Recommended:

```ts
export type ProviderCapability = "automated" | "link_only";
```

This allows UI to distinguish:

- compared results
- manual follow-up sites

## 8. UX and UI Changes

## 8.1 Home Search Form

Current form is a generic hotel search.

Change it into a reservation input form with:

- hotel name
- check-in/check-out
- adults
- rooms
- room name
- booked price
- currency
- breakfast
- cancellation type
- tax included

### UX rule

Keep the first version compact:

- required fields visible by default
- advanced condition fields collapsible if needed

## 8.2 Search Results Page

Top section should become:

- booking summary
- best cheaper candidate summary
- confidence label
- key explanation

Middle section:

- provider comparison cards/table

Bottom section:

- fallback link-out sites
- disclaimers

## 8.3 Copy Direction

Prefer:

- "Cheaper candidate found"
- "Close match"
- "Reference only"
- "Manual check recommended"

Avoid:

- "Guaranteed cheapest"
- "Guaranteed BRG eligible"

## 9. API Changes

## 9.1 `POST /api/search`

Request body must expand to include booked-price-based fields.

Recommended request:

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
  "locale": "ko-KR",
  "roomName": "King Room",
  "userBookedPrice": 320000,
  "bookedBoardType": "room_only",
  "bookedCancellationType": "free_cancellation",
  "bookedTaxIncluded": true
}
```

## 9.2 Validation

Validation must ensure:

- `userBookedPrice > 0`
- `roomName` is present
- booking condition enums are valid

## 10. Matching Logic

For MVP, use deterministic field comparison.

### Matching fields

- room name
- board type
- cancellation type
- tax included
- occupancy

### Match rules

- `exact`: all core fields match
- `close`: one field differs or room name is similar enough
- `reference_only`: multiple fields differ or condition data is missing

### MVP simplification

Room-name matching can start with:

- normalized lowercase
- punctuation removal
- shared token overlap

This does not need an LLM or advanced fuzzy engine in v1.

## 11. Implementation Phases

## Phase 1: Schema and Form Refactor

Goal:

- support user-booked-price input end to end

Tasks:

- update `lib/types/schema.ts`
- update `lib/search/params.ts`
- update `lib/api/validate-search.ts`
- update `components/home/SearchForm.tsx`
- update `components/home/HeroSection.tsx`

Deliverable:

- form submits new fields successfully

## Phase 2: Comparison Logic Refactor

Goal:

- evaluate against booked price instead of official price

Tasks:

- refactor `lib/services/search-service.ts`
- replace or supplement `BrgEvaluation`
- compute `bestComparison`
- compute `matchType`
- preserve `offers` and `fetchStatuses`

Deliverable:

- result data model supports booked-price-based output

## Phase 3: Result UI Refactor

Goal:

- show user booking as the primary anchor

Tasks:

- update `app/search/page.tsx`
- update `components/search/BrgSummaryCard.tsx`
- update `components/search/ConditionSummary.tsx`
- update `components/search/ProviderRateTable.tsx`
- update `components/search/ProviderRateCard.tsx`
- add fallback links section if needed

Deliverable:

- results clearly explain "my booking vs best candidate"

## Phase 4: Provider Strategy Upgrade

Goal:

- separate automated and link-only providers

Tasks:

- update provider model
- update `lib/mock/providers.ts`
- add fallback provider definitions
- shape result payload to include fallback links

Deliverable:

- search result distinguishes compared providers from manual-check links

## Phase 5: Adapter Boundary Preparation

Goal:

- prepare for real OTA integrations

Tasks:

- define provider adapter interface
- move mock provider offer generation behind adapter calls
- keep mock data as the first adapter implementation

Deliverable:

- codebase is ready to plug in Trip.com, Traveloka, and Vio adapters later

## 12. File-Level Backlog

## Highest Priority

- `lib/types/schema.ts`
- `lib/search/params.ts`
- `lib/api/validate-search.ts`
- `components/home/SearchForm.tsx`
- `app/search/page.tsx`
- `lib/services/search-service.ts`

## Medium Priority

- `components/search/BrgSummaryCard.tsx`
- `components/search/ConditionSummary.tsx`
- `components/search/ProviderRateTable.tsx`
- `components/search/ProviderRateCard.tsx`
- `lib/mock/providers.ts`
- `lib/mock/offers.ts`

## Lower Priority

- `docs/engineering/09-data-schema.md`
- `docs/engineering/10-api-spec.md`
- `docs/engineering/17-data-sources-and-db-strategy.md`

## 13. Practical First Implementation Strategy

Do not wait for real crawling.

Implement in this order:

1. update schema and forms
2. update logic using mock offers
3. update result UI
4. add automated vs link-only provider separation
5. ship a realistic mock-backed MVP
6. then integrate one real provider at a time

This keeps momentum high and risk low.

## 14. Risks

### Product Risk

If matching is weak, users may misread a cheap but non-equivalent room as a real savings opportunity.

Mitigation:

- always show match type
- always show reasons
- default to conservative confidence labels

### Engineering Risk

If providers are tightly coupled into search logic, future real adapters will be painful.

Mitigation:

- keep provider interfaces isolated
- normalize all candidate offers into shared types

### UX Risk

If automation fails and the page is empty, users lose trust.

Mitigation:

- always show fallback links
- always show honest failure states

## 15. Definition of Done

The MVP implementation is done when:

- the home form accepts reservation-based input
- booked price is required and validated
- search results compare against booked price, not official price
- exact, close, and reference-only states are displayed
- automated providers and link-only providers are clearly separated
- no-result and partial-failure states still provide useful next actions

## 16. Vibe Coding Prompt

Use this when generating implementation:

> Refactor Ytravel from an official-price-vs-OTA comparison app into a user-booked-price comparison app. The user enters hotel name, dates, occupancy, room name, booked price, currency, breakfast status, cancellation type, and tax inclusion. The result page should compare the user's booked price against normalized OTA candidates, highlight the cheapest valid candidate, show the price gap and percentage, and label the match as exact, close, or reference only. Support Trip.com, Traveloka, and Vio as automated providers in architecture, and Kayak, Momondo, Wego, and Trivago as link-only fallback providers. Keep the existing page skeleton where possible, but change the data model, validation, and result logic to center on userBookedPrice.

