# This script detects whether or not there is a DoH template that exists for cloudfare server addresses. THis will let us know if we need to create on eor not and if what to revert to.

$ProgressPreference = 'SilentlyContinue'

try {
    # Run netsh to show DNS encryption config and capture as text
    $encText = netsh dns show encryption | Out-String

    # Detect whether Cloudflare IPs have any encryption config at all
    $has11 = $false
    $has10 = $false

    if ($encText -match '1\.1\.1\.1') {
        $has11 = $true
    }

    if ($encText -match '1\.0\.0\.1') {
        $has10 = $true
    }

    $obj = @{
        cloudflare11Configured = $has11
        cloudflare10Configured = $has10
    }

    [Console]::Out.WriteLine('[[AB_JSON:START]]')
    [Console]::Out.WriteLine(($obj | ConvertTo-Json -Compress))
    [Console]::Out.WriteLine('[[AB_JSON:END]]')
}
catch {
    Write-Error $_
    exit 1
}
