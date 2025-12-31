param(
    [Parameter(Mandatory = $true)]
    [string]$SnapshotJson
)

$ProgressPreference = 'SilentlyContinue'

try {
    $snap = $SnapshotJson | ConvertFrom-Json

    if (-not $snap -or -not $snap.servers) {
        throw "Invalid snapshot JSON: no 'servers' array found."
    }

    Write-Host "Reverting DoH hardening: restoring DoH servers from snapshot..."

    #
    # 1) Remove all currently configured DoH servers
    #
    $current = Get-DnsClientDohServerAddress -ErrorAction SilentlyContinue

    if ($current) {
        foreach ($c in $current) {
            $addr = $c.ServerAddress
            Write-Host "Removing current DoH server: $addr"

            try {
                Remove-DnsClientDohServerAddress -ServerAddress $addr -ErrorAction SilentlyContinue
            }
            catch {
                Write-Host "Failed to remove DoH server $addr (it may already be gone)."
            }
        }
    }

    #
    # 2) Recreate all servers from snapshot
    #
    foreach ($s in $snap.servers) {
        $addr = $s.serverAddress
        $template = $s.dohTemplate
        $autoUpgrade = [bool]$s.autoUpgrade
        $udpFallback = [bool]$s.udpFallback

        Write-Host "Restoring DoH server from snapshot: $addr"

        try {
            Add-DnsClientDohServerAddress `
                -ServerAddress $addr `
                -DohTemplate $template `
                -AutoUpgrade:$autoUpgrade `
                -AllowFallbackToUdp:$udpFallback `
                -ErrorAction SilentlyContinue
        }
        catch {
            Write-Host "Failed to add DoH server $addr"
        }
    }

    Write-Host "DoH configuration restored from snapshot."

}
catch {
    Write-Error $_
    exit 1
}
