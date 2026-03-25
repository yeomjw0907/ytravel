# Ytravel MVP Plan: User-Booked-Price Comparison

## 1. Overview

- Product name: Ytravel
- Product definition: a hotel price comparison and BRG discovery tool centered on the user's booked price
- Core promise: help users quickly determine whether they booked high and where cheaper alternatives may exist

## 2. Problem

The original approach had two practical constraints:

- Crawling official hotel websites at scale is difficult and expensive to maintain.
- Third-party travel sites all behave differently, so broad crawler coverage is not realistic for an MVP.

Users do not necessarily need a full market-wide crawl. In many cases, they want a simpler answer:

- "Did I book too high?"
- "Is there a cheaper listing right now?"
- "How much cheaper is it?"

## 3. Product Direction

Ytravel should shift from an "official price vs OTA" product to a "my booked price vs cheaper market candidates" product.

This means:

- The main baseline is `userBookedPrice`.
- Official site crawling is not required for MVP.
- OTA support is selective, not exhaustive.
- If automated comparison is unavailable, the service falls back to recommended links.

## 4. MVP Goal

Allow a user to input their booked hotel information and receive:

- the cheapest candidate price found from supported OTAs
- the absolute price gap
- the percentage gap
- a confidence label based on condition matching
- direct links to continue verification on third-party sites

## 5. Non-Goals

- Full crawling coverage across all hotel sites
- Full crawling coverage across all OTA and agency sites
- Automatic BRG submission
- Booking or payment inside Ytravel
- Login, saved searches, alerts, and dashboards in MVP

## 6. Target Users

- Users who already booked a hotel and want to validate if the rate was competitive
- Users who actively hunt for BRG opportunities
- Users willing to manually verify a final candidate after seeing a strong lead

## 7. Core User Stories

1. As a user, I want to enter my reservation details so the system can compare against other sites.
2. As a user, I want to see whether a cheaper candidate exists and how large the savings are.
3. As a user, I want to know whether the compared offer is an exact match, a near match, or only a rough reference.
4. As a user, I want quick links to sites that may have a better price even if automatic comparison fails.

## 8. MVP Scope

### In Scope

- Reservation-based search flow
- User-booked-price as the main comparison baseline
- Automated comparison for a small set of OTAs
- Link-based fallback for additional travel sites
- Condition matching and confidence scoring
- Difference amount and percentage calculation

### Out of Scope

- Official hotel website crawling as a required source
- Full multi-brand parity across all booking sites
- Full room normalization across every hotel in the market
- Automatic screenshot parsing in the first version

## 9. Input Fields

The user should provide at least:

- hotel name
- check-in date
- check-out date
- number of guests
- number of rooms
- room name
- booked price
- currency
- breakfast included or not
- cancellation type
- tax included or not

Optional fields for later:

- bed type
- payment type
- free-form notes from the reservation
- booking site where the user purchased

## 10. Result Output

The result page should show:

- user booked price
- cheapest supported OTA candidate
- price difference
- discount percentage
- candidate site name
- deep link to candidate site
- condition match status
- explanation of why confidence is high or low

## 11. Confidence Labels

Ytravel should classify results into three levels:

- `Exact match`: same room, occupancy, breakfast, cancellation, and tax conditions
- `Close match`: mostly aligned, but one or more fields may differ
- `Reference only`: likely useful for exploration, but not reliable for direct BRG or strict comparison

## 12. Comparison Logic

### Primary Baseline

- `userBookedPrice`

### Core Calculations

- `priceGap = userBookedPrice - candidatePrice`
- `priceGapPercent = priceGap / userBookedPrice * 100`

### Interpretation

- If `priceGap > 0`, the candidate is cheaper than the user's booking.
- If `priceGap <= 0`, no cheaper candidate is currently found.
- A cheap result should not be treated as highly reliable unless the condition match is strong.

## 13. Data Strategy

### Hotel Coverage

- Search should attempt to support all hotels by hotel name input.
- Exact automation quality will vary by site and hotel.

### OTA Strategy

Use a hybrid model:

- a small number of supported sites for automated comparison
- a broader set of sites as link-out fallback options

### Initial Automated Provider

- `Amadeus hotel offers` when enabled and verified

### Initial Reference Providers

- `Trip.com`
- `Traveloka`
- `Vio.com`

### Initial Link-Only Sites

