export const listOfServices = [
  'DiagTrack',
  'RemoteAccess',
  'RemoteRegistry',
  'NetLogon',
  'dmwappushservice',
  'WdiSystemHost',
  'WdiServiceHost'
]

export const listOfRegistry = [
  {
    name: 'AllowTelemetry',
    path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection',
    desired: { type: 'DWord', value: 0 }
  },
  {
    name: 'Enabled', // Advertising ID
    path: 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo',
    desired: { type: 'DWord', value: 0 }
  },
  {
    name: 'NumberOfSIUFInPeriod',
    path: 'HKCU:\SOFTWARE\Microsoft\Siuf\Rules',
    desired: { type: 'DWord', value: 0 }
  },
  {
    name: 'AllowCortana',
    path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\Windows Search',
    desired: { type: 'DWord', value: 0 }
  },
  //Paranoid mode: { name: 'AllowSearchToUseLocation', path: 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search', desired: { type: 'DWord', value: 0 }},
  {
    name: 'TailoredExperiencesWithDiagnosticDataEnabled',
    path: 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Privacy',
    desired: { type: 'DWord', value: 0 }
  },
  {
    name: 'RestrictImplicitTextCollection',
    path: 'HKCU:\\SOFTWARE\\Microsoft\\InputPersonalization',
    desired: { type: 'DWord', value: 1 }
  },
  {
    name: 'RestrictImplicitInkCollection',
    path: 'HKCU:\\SOFTWARE\\Microsoft\\InputPersonalization',
    desired: { type: 'DWord', value: 1 }
  },
  {
    name: 'HarvestContacts', // Disable speech & typing personalization
    path: 'HKCU:\\SOFTWARE\\Microsoft\\InputPersonalization\\TrainedDataStore',
    desired: { type: 'DWord', value: 0 }
  },
  //Paranoid: { name: 'Start_TrackProgs',  // Disable app launch tracking path: 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced', desired: { type: 'DWord', value: 0 }}

  // ---- Activity History / Timeline kill (Next 3 entries) ----
  {
    name: 'EnableActivityFeed',
    path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System',
    desired: { type: 'DWord', value: 0 }
  },
  {
    name: 'PublishUserActivities',
    path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System',
    desired: { type: 'DWord', value: 0 }
  },
  {
    name: 'UploadUserActivities',
    path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System',
    desired: { type: 'DWord', value: 0 }
  },

  //Search privacy (Next two entries and possible AllowSearchToUseLocation cna be added as well)
  {
    name: 'BingSearchEnabled',
    path: 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search',
    desired: { type: 'DWord', value: 0 } // 0 = no Bing integration
  },
  {
    name: 'CortanaConsent',
    path: 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Search',
    desired: { type: 'DWord', value: 0 } // 0 = no Cortana/cloud search
  },

  // ---- Disable Clipboard Cloud Sync ----
  {
    name: 'AllowCrossDeviceClipboard',
    path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System',
    desired: { type: 'DWord', value: 0 } // 0 = Disable cross-device clipboard
  }
  /*
    // Paranoid:
    {
        name: 'EnableClipboardHistory',
        path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System',
        desired: { type: 'DWord', value: 0 },  // 0 = Disable clipboard history (optional but recommended)
    },

    //Paranoid Disable Shared Experiences, does not allow for cross device apps to sync:
    // ---- Disable Shared Experiences / Cross Device Sync ----
    {
       name: 'EnableCdp',
        path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System',
        desired: { type: 'DWord', value: 0 }, // Disable Microsoft Connected Devices Platform
    },
    {
        name: 'EnableCdpUserAuth',
        path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\System',
        desired: { type: 'DWord', value: 0 }, // Disable user auth for CDP
    },


    //Paranoid Disable WiFi Sense, (Hotspot Sharing) which allows windows to autoconnect to open networks.
    //Downside is user must manually join known networks
    // ---- Disable Wi-Fi Sense / Hotspot Sharing ----
    {
        name: 'AutoConnectAllowedOEM',
        path: 'HKLM:\\SOFTWARE\\Microsoft\\WcmSvc\\wifinetworkmanager\\config',
        desired: { type: 'DWord', value: 0 },
    },
    {
        name: 'AllowWiFiHotSpotReporting',
        path: 'HKLM:\\SOFTWARE\\Microsoft\\WcmSvc\\wifinetworkmanager\\config',
        desired: { type: 'DWord', value: 0 },
    },
    {
        name: 'WiFiSenseAllowed',
        path: 'HKLM:\\SOFTWARE\\Microsoft\\WcmSvc\\wifinetworkmanager\\config',
        desired: { type: 'DWord', value: 0 },
    },
    */
]

