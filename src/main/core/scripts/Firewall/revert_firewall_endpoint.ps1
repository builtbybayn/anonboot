# This takes in the endpoint parameter, looks for a rule in the firewall named with that, if there is one removes it.
# If there is 

param(
    [Parameter(Mandatory = $true)]
    [string]$Endpoint
)

$ProgressPreference = 'SilentlyContinue'

try {
    $groupName = 'AB Privacy - Telemetry Block'
    $ruleName = "AB_Telemetry_$Endpoint"

    # 1) Ensure firewall cmdlets exist
    if (-not (Get-Command -Name Get-NetFirewallRule -ErrorAction SilentlyContinue) -or
        -not (Get-Command -Name Remove-NetFirewallRule -ErrorAction SilentlyContinue)) {

        Write-Host "Firewall cmdlets (Get-NetFirewallRule/Remove-NetFirewallRule) not available. Skipping revert for $Endpoint."
        return
    }

    # 2) Find our rule by DisplayName & Group
    $rule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue |
    Where-Object { $_.Group -eq $groupName }

    if ($rule) {
        Write-Host "Removing firewall rule for $Endpoint"
        try {
            $rule | Remove-NetFirewallRule -ErrorAction SilentlyContinue
        }
        catch {
            Write-Host "Failed to remove firewall rule for $Endpoint (it may already be gone)."
        }
    }
    else {
        Write-Host "No firewall rule found for $Endpoint in group $groupName. Nothing to revert."
    }

}
catch {
    Write-Error $_
    exit 1
}
