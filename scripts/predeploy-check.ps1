$ErrorActionPreference = "Stop"

$expectedRoot = "C:\Users\Lenovo_CT\Desktop\AI Health Wellness Hub Master\live"
$currentRoot = (Resolve-Path ".").Path

if ($currentRoot -ne $expectedRoot) {
  throw "Wrong folder. Expected '$expectedRoot' but current folder is '$currentRoot'. Do not deploy."
}

$indexPath = Join-Path $expectedRoot "site\index.html"
$sitemapPath = Join-Path $expectedRoot "site\sitemap.xml"
$robotsPath = Join-Path $expectedRoot "site\robots.txt"

foreach ($path in @($indexPath, $sitemapPath, $robotsPath)) {
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing required file: $path"
  }
}

$index = Get-Content -LiteralPath $indexPath -Raw
$sitemap = Get-Content -LiteralPath $sitemapPath -Raw
$robots = Get-Content -LiteralPath $robotsPath -Raw

if ($index -match "Open generator") {
  throw "Homepage still contains 'Open generator'."
}

if ($index -match "meal-plan\.html#free-meal-generator") {
  throw "Homepage exposes the direct generator anchor. Route public generator CTAs to #subscribe."
}

if ($index -notmatch 'class="button panel-button" href="#meal-plan">View sample plan</a>') {
  throw "Homepage panel CTA must say 'View sample plan' and link to #meal-plan."
}

if ($sitemap -match "ai-health-wellness-hub\.netlify\.app") {
  throw "Sitemap still contains the old Netlify domain."
}

if ($sitemap -match "meal-plan\.html") {
  throw "Sitemap exposes the generator page. Keep meal-plan.html out of sitemap."
}

if ($robots -notmatch "https://www\.aihealthwellness\.com/sitemap\.xml") {
  throw "robots.txt must point to https://www.aihealthwellness.com/sitemap.xml"
}

Push-Location (Join-Path $expectedRoot "site")
try {
  node --check app.js
  node --check p5-hero.js
}
finally {
  Pop-Location
}

node (Join-Path $expectedRoot "scripts\test-subscribe-function.mjs")

Write-Host "Predeploy check passed for $expectedRoot"