export const listOfScheduledTasks = [
  {
    name: 'DmClient',
    path: '\\Microsoft\\Windows\\Feedback\\Siuf\\'
  },
  {
    name: 'DmClientOnScenarioDownload',
    path: '\\Microsoft\\Windows\\Feedback\\Siuf\\'
  },

  // Customer Experience Improvement Program (CEIP)
  {
    name: 'Consolidator',
    path: '\\Microsoft\\Windows\\Customer Experience Improvement Program\\'
  },
  {
    name: 'UsbCeip',
    path: '\\Microsoft\\Windows\\Customer Experience Improvement Program\\'
  },

  /* SKITZO Tasks, pose very low risk to actual important data:
    // Application Experience / Compatibility / Telemetry
    {    name: 'Microsoft Compatibility Appraiser',   path: '\\Microsoft\\Windows\\Application Experience\\'},
    {name: 'ProgramDataUpdater', path: '\\Microsoft\\Windows\\Application Experience\\' },

    // Disk diagnostics / telemetry
    {  name: 'Microsoft-Windows-DiskDiagnosticDataCollector',path: '\\Microsoft\\Windows\\DiskDiagnostic\\' },

    // Power efficiency diagnostics (optional, low impact)
    {  name: 'AnalyzeSystem', path: '\\Microsoft\\Windows\\Power Efficiency Diagnostics\\'
    },
    {name: 'AnalyzeEnergyUsage',path: '\\Microsoft\\Windows\\Power Efficiency Diagnostics\\'},
    */

  {
    name: 'QueueReporting',
    path: '\\Microsoft\\Windows\\Windows Error Reporting\\'
  }
]

export const listOfDNSInterfaces = ['Wi-Fi', 'Ethernet']

export const listOfFirewallEndpoints = [
  'vortex.data.microsoft.com',
  'settings-win.data.microsoft.com',
  'v10.events.data.microsoft.com',
  'telemetry.microsoft.com',
  'watson.telemetry.microsoft.com',
  'watson.microsoft.com',
  'oca.telemetry.microsoft.com',
  'eu-v10.events.data.microsoft.com',
  'us-v10.events.data.microsoft.com',
  'adl.windows.com',
  'ads.msn.com',
  'adnxs.com',
  'scorecardresearch.com',
  'c.msn.com'
]

export const listOfFirewallEndpointsParanoid = [
  ...listOfFirewallEndpoints,
  'ceus.watson.microsoft.com',
  'ceus2.watson.microsoft.com',
  'sls.update.microsoft.com.akadns.net',
  'fe2.update.microsoft.com.akadns.net',
  'storeedgefd.dsx.mp.microsoft.com',
  'df.telemetry.microsoft.com'
]

export const listOfDomainsForHosts = [
  'vortex.data.microsoft.com',
  'watson.microsoft.com',
  'watson.telemetry.microsoft.com',
  'telemetry.microsoft.com',
  'telecommand.telemetry.microsoft.com',
  'settings-win.data.microsoft.com',
  'vortex-win.data.microsoft.com'
]

export const locationSettings = {
  services: ['lfsvc', 'SensorService'],
  registry: [
    {
      name: 'DisableLocation',
      path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors',
      desired: { type: 'DWord', value: 1 }
    },
    // Disable all sensors (optional, more aggressive)
    {
      name: 'DisableSensors',
      path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors',
      desired: { type: 'DWord', value: 1 }
    },
    // Disable Windows location provider
    {
      name: 'DisableWindowsLocationProvider',
      path: 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\LocationAndSensors',
      desired: { type: 'DWord', value: 1 }
    },
    //Kill location for UWP (Universal Windows Platform) apps
    {
      id: 'LocationConsent',
      name: 'Value',
      path: 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\location',
      desired: { type: 'String', value: 'Deny' }
    }
  ]
}

//This complements disabling the devices drivers with the devices scripts
export const registryDevices = [
  //Webcam
  {
    id: 'WebcamConsent',
    name: 'Value',
    path: 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\webcam',
    desired: { type: 'String', value: 'Deny' }
  },

  //Microphone
  {
    id: 'MicrophoneConsent',
    name: 'Value',
    path: 'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\CapabilityAccessManager\\ConsentStore\\microphone',
    desired: { type: 'String', value: 'Deny' }
  }
]

// TODO: Call these new configs with detect, apply and revert next to the other devices function in scripts.js
// These scripts block the OS permissions for the webcam and micropone classes. So call them below the devices call. Yahurhd
