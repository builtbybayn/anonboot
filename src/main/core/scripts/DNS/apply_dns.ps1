# Takes the name of the interface and sets the DNS servers to Cloudfare which has much better privacy policies than most other resolvers

param(
    [Parameter(Mandatory = $true)]
    [string]$InterfaceAlias
)

$ProgressPreference = 'SilentlyContinue'

try {
    # Check if the interface exists / has DNS config
    $dns = Get-DnsClientServerAddress -InterfaceAlias $InterfaceAlias -AddressFamily IPv4 -ErrorAction SilentlyContinue

    if (-not $dns) {
        # Interface not found or no IPv4 DNS – nothing to do
        return
    }

    # Force Cloudflare IPv4 DNS
    $cloudflare = @("1.1.1.1", "1.0.0.1")

    Set-DnsClientServerAddress -InterfaceAlias $InterfaceAlias -ServerAddresses $cloudflare -ErrorAction SilentlyContinue

}
catch {
    Write-Error $_
    exit 1
}