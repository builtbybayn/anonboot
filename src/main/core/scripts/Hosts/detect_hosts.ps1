# This takes in a domain name and checks whether or not it exists in etc/hosts, and if so, what the IP is set to.
# sends a JSON to stdout of the domain, present, ip, lineindex, and full line.

param(
    [Parameter(Mandatory = $true)]
    [string]$Domain
)

$ProgressPreference = 'SilentlyContinue'

try {
    # Standard Windows hosts file path
    $hostsPath = Join-Path $env:SystemRoot "System32\drivers\etc\hosts"

    if (-not (Test-Path $hostsPath)) {
        throw "Hosts file not found at $hostsPath"
    }

    $lines = Get-Content -Path $hostsPath -ErrorAction Stop

    $found = $false
    $ip = $null
    $lineIndex = $null
    $rawLine = $null

    for ($i = 0; $i -lt $lines.Count; $i++) {
        # Force plain string, not PSObject with metadata
        $line = [string]$lines[$i]
        $trimmed = $line.Trim()

        # Skip empty or comment-only lines
        if ([string]::IsNullOrWhiteSpace($trimmed) -or $trimmed.StartsWith('#')) {
            continue
        }

        # Strip inline comments (everything after '#')
        $noComment = $trimmed.Split('#')[0].Trim()
        if ([string]::IsNullOrWhiteSpace($noComment)) {
            continue
        }

        # Split by whitespace: first token = IP, rest = hostnames
        $parts = $noComment -split '\s+'
        if ($parts.Count -lt 2) {
            continue
        }

        $candidateIp = $parts[0]
        $candidateHosts = $parts[1..($parts.Count - 1)]

        if ($candidateHosts -contains $Domain) {
            $found = $true
            $ip = $candidateIp
            $lineIndex = $i
            $rawLine = $line   # already forced to [string]
            break
        }
    }

    $obj = @{
        domain    = $Domain
        present   = $found
        ip        = $ip
        lineIndex = $lineIndex
        rawLine   = $rawLine
    }

    [Console]::Out.WriteLine('[[AB_JSON:START]]')
    [Console]::Out.WriteLine(($obj | ConvertTo-Json -Compress))
    [Console]::Out.WriteLine('[[AB_JSON:END]]')
}
catch {
    Write-Error $_
    exit 1
}
