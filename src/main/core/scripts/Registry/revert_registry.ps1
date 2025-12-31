# This revert script must be abit smarter than the process revert. This needs to read from the snapshot whether or not the key originally existed, if not delete the whole key.
# It also must check if the key existed but the value didnt, remove the value
# And finally, if the key existed and the value existed, then just restore the value/type to original

param(
    [Parameter(Mandatory = $true)]
    [string]$SnapshotJson
)

$ProgressPreference = 'SilentlyContinue'

try {
    $snap = $SnapshotJson | ConvertFrom-Json

    $path = $snap.path
    $name = $snap.name

    # CASE 1: Key did NOT exist originally -> remove the whole key if it exists now
    if (-not $snap.keyExists) {
        if (Test-Path $path) {
            Remove-Item -Path $path -Recurse -Force
        }
        return
    }

    # CASE 2: Key existed, but value did NOT exist originally -> remove the value if present
    if ($snap.keyExists -and -not $snap.valueExists) {
        if (Test-Path $path) {
            if (Get-ItemProperty -Path $path -Name $name -ErrorAction SilentlyContinue) {
                Remove-ItemProperty -Path $path -Name $name -ErrorAction SilentlyContinue
            }
        }
        return
    }

    # CASE 3: Key and value BOTH existed originally -> restore them
    if (-not (Test-Path $path)) {
        New-Item -Path $path -Force | Out-Null
    }

    $existing = Get-ItemProperty -Path $path -Name $name -ErrorAction SilentlyContinue

    if ($existing) {
        Set-ItemProperty -Path $path -Name $name -Value $snap.valueData | Out-Null
    }
    else {
        New-ItemProperty -Path $path -Name $name -PropertyType $snap.valueType -Value $snap.valueData | Out-Null
    }

}
catch {
    Write-Error $_
    exit 1
}
