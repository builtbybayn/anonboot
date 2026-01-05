# This apply takes in either an InstanceId argument for a specific device to disable, OR takes in a mode, 'Camera' for all camera devices, 'Mic' for all microphone devices, and 'Both' for all
# This setup with the parameters allows for this to work in the UI to enable/disable a specific device and be super customizable OR for ease of use, disabling/enabling all of them


param(
    [ValidateSet('Camera', 'Mic', 'Both')]
    [string]$Mode,

    [string]$InstanceId
)

$ProgressPreference = 'SilentlyContinue'

function Get-AvDevices {
    $all = Get-PnpDevice -ErrorAction Stop

    foreach ($d in $all) {
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
            status       = $d.Status
            isCamera     = $isCamera
            isMicrophone = $isMic
        }
    }
}

try {
    # Per-device mode: if InstanceId is provided, ignore Mode
    if ($InstanceId) {
        $dev = Get-PnpDevice -InstanceId $InstanceId -ErrorAction SilentlyContinue
        if ($null -eq $dev) {
             Write-Error "Device not found."
             exit 1
        }

        Disable-PnpDevice -InstanceId $InstanceId -Confirm:$false -ErrorAction Stop
        return
    }

    if (-not $Mode) {
        Write-Error "Either -InstanceId or -Mode (Camera|Mic|Both) must be specified."
        exit 1
    }

    $devices = Get-AvDevices
    if (-not $devices) { return }

    $targets = switch ($Mode) {
        'Camera' { $devices | Where-Object { $_.isCamera } }
        'Mic' { $devices | Where-Object { $_.isMicrophone } }
        'Both' { $devices }
    }

    foreach ($dev in $targets) {
        try {
            Disable-PnpDevice -InstanceId $dev.instanceId -Confirm:$false -ErrorAction Stop
        }
        catch {
            # Ignore failures; keep going
        }
    }
}
catch {
    Write-Error $_
    exit 1
}
