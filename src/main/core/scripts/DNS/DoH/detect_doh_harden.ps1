# This will detect the servers set that your machine can potentially fallback on or resolve IPV6 with.
# This is a security risk as these servers communicate with the DNS servers in plain text that anybody on your network can read.
# A snapshot of ALL entries from Get-DnsClientDohServerAddress command is taken so that it can be reverted to for any reason or if DoH breaks smth

$ProgressPreference = 'SilentlyContinue'

try {
    # Get all configured DoH servers on the system
    $dohServers = Get-DnsClientDohServerAddress -ErrorAction SilentlyContinue

    $list = @()

    if ($dohServers) {
        foreach ($server in $dohServers) {
            $list += [pscustomobject]@{
                serverAddress = $server.ServerAddress
                dohTemplate   = $server.DohTemplate
                autoUpgrade   = [bool]$server.AutoUpgrade
                udpFallback   = [bool]$server.AllowFallbackToUdp
            }
        }
    }

    $obj = @{
        servers = $list
    }

    [Console]::Out.WriteLine('[[AB_JSON:START]]')
    [Console]::Out.WriteLine(($obj | ConvertTo-Json -Compress))
    [Console]::Out.WriteLine('[[AB_JSON:END]]')
}
catch {
    Write-Error $_
    exit 1
}
