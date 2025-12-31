# Detect the DNS setings for an interface such as WiFi. Write them to a JSON that will get converted to snapshot.
# It takes in an InterfaceAlias parameter that is the interface which it will read from.

param(
    [Parameter(Mandatory = $true)]
    [string]$InterfaceAlias
)

$ProgressPreference = 'SilentlyContinue'

try {
    # Default snapshot object
    $obj = @{
        exists          = $false
        usesDhcp        = $false
        serverAddresses = @()
    }

    # Try to get DNS info for this interface (IPv4)
    $dns = Get-DnsClientServerAddress -InterfaceAlias $InterfaceAlias -AddressFamily IPv4 -ErrorAction SilentlyContinue

    if ($dns) {
        $obj.exists = $true

        # Collect server addresses as a clean array of strings
        $servers = @($dns.ServerAddresses | Where-Object { $_ -and $_.Trim() -ne '' })
        $obj.serverAddresses = $servers

        # Determine if DNS was coming from DHCP or set manually (when available)
        if ($dns.PSObject.Properties.Name -contains 'AddressOrigin') {
            $origin = $dns.AddressOrigin.ToString()
            $obj.usesDhcp = ($origin -eq 'Dhcp')
        }
        # If AddressOrigin isn't available on some builds, we leave usesDhcp = $false
        # and just treat it as manual in revert logic.
    }

    [Console]::Out.WriteLine('[[AB_JSON:START]]')
    [Console]::Out.WriteLine(($obj | ConvertTo-Json -Compress))
    [Console]::Out.WriteLine('[[AB_JSON:END]]')
}
catch {
    Write-Error $_
    exit 1
}
