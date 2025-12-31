# This sets up DoH with cloudfare. The way DNS over HTTPS works is that it sends the DNS request as a query to the cloudflare site: https://cloudflare-dns.com/dns-query
# This then fowards that request to the resolver. It is shaped as a site so that it can resolve it over HTTPS.

$ProgressPreference = 'SilentlyContinue'

try {
    # Cloudflare DoH template URL
    $cloudflareTemplate = 'https://cloudflare-dns.com/dns-query'

    Write-Host "Configuring DNS-over-HTTPS profiles for Cloudflare..."

    #
    # 1) Configure DoH for 1.1.1.1
    #
    try {
        netsh dns add encryption `
            server=1.1.1.1 `
            dohtemplate=$cloudflareTemplate `
            autoupgrade=yes `
            udpfallback=no `
        | Out-Null
    }
    catch {
        # If entry already exists or netsh complains, we ignore and move on
        Write-Host "DoH profile for 1.1.1.1 may already exist or could not be modified. Continuing..."
    }

    #
    # 2) Configure DoH for 1.0.0.1
    #
    try {
        netsh dns add encryption `
            server=1.0.0.1 `
            dohtemplate=$cloudflareTemplate `
            autoupgrade=yes `
            udpfallback=no `
        | Out-Null
    }
    catch {
        Write-Host "DoH profile for 1.0.0.1 may already exist or could not be modified. Continuing..."
    }

    Write-Host "Cloudflare DoH configuration applied."

}
catch {
    Write-Error $_
    exit 1
}
