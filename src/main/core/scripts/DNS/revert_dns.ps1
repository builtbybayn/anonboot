# Reads the snapshot, and configures the DNS server settings accordingly.

param(
    [Parameter(Mandatory = $true)]
    [string]$InterfaceAlias,

    [Parameter(Mandatory = $true)]
    [string]$SnapshotJson
)

$ProgressPreference = 'SilentlyContinue'

try {
    $snap = $SnapshotJson | ConvertFrom-Json

    # If the interface didn't exist originally, don't touch anything.
    if (-not $snap.exists) {
        return
    }

    # Check that the interface still exists now.
    $dns = Get-DnsClientServerAddress -InterfaceAlias $InterfaceAlias -AddressFamily IPv4 -ErrorAction SilentlyContinue

    if (-not $dns) {
        # Interface missing now (renamed/removed) -> nothing we can safely do.
        return
    }

    if ($snap.usesDhcp) {
        # Originally using automatic (DHCP) DNS -> reset back to automatic
        Set-DnsClientServerAddress -InterfaceAlias $InterfaceAlias -ResetServerAddresses -ErrorAction SilentlyContinue
    }
    else {
        # Originally using manual DNS -> restore original servers
        $servers = @($snap.serverAddresses | Where-Object { $_ -and $_.Trim() -ne '' })

        if ($servers.Count -gt 0) {
            Set-DnsClientServerAddress -InterfaceAlias $InterfaceAlias -ServerAddresses $servers -ErrorAction SilentlyContinue
        }
        else {
            # No servers recorded (weird edge case) -> safest is to reset to automatic
            Set-DnsClientServerAddress -InterfaceAlias $InterfaceAlias -ResetServerAddresses -ErrorAction SilentlyContinue
        }
    }

}
catch {
    Write-Error $_
    exit 1
}
