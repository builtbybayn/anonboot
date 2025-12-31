# Takes in the Domain and the snapshot and reverts the settings in etc/hosts to the snapshots settings.

param(
    [Parameter(Mandatory = $true)]
    [string]$Domain,

    [Parameter(Mandatory = $true)]
    [string]$SnapshotJson
)

$ProgressPreference = 'SilentlyContinue'

$hostsPath = Join-Path $env:SystemRoot "System32\drivers\etc\hosts"
$encoding = [System.Text.Encoding]::ASCII

function Get-HostsLines {
    if (-not (Test-Path $hostsPath)) {
        throw "Hosts file not found at $hostsPath"
    }

    $lines = Get-Content -Path $hostsPath -ErrorAction Stop
    if ($null -eq $lines) { return @() }

    return @($lines) | ForEach-Object { [string]$_ }
}

function Write-HostsLines {
    param(
        [string[]]$Lines,
        [int]$MaxAttempts = 5,
        [int]$DelayMs = 200
    )

    if (-not $Lines) {
        $Lines = @()
    }

    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        try {
            [System.IO.File]::WriteAllLines($hostsPath, $Lines, $encoding)
            return
        }
        catch {
            if ($attempt -eq $MaxAttempts) {
                throw
            }
            Start-Sleep -Milliseconds $DelayMs
        }
    }
}

try {
    if ([string]::IsNullOrWhiteSpace($SnapshotJson)) {
        Write-Error "SnapshotJson is empty; nothing to revert."
        exit 1
    }

    $snap = $SnapshotJson | ConvertFrom-Json

    # Graceful defaults
    $present = $false
    $rawLine = $null

    if ($snap.PSObject.Properties.Name -contains 'present') {
        $present = [bool]$snap.present
    }
    if ($snap.PSObject.Properties.Name -contains 'rawLine') {
        $rawLine = [string]$snap.rawLine
    }

    $lines = Get-HostsLines

    # Regex to match domain as a token (case-insensitive)
    $pattern = [regex]::Escape($Domain)
    $regex = "(?i)(^|\s)$pattern(\s|$|#)"

    if (-not $present) {
        # Domain did NOT exist originally -> make sure it's removed now
        $lines = @($lines) | Where-Object { $_ -notmatch $regex }

        Write-HostsLines -Lines $lines
        return
    }

    # Domain DID exist originally; restore $rawLine

    # If snapshot somehow has no rawLine, just remove any sinkhole mapping
    if ([string]::IsNullOrWhiteSpace($rawLine)) {
        $lines = @($lines) | Where-Object { $_ -notmatch $regex }
        Write-HostsLines -Lines $lines
        return
    }

    $foundIndex = $null
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match $regex) {
            $foundIndex = $i
            break
        }
    }

    if ($foundIndex -ne $null) {
        $lines[$foundIndex] = [string]$rawLine
    }
    else {
        # That line was removed entirely; re-add it
        $lines += [string]$rawLine
    }

    $lines = @($lines) | ForEach-Object { [string]$_ }

    Write-HostsLines -Lines $lines
}
catch {
    Write-Error $_
    exit 1
}
