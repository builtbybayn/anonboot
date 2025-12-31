param(
  [Parameter (Mandatory = $true)]
  [string]$ServiceName,

  [Parameter(Mandatory = $true)]
  [string]$SnapshotJson
)


$ProgressPreference = 'SilentlyContinue'

try {

  $snap = $SnapshotJson | ConvertFrom-Json

  if (-not $snap) { throw "Invalid snapshot JSON." }

  Set-Service -Name $ServiceName -StartupType $snap.startType | Out-Null

  if ($snap.wasRunning) {
    Start-Service -Name $ServiceName -ErrorAction SilentlyContinue | Out-Null
  }

}
catch {
  Write-Error $_
  exit 1
}