- `KAYAK`
- `momondo`
- `Wego`
- `trivago`

## 14. Site Prioritization Principle

Choose sites based on:

- strong user recognition
- high likelihood of cheaper rates appearing
- practical implementation difficulty
- maintenance cost relative to traffic and value

This means Ytravel should not attempt to integrate every travel site in the initial release.

## 15. Product Positioning

Recommended public positioning:

- "Search across hotels broadly."
- "Automatically compare only on explicitly supported live providers."
- "Show reference candidates for additional re-checks."
- "Use quick links for broader manual verification."
- "Confidence labels show how closely the candidate matches your booking."

Avoid claiming:

- guaranteed market-wide lowest price
- guaranteed BRG eligibility
- exhaustive OTA coverage

## 16. Main User Flow

1. User enters reservation details.
2. Ytravel validates required fields.
3. Ytravel attempts hotel matching.
4. Ytravel queries supported automated OTA sources.
5. Ytravel normalizes candidate offers into a shared schema.
6. Ytravel scores condition similarity.
7. Ytravel displays cheaper candidates or "no cheaper candidate found."
8. Ytravel shows additional link-out sites for manual verification.

## 17. Failure Handling

If automation fails, the product should not dead-end.

Fallback behavior:

- still show the user's booked information
- show sites worth checking manually
- explain that automated comparison is unavailable for this case
- preserve trust by showing a low-confidence or unavailable state, not fake precision

## 18. Information Architecture

### Screen 1: Home

- value proposition
- reservation input form
- supported site explanation
- confidence explanation

### Screen 2: Results

- booking summary
- best candidate summary
- detailed provider list
- confidence label
- link-out sites

### Screen 3: Hotel Detail or Expanded Comparison

- offer-by-offer comparison
- field-level match review
- notes and disclaimers

## 19. Core Data Model

### Search Input

- hotelName
- checkIn
- checkOut
- adults
- rooms
- roomName
- userBookedPrice
- currency
- breakfastIncluded
- cancellationType
- taxIncluded

### Candidate Offer

- providerId
- providerName
- providerType
- deeplink
- roomName
- currency
- totalPrice
- taxIncluded
- breakfastIncluded
- cancellationType
- occupancy
- collectedAt

### Comparison Result

- userBookedPrice
- bestCandidatePrice
- bestCandidateProvider
- priceGap
- priceGapPercent
- confidence
- matchedFields
- mismatchedFields
- reasons

## 20. UX Rules

- Always show the user's booked price first.
- Always show exact dates and occupancy.
- Never imply BRG certainty from price alone.
- Prefer plain explanations over aggressive claims.
- If no automatic result exists, offer helpful link-based next steps.

## 21. Success Metrics

- percentage of searches that complete successfully
- percentage of searches with at least one candidate result
- percentage of searches with a cheaper candidate found
- click-through rate on candidate provider links
- click-through rate on fallback link-out sites

## 22. Open Questions

- How should hotel matching work when the same hotel appears under multiple naming variants?
- How strict should room-name normalization be in MVP?
- Should the user be able to select their original booking site?
- Should screenshot or email parsing be introduced after MVP?

## 23. Recommended Development Order

1. Replace generic hotel search with reservation-based input.
2. Add `userBookedPrice` to the main search schema.
3. Update comparison logic to use booked price as the baseline.
4. Update result UI to focus on "my booking vs candidate."
5. Implement the first automated OTA adapters.
6. Add link-out fallback providers.
7. Add exact-match and close-match confidence states.

## 24. Acceptance Criteria

- A user can submit reservation details with booked price.
- The system can return at least one normalized candidate from supported sources when available.
- The results page shows price gap and gap percentage against the booked price.
- The results page shows confidence labels and matching reasons.
- If no automated comparison is available, fallback site links are still shown.

## 25. Build Prompt for Vibe Coding

Use this product direction when implementing:

> Build Ytravel as a hotel price comparison MVP centered on the user's booked price, not official hotel price crawling. The main flow is: user enters reservation details, the system checks supported OTA sources, normalizes candidate offers, compares them against the user's booked price, and shows the cheapest valid candidate with a confidence label. Support automated comparison for Trip.com, Traveloka, and Vio.com first. Support Kayak, Momondo, Wego, and Trivago as link-out fallback sources. Always show exact match, close match, or reference only. If automation fails, do not dead-end; show fallback links and an honest unavailable state.
