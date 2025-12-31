# Takes in a domain name, adds it to etc/hosts with the IP as 0.0.0.0
param(
    [Parameter(Mandatory = $true)]
    [string]$Domain
)

$ErrorActionPreference = "Stop"

# Path to Windows Hosts file
$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$blockIp = "0.0.0.0"
$newEntry = "$blockIp`t$Domain"

try {
    # 1. Read existing content. 
    # wrapping in @(...) ensures it is ALWAYS treated as an array, 
    # even if the file is empty or has only 1 line.
    $content = @(Get-Content -Path $hostsPath)
    
    $newContent = @()
    $found = $false

    # 2. Iterate through lines to rebuild the file
    foreach ($line in $content) {
        $trimmed = $line.Trim()
        
        # Check if this line is active (not a comment) and contains our domain
        # Regex explanation:
        # \s+       -> One or more spaces (after the IP)
        # $Domain   -> The domain we are looking for (Escaped for safety)
        # (\s|#|$)  -> Followed by whitespace, a comment #, or end of line
        if ($trimmed -notlike "#*" -and $line -match "\s+$([Regex]::Escape($Domain))(\s|#|$)") {
            # We found the domain. Replace this line with our blocked entry.
            $newContent += $newEntry
            $found = $true
        }
        else {
            # Keep the line exactly as it was
            $newContent += $line
        }
    }

    # 3. If we didn't find the domain in the loop, append it now
    if (-not $found) {
        # Ensure we don't append to a line without a newline char
        if ($newContent.Count -gt 0 -and $newContent[-1].Length -gt 0) {
            $newContent += "" # Add an empty line spacing if needed
        }
        $newContent += $newEntry
    }

    # 4. Write back to file with RETRY logic
    # Rapid writes to system files can cause locking issues. We retry up to 5 times.
    $maxRetries = 5
    $retryDelayMs = 200
    
    for ($i = 1; $i -le $maxRetries; $i++) {
        try {
            # Set-Content automatically handles writing array elements to new lines
            $newContent | Set-Content -Path $hostsPath -Encoding UTF8 -Force -ErrorAction Stop
            Write-Host "Successfully blocked $Domain"
            break # Write successful, exit the retry loop
        }
        catch {
            # If it's the last attempt, bubble the error up to the main catch block
            if ($i -eq $maxRetries) { throw $_ }
            
            # Otherwise wait a bit and try again
            Start-Sleep -Milliseconds $retryDelayMs
        }
    }

}
catch {
    # Simple error handling
    if ($_.Exception.Message -like "*Access to the path*denied*") {
        Write-Warning "ACCESS DENIED: Please run this script as Administrator."
    }
    else {
        Write-Error $_.Exception.Message
    }
    exit 1
}