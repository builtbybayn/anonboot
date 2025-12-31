export const configStructure = [
  {
    id: 'services',
    label: 'Services',
    description: 'Background Windows services that collect telemetry or enable remote access.',
    children: [
      {
        id: 'DiagTrack',
        label: 'Connected User Experiences and Telemetry',
        description: 'The main telemetry service for Windows.'
      },
      {
        id: 'RemoteAccess',
        label: 'Remote Access Connection Manager',
        description: 'Manages dial-up and VPN connections to this computer.'
      },
      {
        id: 'RemoteRegistry',
        label: 'Remote Registry',
        description: 'Enables remote users to modify registry settings on this computer.'
      },
      {
        id: 'NetLogon',
        label: 'NetLogon',
        description: 'Maintains a secure channel between this computer and the domain controller.'
      },
      {
        id: 'dmwappushservice',
        label: 'WAP Push Message Routing Service',
        description: 'Collects and forwards telemetry data.'
      },
      {
        id: 'WdiSystemHost',
        label: 'Diagnostic System Host',
        description: 'Hosts diagnostic policy service.'
      },
      {
        id: 'WdiServiceHost',
        label: 'Diagnostic Service Host',
        description: 'Hosts diagnostics that need to run in a local service context.'
      }
    ]
  },
  {
    id: 'registry',
    label: 'Registry Privacy',
    description: 'Registry keys that control Windows data collection and privacy settings.',
    children: [
      {
        id: 'AllowTelemetry',
        label: 'Allow Telemetry',
        description: 'Controls the level of diagnostic data sent to Microsoft.'
      },
      {
        id: 'Enabled',
        label: 'Advertising ID',
        description: 'Unique ID used by apps to target ads.'
      },
      {
        id: 'NumberOfSIUFInPeriod',
        label: 'Feedback Notifications',
        description: 'Controls how often Windows asks for feedback.'
      },
      {
        id: 'AllowCortana',
        label: 'Cortana',
        description: 'Disables Cortana voice assistant integration.'
      },
      {
        id: 'TailoredExperiencesWithDiagnosticDataEnabled',
        label: 'Tailored Experiences',
        description:
          'Prevents Microsoft from using diagnostic data to offer personalized tips and ads.'
      },
      {
        id: 'RestrictImplicitTextCollection',
        label: 'Text Collection',
        description: 'Prevents Windows from collecting text you type to improve prediction.'
      },
      {
        id: 'RestrictImplicitInkCollection',
        label: 'Ink Collection',
        description: 'Prevents Windows from collecting handwriting data.'
      },
      {
        id: 'HarvestContacts',
        label: 'Harvest Contacts',
        description: 'Prevents Windows from scanning contacts for speech/typing personalization.'
      },
      {
        id: 'EnableActivityFeed',
        label: 'Activity Feed',
        description: 'Disables the "Timeline" feature.'
      },
      {
        id: 'PublishUserActivities',
        label: 'Publish Activities',
        description: 'Prevents syncing activities to the cloud.'
      },
      {
        id: 'UploadUserActivities',
        label: 'Upload Activities',
        description: 'Prevents uploading activity history.'
      },
      {
        id: 'BingSearchEnabled',
        label: 'Bing Search',
        description: 'Disables Bing web results in the Start Menu.'
      },
      {
        id: 'CortanaConsent',
        label: 'Cortana Consent',
        description: 'Revokes consent for Cortana data collection.'
      },
      {
        id: 'AllowCrossDeviceClipboard',
        label: 'Clipboard Sync',
        description: 'Disables cloud syncing of clipboard content between devices.'
      }
    ]
  },
  {
    id: 'scheduled_tasks',
    label: 'Scheduled Tasks',
    description: 'Tasks scheduled to run periodically that collect data.',
    children: [
      { id: 'DmClient', label: 'DmClient', description: 'Sends usage data to Microsoft.' },
      {
        id: 'DmClientOnScenarioDownload',
        label: 'DmClient Scenario',
        description: 'Related to Feedback Hub telemetry.'
      },
      {
        id: 'Consolidator',
        label: 'CEIP Consolidator',
        description: 'Customer Experience Improvement Program data collector.'
      },
      { id: 'UsbCeip', label: 'USB CEIP', description: 'Collects statistics on USB device usage.' },
      {
        id: 'QueueReporting',
        label: 'Error Reporting',
        description: 'Queues and sends Windows Error Reports.'
      }
    ]
  },
  {
    id: 'location',
    label: 'Location',
    description: 'Controls location services and sensors.',
    children: [
      {
        id: 'lfsvc',
        label: 'Geolocation Service',
        description: 'Monitors current location of the system.'
      },
      {
        id: 'SensorService',
        label: 'Sensor Service',
        description: 'Manages various sensors (GPS, etc.)'
      },
      {
        id: 'DisableLocation',
        label: 'Global Location Disable',
        description: 'Registry policy to disable all location features.'
      },
      {
        id: 'DisableSensors',
        label: 'Disable Sensors',
        description: 'Registry policy to disable sensors.'
      },
      {
        id: 'DisableWindowsLocationProvider',
        label: 'Disable Windows Location Provider',
        description: 'Prevents Windows from using Wi-Fi/IP for location.'
      },
      {
        id: 'LocationConsent',
        label: 'UWP Location Consent',
        description: 'Blocks location access for Universal Windows Apps.'
      }
    ]
  },
  {
    id: 'devices',
    label: 'Devices',
    description: 'Controls access to hardware devices like Camera and Microphone.',
    children: [
      {
        id: 'WebcamConsent',
        label: 'Webcam Access (Registry)',
        description: 'Prevents apps from accessing the webcam.'
      },
      {
        id: 'MicrophoneConsent',
        label: 'Microphone Access (Registry)',
        description: 'Prevents apps from accessing the microphone.'
      }
      // Dynamic hardware devices will be injected here at runtime
    ]
  },
  {
    id: 'dns',
    label: 'DNS Settings',
    description: 'Configure network interfaces to use privacy-focused DNS.',
    children: [
      { id: 'Wi-Fi', label: 'Wi-Fi Interface', description: 'Apply secure DNS to Wi-Fi adapter.' },
      {
        id: 'Ethernet',
        label: 'Ethernet Interface',
        description: 'Apply secure DNS to Ethernet adapter.'
      },
      {
        id: 'DoH',
        label: 'Use DoH',
        description:
          'Sends DNS lookups over encrypted HTTPS instead of plain text, preventing local networks from seeing or tampering with them.'
      },
      {
        id: 'DoH-Hardening',
        label: 'DoH Hardening',
        description: 'Enforces strict DoH usage, preventing fallback to plain text DNS.'
      }
    ]
  },
  {
    id: 'firewall',
    label: 'Firewall Rules',
    description: 'Block connections to known Microsoft telemetry servers.',
    children: [
      {
        id: 'telemetry_hosts',
        label: 'Block Telemetry Domains',
        description: 'Blocks a list of known Microsoft data collection domains via Firewall.'
      }
    ]
  },
  {
    id: 'hosts',
    label: 'Hosts File',
    description: 'System-wide domain blocking via the hosts file.',
    children: [
      {
        id: 'block_hosts',
        label: 'Block Microsoft Hosts',
        description: 'Redirects telemetry domains to localhost (0.0.0.0).'
      }
    ]
  }
]
