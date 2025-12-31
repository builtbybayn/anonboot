param(
    [Parameter(Mandatory = $true)]
    [string]$TaskName,

    [Parameter(Mandatory = $true)]
    [string]$TaskPath,

    [Parameter(Mandatory = $true)]
    [string]$SnapshotJson
)

$ProgressPreference = 'SilentlyContinue'

try {
    $snap = $SnapshotJson | ConvertFrom-Json

    # If the task didn't exist originally, don't touch anything.
    if (-not $snap.exists) {
        return
    }

    # If the task existed originally, try to get it now.
    $task = Get-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -ErrorAction SilentlyContinue

    # If it's gone now (unregistered manually or by system), nothing we can do.
    if (-not $task) {
        return
    }

    if ($snap.wasEnabled) {
        # It was enabled originally -> make sure it's enabled now.
        Enable-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -ErrorAction SilentlyContinue | Out-Null
    }
    else {
        # It existed but was disabled originally -> keep/put it disabled.
        Disable-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -ErrorAction SilentlyContinue | Out-Null
    }

}
catch {
    Write-Error $_
    exit 1
}
