
# AFTER DINNER: make this script as well as revert take in a string of the process to act on then make their calls in scripts.js black boxes.
param (
    [Parameter(Mandatory = $true)]
    [string]$ServiceName)

$ProgressPreference = 'SilentlyContinue'

try {

  $svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue

  if (-not $svc) { throw "Service $ServiceName not found." }

  # Idempotent changes
  if ($svc.Status -eq 'Running') {
    Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue | Out-Null
  }

  if ($svc.StartType -ne 'Disabled') {
    Set-Service -Name $ServiceName -StartupType Disabled | Out-Null
  }

  # Re-check state to confirm changes
  $svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
}
catch {
  Write-Error $_
  exit 1
}