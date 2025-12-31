# This script is repeatable, you just pass it a string of the process name that you want to detect

param (
    [Parameter(Mandatory = $true)]
    [string]$ServiceName)

$ProgressPreference = 'SilentlyContinue'

try {
    $svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue

    if (-not $svc) { throw "Service $ServiceName not found." }

    $obj = @{
        startType  = $svc.StartType.ToString()
        wasRunning = ($svc.Status -eq 'Running')
    }

    [Console]::Out.WriteLine('[[AB_JSON:START]]')
    [Console]::Out.WriteLine(($obj | ConvertTo-Json -Compress))
    [Console]::Out.WriteLine('[[AB_JSON:END]]')

}
catch {
    Write-Error $_
    exit 1
}