# Ytravel gstack Usage Guide

## Why this matters

Ytravel is not blocked by raw feature count anymore. The real risks are:

- broken launch flows
- misleading pricing or provider state
- weak release checks before pushing to production
- fuzzy product messaging when positioning changes

gstack is most useful when it is treated as an operations layer for these risks.

## Best skills for Ytravel right now

### `gstack-browse`

Use it for fast browser dogfooding.

Good Ytravel tasks:

- open the home page and verify the hero copy and search form
- run a search and confirm the search condition survives into result cards
- click an outbound provider link and verify the hotel/date/guest context is preserved
- test mobile and desktop layouts before release

Example asks:

- `gstack-browse로 홈 > 검색 > 외부 링크 이동 흐름 테스트해줘`
- `gstack-browse로 Trip.com 링크가 날짜/인원 조건을 유지하는지 확인해줘`

### `gstack-qa`

Use it as the release gate skill.

Good Ytravel tasks:

- run a full smoke QA before shipping
- test the happy path, no-result path, and partial-failure path
- verify `/guide`, `/disclaimer`, `/contact` and footer links
- fix obvious bugs found during testing

Example asks:

- `gstack-qa로 이번 주 오픈 기준 전체 QA 돌리고 치명도 높은 문제부터 고쳐줘`
- `gstack-qa로 검색 결과와 호텔 상세 흐름을 점검해줘`

### `gstack-review`

Use it before merge or deployment.

Good Ytravel tasks:

- review the current diff before pushing to `main`
- catch bad assumptions in provider mapping and API flag handling
- inspect dangerous UI copy regressions or missing legal notices

Example asks:

- `gstack-review로 지금 diff 기준 출시 리스크 위주로 리뷰해줘`
- `gstack-review로 provider 상태값 처리에 회귀가 없는지 봐줘`

### `gstack-investigate`

Use it when something is broken and the root cause is not obvious.

Good Ytravel tasks:

- Vercel deploy failures
- build or lint regressions
- provider data mismatch between result cards and fetch statuses
- broken outbound links or stale query params

Example asks:

- `gstack-investigate로 왜 Vercel 배포가 깨졌는지 원인부터 찾고 고쳐줘`
- `gstack-investigate로 Trip 링크 조건이 깨지는 이유를 추적해줘`

### `gstack-setup-deploy`

Use it once to formalize deploy rules.

Good Ytravel tasks:

- document Vercel production URL
- define health checks
- make future deploy commands repeatable

Example asks:

- `gstack-setup-deploy로 Ytravel의 Vercel 배포 설정을 정리해줘`

### `gstack-ship`

Use it only after QA and review are clean.

Good Ytravel tasks:

- run the final ship workflow after code is ready
- push changes after checks are green

Example asks:

- `gstack-ship으로 이번 수정분을 main에 반영하고 배포 직전 체크까지 해줘`

### `gstack-office-hours`

Use it for business and product framing, not coding.

Good Ytravel tasks:

- sharpen the wedge for launch
- decide whether to stay with `reference` mode or enable live offers
- refine the home page promise and user segment

Example asks:

- `gstack-office-hours로 Ytravel의 가장 좁은 초기 타겟과 메시지를 다시 잡아줘`

## Recommended weekly workflow

1. Use `gstack-office-hours` when product positioning changes.
2. Use `gstack-browse` during active UI work.
3. Use `gstack-investigate` when a bug is reported.
4. Use `gstack-review` before merging.
5. Use `gstack-qa` before launch or weekly release.
6. Use `gstack-ship` only after the above are clean.

## What not to overuse

- Do not start with `gstack-ship` when the release is still unstable.
- Do not use `gstack-office-hours` for implementation tasks.
- Do not use `gstack-qa` for every tiny copy change; use `gstack-browse` first.

## Best immediate use for Ytravel

If only three are used this week, use:

1. `gstack-browse`
2. `gstack-qa`
3. `gstack-review`

That combination gives the most value for launch confidence with the least workflow overhead.
