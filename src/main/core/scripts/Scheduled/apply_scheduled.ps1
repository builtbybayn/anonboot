# See detect, this also takes in the TaskName and TaskPath from a JS object when the script gets passed to the scriptrunner.


param(
    [Parameter(Mandatory = $true)]
    [string]$TaskName,

    [Parameter(Mandatory = $true)]
    [string]$TaskPath
)

$ProgressPreference = 'SilentlyContinue'

try {
    # Check if the task exists
    $task = Get-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -ErrorAction SilentlyContinue

    if ($task) {
        # Only disable if it's currently enabled
        if ($task.Settings.Enabled) {
            Disable-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -ErrorAction SilentlyContinue | Out-Null
        }
    }

    # No output — same as your other apply scripts
}
catch {
    Write-Error $_
    exit 1
}
