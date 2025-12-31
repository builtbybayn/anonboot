# This script has three options of levels it can flush. You can pass in an optional argument of 'Safe' or 'Paranoid' to do the respective flushes, otherwise it defaults to 'Regular'


param(
    [ValidateSet('Safe', 'Regular', 'Paranoid')]
    [string]$FlushSetting = 'Regular'
)

$ProgressPreference = 'SilentlyContinue'

Write-Host "DNS Flush mode: $FlushSetting"

try {
    switch ($FlushSetting) {

        'Safe' {
            Write-Host "[SAFE] Flushing DNS client cache and IP config cache..."

            # Flush Windows DNS client cache
            Clear-DnsClientCache

            # Flush IP stack DNS cache
            ipconfig /flushdns | Out-Null

            Write-Host "[SAFE] DNS flush complete."
        }

        'Regular' {
            Write-Host "[REGULAR] Flushing DNS caches and restarting DNS Client service..."

            # Flush caches
            Clear-DnsClientCache
            ipconfig /flushdns | Out-Null

            # Restart DNS client service for a clean state
            Restart-Service -Name Dnscache -Force -ErrorAction SilentlyContinue

            Write-Host "[REGULAR] DNS flush + DNS Client restart complete."
        }

        'Paranoid' {
            Write-Host "[PARANOID] Performing full DNS hygiene (this may close browsers and reset networking)..."

            # 1) Flush caches
            Clear-DnsClientCache
            ipconfig /flushdns | Out-Null

            # 2) Restart DNS client service
            Restart-Service -Name Dnscache -Force -ErrorAction SilentlyContinue

            # 3) Reset Winsock (requires admin, may prompt for reboot to fully apply)
            Write-Host "[PARANOID] Resetting Winsock catalog..."
            netsh winsock reset | Out-Null

            # 4) Kill common browsers to clear their internal DNS caches
            $browsers = @('chrome', 'msedge', 'firefox', 'brave', 'opera')
            foreach ($b in $browsers) {
                Write-Host "[PARANOID] Attempting to close browser: $b"
                Stop-Process -Name $b -Force -ErrorAction SilentlyContinue
            }

            Write-Host "[PARANOID] Full paranoid DNS/network flush complete. You may want to reboot for Winsock reset to fully apply."
        }
    }

}
catch {
    Write-Error $_
    exit 1
}
