# Run this helper yourself in PowerShell after the private login is deployed.
# It copies only the staging preview key; it never prints it or puts it in a URL.
$ErrorActionPreference = 'Stop'
$taskRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$credentialPath = Join-Path $taskRoot 'site/.wrangler/staging-secrets.json'
$stagingKey = (Get-Content -Raw -LiteralPath $credentialPath | ConvertFrom-Json).PREVIEW_ACCESS_TOKEN
if ($stagingKey -isnot [string] -or $stagingKey.Length -lt 32) { throw 'Private staging credential is unavailable.' }
$loginUrl = 'https://ai-building-blocks-staging.kevinmark7498.workers.dev/__preview/login'
Set-Clipboard -Value $stagingKey
Start-Process $loginUrl
Write-Host 'The staging key is on your clipboard. Paste it into the Staging access credential field and select Open staging.'
Write-Host 'Use your normal browser. Do not paste this key into chat or another website.'
Write-Host 'After login, create a space named Staging launch verification owner-20261022.'
Write-Host 'Complete the Cloudflare check yourself if shown, then reload to confirm the space remains.'
try {
  $null = Read-Host 'Press Enter after you have pasted the key; this clears it from the clipboard'
} finally {
  if ((Get-Clipboard -Raw) -ceq $stagingKey) { Set-Clipboard -Value '' }
  Remove-Variable stagingKey -ErrorAction SilentlyContinue
}
