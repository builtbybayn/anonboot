# If anonBOOT was the one to mess with cloudfare DoH settings, then it will revert to the original settings, otherwise it wont change it.
# Basically, reads from the snapshot of what to revert and if nothing, no change

param(
    [Parameter(Mandatory = $true)]
    [string]$SnapshotJson
)

$ProgressPreference = 'SilentlyContinue'

try {
    $snap = $SnapshotJson | ConvertFrom-Json

    if (-not $snap) {
        throw "Invalid snapshot JSON."
    }

    Write-Host "Reverting Cloudflare DoH configuration based on snapshot..."

    #
    # 1. Handle 1.1.1.1
    #
    if (-not $snap.cloudflare11Configured) {
        # It was NOT configured before we ran apply-doh,
        # so we try to remove the DoH encryption entry we added.
        try {
            netsh dns delete encryption server=1.1.1.1 | Out-Null
        }
        catch {
            Write-Host "Could not remove DoH config for 1.1.1.1 (it may not exist)."
        }
    }

    #
    # 2. Handle 1.0.0.1
    #
    if (-not $snap.cloudflare10Configured) {
        # Same logic: only remove if it wasn't configured originally.
        try {
            netsh dns delete encryption server=1.0.0.1 | Out-Null
        }
        catch {
            Write-Host "Could not remove DoH config for 1.0.0.1 (it may not exist)."
        }
    }

}
catch {
    Write-Error $_
    exit 1
}
