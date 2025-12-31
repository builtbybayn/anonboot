# This detect checks whether or not the configurations that anonBOOT is going to create for the firewall already exist and whther they are enabled.

param(
    [Parameter(Mandatory = $true)]
    [string]$Endpoint
)

$ProgressPreference = 'SilentlyContinue'

try {
    $groupName = 'AB Privacy - Telemetry Block'
    $ruleName = "AB_Telemetry_$Endpoint"

    $obj = @{
        exists  = $false
        enabled = $false
    }

    # Get by DisplayName only, then filter by Group in the pipeline
    $rule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue |
    Where-Object { $_.Group -eq $groupName } |
    Select-Object -First 1

    if ($rule) {
        $obj.exists = $true
        $obj.enabled = ([bool]$rule.Enabled)
    }

    [Console]::Out.WriteLine('[[AB_JSON:START]]')
    [Console]::Out.WriteLine(($obj | ConvertTo-Json -Compress))
    [Console]::Out.WriteLine('[[AB_JSON:END]]')
}
catch {
    Write-Error $_
    exit 1
}

