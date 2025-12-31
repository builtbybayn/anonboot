
# This enumerates which servers are active and nukes everything besides Cloudflares for DoH. This is a major source of leaks, DNS drifting, 
# where it can fallback to these other resolvers unless they are completely removed. The downside is, if Cloudflare goes down, you won't be
# able to make DNS requests.

$ProgressPreference = 'SilentlyContinue'

try {
    Write-Host "Hardening DoH configuration: keeping only Cloudflare resolvers..."

    # Cloudflare IPv4 + IPv6 resolvers we want to keep
    $allowedServers = @(
        '1.1.1.1',
        '1.0.0.1',
        '2606:4700:4700::1111',
        '2606:4700:4700::1001'
    )

    # Get all currently configured DoH servers
    $dohServers = Get-DnsClientDohServerAddress -ErrorAction SilentlyContinue

    if (-not $dohServers) {
        Write-Host "No DoH servers configured. Nothing to harden."
        return
    }

    foreach ($server in $dohServers) {
        $addr = $server.ServerAddress

        if (-not ($allowedServers -contains $addr)) {
            Write-Host "Removing non-Cloudflare DoH server: $addr"

            try {
                # Remove this DoH server from the active configuration
                Remove-DnsClientDohServerAddress -ServerAddress $addr -ErrorAction SilentlyContinue
            }
            catch {
                Write-Host "Failed to remove DoH server $addr (it may already be gone)."
            }
        }
        else {
            Write-Host "Keeping Cloudflare DoH server: $addr"
        }
    }

    Write-Host "DoH hardening complete. Only Cloudflare resolvers remain."

}
catch {
    Write-Error $_
    exit 1
}
