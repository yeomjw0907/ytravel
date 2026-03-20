param(
  [string]$Project = "ytravel",
  [string]$Scope = "",
  [string]$Token = $env:VERCEL_TOKEN,
  [string]$ContactEmail = $env:NEXT_PUBLIC_CONTACT_EMAIL,
  [string]$AmadeusClientId = $env:AMADEUS_CLIENT_ID,
  [string]$AmadeusClientSecret = $env:AMADEUS_CLIENT_SECRET,
  [ValidateSet("true", "false")]
  [string]$AmadeusOffersEnabled = $(if ($env:AMADEUS_HOTEL_OFFERS_ENABLED) { $env:AMADEUS_HOTEL_OFFERS_ENABLED } else { "false" }),
  [switch]$IncludePreview,
  [string]$PreviewGitBranch = "",
  [switch]$PullDevelopmentEnv
)

$ErrorActionPreference = "Stop"

function Get-CommonFlags {
  $flags = New-Object System.Collections.Generic.List[string]
  if (-not [string]::IsNullOrWhiteSpace($Scope)) {
    $flags.Add("--scope")
    $flags.Add($Scope)
  }
  if (-not [string]::IsNullOrWhiteSpace($Token)) {
    $flags.Add("--token")
    $flags.Add($Token)
  }
  return ,$flags.ToArray()
}

function Invoke-VercelCommand {
  param([string[]]$Arguments)

  $tokens = New-Object System.Collections.Generic.List[string]
  foreach ($argument in $Arguments) {
    if (-not [string]::IsNullOrWhiteSpace($argument)) {
      $tokens.Add($argument)
    }
  }
  foreach ($flag in (Get-CommonFlags)) {
    $tokens.Add($flag)
  }

  & vercel @tokens
  if ($LASTEXITCODE -ne $null) {
    return $LASTEXITCODE
  }
  if ($?) {
    return 0
  }
  return 1
}

function Assert-VercelInstalled {
  if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    throw "Vercel CLI was not found. Install it first with `npm i -g vercel`."
  }
}

function Assert-VercelAuth {
  try {
    $null = & vercel whoami
    if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq $null) {
      Write-Host "Vercel authentication check passed." -ForegroundColor Green
      return
    }
  } catch {
  }

  if ($?) {
    Write-Host "Vercel authentication check passed." -ForegroundColor Green
    return
  }

  throw @"
Vercel authentication is missing.
Run one of the following, then rerun this script:

  vercel login

or

  `$env:VERCEL_TOKEN = "your_token"
"@
}

function Add-StringArgs {
  param(
    [System.Collections.Generic.List[string]]$List,
    [string[]]$Values
  )

  foreach ($value in $Values) {
    $List.Add($value)
  }
}

function Ensure-VercelLink {
  if (Test-Path ".vercel/project.json") {
    Write-Host "Project is already linked to Vercel." -ForegroundColor Green
    return
  }

  Write-Host "Linking this repo to Vercel project '$Project'..." -ForegroundColor Yellow
  $code = Invoke-VercelCommand -Arguments @("link", "--yes", "--project", $Project)
  if ($code -ne 0) {
    throw "Failed to link the current directory to Vercel project '$Project'."
  }
}

function Set-VercelEnvValue {
  param(
    [string]$Name,
    [string]$Value,
    [string[]]$Environments
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    Write-Host "Skipping $Name because no value was provided." -ForegroundColor DarkYellow
    return
  }

  foreach ($environment in $Environments) {
    Write-Host "Setting $Name for $environment..." -ForegroundColor Yellow

    $args = New-Object System.Collections.Generic.List[string]
    Add-StringArgs -List $args -Values @("env", "add", $Name, $environment)
    if ($environment -eq "preview" -and -not [string]::IsNullOrWhiteSpace($PreviewGitBranch)) {
      $args.Add($PreviewGitBranch)
    }
    Add-StringArgs -List $args -Values @("--value", $Value, "--yes", "--force")

    $addCode = Invoke-VercelCommand -Arguments $args.ToArray()

    if ($addCode -ne 0) {
      $updateArgs = New-Object System.Collections.Generic.List[string]
      Add-StringArgs -List $updateArgs -Values @("env", "update", $Name, $environment)
      if ($environment -eq "preview" -and -not [string]::IsNullOrWhiteSpace($PreviewGitBranch)) {
        $updateArgs.Add($PreviewGitBranch)
      }
      Add-StringArgs -List $updateArgs -Values @("--value", $Value, "--yes")

      $updateCode = Invoke-VercelCommand -Arguments $updateArgs.ToArray()

      if ($updateCode -ne 0) {
        throw "Failed to add or update $Name for $environment."
      }
    }
  }
}

function Pull-DevelopmentEnv {
  Write-Host "Pulling development env into .env.local..." -ForegroundColor Yellow
  $code = Invoke-VercelCommand -Arguments @("env", "pull", ".env.local", "--yes")
  if ($code -ne 0) {
    throw "Failed to pull development environment variables."
  }
}

Assert-VercelInstalled
Assert-VercelAuth
Ensure-VercelLink

$targetEnvironments = @("production", "development")
if ($IncludePreview) {
  $targetEnvironments += "preview"
}

Set-VercelEnvValue -Name "NEXT_PUBLIC_CONTACT_EMAIL" -Value $ContactEmail -Environments $targetEnvironments
Set-VercelEnvValue -Name "AMADEUS_HOTEL_OFFERS_ENABLED" -Value $AmadeusOffersEnabled -Environments $targetEnvironments
Set-VercelEnvValue -Name "AMADEUS_CLIENT_ID" -Value $AmadeusClientId -Environments $targetEnvironments
Set-VercelEnvValue -Name "AMADEUS_CLIENT_SECRET" -Value $AmadeusClientSecret -Environments $targetEnvironments

if ($PullDevelopmentEnv) {
  Pull-DevelopmentEnv
}

Write-Host ""
Write-Host "Setup complete." -ForegroundColor Green
Write-Host "Project: $Project"
Write-Host "Live Amadeus offers enabled: $AmadeusOffersEnabled"
Write-Host "Next step: run 'vercel --prod' after you verify the values." -ForegroundColor Cyan
