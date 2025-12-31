# Similar to the other sripts, this takes in the task name and the path so they msut be passed in (from an object) in the JS that calls this.

param(
    [Parameter(Mandatory = $true)]
    [string]$TaskName,

    [Parameter(Mandatory = $true)]
    [string]$TaskPath
)

$ProgressPreference = 'SilentlyContinue'

try {
    # Try to get the scheduled task
    $task = Get-ScheduledTask -TaskName $TaskName -TaskPath $TaskPath -ErrorAction SilentlyContinue

    $exists = $false
    $wasEnabled = $false

    if ($task) {
        $exists = $true
        $wasEnabled = $task.Settings.Enabled
    }

    $obj = @{
        exists     = $exists
        wasEnabled = $wasEnabled
    }

    [Console]::Out.WriteLine('[[AB_JSON:START]]')
    [Console]::Out.WriteLine(($obj | ConvertTo-Json -Compress))
    [Console]::Out.WriteLine('[[AB_JSON:END]]')

}
catch {
    Write-Error $_
    exit 1
}
