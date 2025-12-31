# THis revert, similar to the devices apply takes in a parameter of 'Camera', 'Mic', or 'Both' to revert the cameras, to revert those accordingly,
# OR takes in an InstanceId to revert a specific device

param(
    [Parameter(Mandatory = $true)]
    [string]$SnapshotJson,

    [ValidateSet('Camera', 'Mic', 'Both')]
    [string]$Mode,

    [string]$InstanceId
)

$ProgressPreference = 'SilentlyContinue'

function Normalize-Snapshot {
    param([object]$snap)

    if ($null -eq $snap) {
        return @()
    }

    if ($snap -is [System.Collections.IEnumerable] -and
        $snap -isnot [string]) {
        return @($snap)
    }

    return @($snap)
}

try {
    if ([string]::IsNullOrWhiteSpace($SnapshotJson)) {
        Write-Error "SnapshotJson is empty; nothing to revert."
        exit 1
    }

    $snapObj = $SnapshotJson | ConvertFrom-Json
    $snapshot = Normalize-Snapshot -snap $snapObj

    if (-not $snapshot) { return }

    # Per-device revert takes precedence
    if ($InstanceId) {
        $entry = $snapshot | Where-Object { $_.instanceId -eq $InstanceId } | Select-Object -First 1
        if ($null -eq $entry) { return }

        $originalStatus = $entry.status
        if ($originalStatus -ne 'OK' -and $originalStatus -ne 'Started') {
            return
        }

        $current = Get-PnpDevice -InstanceId $entry.instanceId -ErrorAction SilentlyContinue
        if ($null -eq $current) { return }

        try {
            Enable-PnpDevice -InstanceId $entry.instanceId -Confirm:$false -ErrorAction Stop
        }
        catch {
            # If it's already enabled or re-enable fails, we just move on
        }

        return
    }

    # Global revert
    if (-not $Mode) {
        Write-Error "Either -InstanceId or -Mode (Camera|Mic|Both) must be specified."
        exit 1
    }

    $filtered = switch ($Mode) {
        'Camera' { $snapshot | Where-Object { $_.isCamera } }
        'Mic' { $snapshot | Where-Object { $_.isMicrophone } }
        'Both' { $snapshot }
    }

    foreach ($entry in $filtered) {
        $originalStatus = $entry.status
        if ($originalStatus -ne 'OK' -and $originalStatus -ne 'Started') {
            continue
        }

        $current = Get-PnpDevice -InstanceId $entry.instanceId -ErrorAction SilentlyContinue
        if ($null -eq $current) { continue }

        try {
            Enable-PnpDevice -InstanceId $entry.instanceId -Confirm:$false -ErrorAction Stop
        }
        catch {
            # Ignore and keep going
        }
    }
}
catch {
    Write-Error $_
    exit 1
}
