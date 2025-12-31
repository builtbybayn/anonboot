# This detect asks windows for any devices that are of the Camera or AudioEndpoint class and takes a snapshot of their instanceID, name, class, status, isCamera, and isMicrophone
# It snapshots all devices that fit this and doesnt take in any parameters This way apply can disable them individually or it can disable all

param()

$ProgressPreference = 'SilentlyContinue'

try {
    $all = Get-PnpDevice -ErrorAction Stop

    $devices = foreach ($d in $all) {
        $class = $d.Class
        $name = $d.FriendlyName

        if (-not $name) { continue }

        $isCamera =
        ($class -eq 'Camera' -or $class -eq 'Image' -or $name -match '(?i)camera|webcam')

        $isMic =
        ($class -eq 'AudioEndpoint' -and $name -match '(?i)microphone|headset')

        if (-not ($isCamera -or $isMic)) {
            continue
        }

        [pscustomobject]@{
            instanceId   = $d.InstanceId
            name         = $name
            class        = $class
            status       = $d.Status   # e.g. OK, Disabled
            isCamera     = $isCamera
            isMicrophone = $isMic
        }
    }

    if (-not $devices) {
        $devices = @()
    }

    $json = $devices | ConvertTo-Json -Compress

    [Console]::Out.WriteLine('[[AB_JSON:START]]')
    [Console]::Out.WriteLine($json)
    [Console]::Out.WriteLine('[[AB_JSON:END]]')
}
catch {
    Write-Error $_
    exit 1
}
