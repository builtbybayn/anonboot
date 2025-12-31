# Takes in the domain of the endpoint to add to the Firewall to completely block any outgoing data.
# There is an issue running the -RemoteFqdn argument so we must convert the domain to an IP (all within the script) and add it to firewall

param(
    [Parameter(Mandatory = $true)]
    [string]$Endpoint
)

$ProgressPreference = 'SilentlyContinue'

try {
    $groupName = 'AB Privacy - Telemetry Block'
    $ruleName = "AB_Telemetry_$Endpoint"

    # Check if the rule already exists
    $existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue |
    Where-Object { $_.Group -eq $groupName } |
    Select-Object -First 1

    if ($existing) {
        # Rule already present, nothing to do
        return
    }

    # Resolve the endpoint to IP addresses
    $ips = @()

    try {
        $dnsResults = Resolve-DnsName -Name $Endpoint -ErrorAction SilentlyContinue

        if ($dnsResults) {
            $ips = $dnsResults |
            Where-Object { $_.IPAddress } |
            Select-Object -ExpandProperty IPAddress -Unique
        }
    }
    catch {
        # If DNS resolution fails, we log and skip creating the rule
        Write-Host "Failed to resolve $Endpoint to IPs. Skipping rule creation."
        return
    }

    if (-not $ips -or $ips.Count -eq 0) {
        Write-Host "No IP addresses resolved for $Endpoint. Skipping rule creation."
        return
    }

    # Create a new outbound block rule for the resolved IPs
    New-NetFirewallRule `
        -DisplayName $ruleName `
        -Direction Outbound `
        -Action Block `
        -RemoteAddress $ips `
        -Profile Any `
        -Enabled True `
        -Group $groupName `
    | Out-Null

}
catch {
    Write-Error $_
    exit 1
}
