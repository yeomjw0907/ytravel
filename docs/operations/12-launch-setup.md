# Ytravel Launch Setup

## What is already ready in code

- Vercel build now uses the default `.next` output in Vercel and `.next-build` locally.
- Search results can open external providers with preserved search conditions where supported.
- Trip.com links are generated with hotel name, check-in, check-out, adults, children, and room count.
- The UI now distinguishes between `live` data and `reference` candidates.

## Variables this project actually needs

| Variable | Required | Current recommendation |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Yes | Set a real support inbox before launch |
| `AMADEUS_CLIENT_ID` | Optional | Leave empty if live offers stay off |
| `AMADEUS_CLIENT_SECRET` | Optional | Leave empty if live offers stay off |
| `AMADEUS_HOTEL_OFFERS_ENABLED` | Yes | Keep `false` for initial launch |

## Recommended launch path this week

1. Set a real `NEXT_PUBLIC_CONTACT_EMAIL`.
2. Launch with `AMADEUS_HOTEL_OFFERS_ENABLED=false`.
3. Keep provider cards in `reference` mode for outbound verification.
4. Turn on live Amadeus hotel offers only after a real key test passes in production.

## What you must do manually

These steps require your account, approval, or credentials and cannot be completed for you from this workspace.

1. Sign in to Vercel with `vercel login` or prepare a `VERCEL_TOKEN`.
2. Create or confirm the target Vercel project.
3. Create an Amadeus developer account and generate `API Key` and `API Secret` if you want live offers.
4. If you later want Booking, Expedia, Trip, or Traveloka APIs, apply as a partner and wait for approval.

## What can be automated after login

The repository includes [setup-vercel.ps1](/Users/yeomj/OneDrive/Desktop/ytravel/scripts/setup-vercel.ps1).

It can:

- verify Vercel CLI availability
- check whether you are authenticated
- link the current repo to a Vercel project
- add or update the required environment variables in `production` and `development`
- optionally add preview variables when you pass `-IncludePreview` and, if needed, `-PreviewGitBranch`
- optionally run `vercel env pull .env.local`

## Fastest safe setup

If you want the fastest launch-safe configuration, use:

```powershell
$env:NEXT_PUBLIC_CONTACT_EMAIL="support@yourdomain.com"
powershell -ExecutionPolicy Bypass -File .\scripts\setup-vercel.ps1 -Project ytravel -PullDevelopmentEnv
```

This keeps live Amadeus offers off and configures only the public contact email.

## Live Amadeus setup

After you create an Amadeus app and get a key pair:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-vercel.ps1 `
  -Project ytravel `
  -ContactEmail "support@yourdomain.com" `
  -AmadeusClientId "YOUR_AMADEUS_KEY" `
  -AmadeusClientSecret "YOUR_AMADEUS_SECRET" `
  -AmadeusOffersEnabled true `
  -PullDevelopmentEnv
```

## Optional preview setup

If you want preview-specific variables too:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup-vercel.ps1 `
  -Project ytravel `
  -ContactEmail "support@yourdomain.com" `
  -IncludePreview `
  -PreviewGitBranch "feature/branch-name"
```

## Official references

- Vercel CLI overview: [vercel.com/docs/cli](https://vercel.com/docs/cli)
- Vercel environment variables: [vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
- Amadeus quick start: [developers.amadeus.com/self-service/apis-docs/guides/developer-guides/quick-start/](https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides/quick-start/)

## Notes

- Vercel CLI can also authenticate with a token via `--token` in CI or non-interactive flows.
- `vercel env pull` writes development variables to a local env file for local testing.
- For this launch, `reference` mode is safer than enabling unverified live supplier pricing.
