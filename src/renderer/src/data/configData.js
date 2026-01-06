export const configStructure = [
  {
    id: 'services',
    label: 'Services',
    description: 'Background Windows services that collect telemetry (data) or enable remote access.',
    children: [
      {
        id: 'DiagTrack',
        label: 'Disable User Experiences and Telemetry',
        description: 'The main telemetry (user data) service for Windows.'
      },
      {
        id: 'RemoteAccess',
        label: 'Disable Remote Access Connection Manager',
        description: 'Manages dial-up and VPN connections to this computer.'
      },
      {
        id: 'RemoteRegistry',
        label: 'Disable Remote Registry',
        description: 'Enables remote users to modify registry settings on this computer.'
      },
      {
        id: 'NetLogon',
        label: 'Disable NetLogon',
        description: 'Maintains a secure channel between this computer and the domain controller.'
      },
      {
        id: 'dmwappushservice',
        label: 'Disable WAP Push Service',
        description: 'Collects and forwards user data for certain Windows services.'
      },
      {
        id: 'WdiSystemHost',
        label: 'Disable Diagnostic System Host',
        description: 'Hosts diagnostic policies used to troubleshoot system issues.'
      },
      {
        id: 'WdiServiceHost',
        label: 'Disable Diagnostic Service Host',
        description: 'Runs diagnostic services.'
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
        label: 'Disable Telemetry',
        description: 'Controls how much diagnostic data Windows sends to Microsoft.'
      },
      {
        id: 'Enabled',
        label: 'Disable Advertising ID',
        description: 'Unique ID used by apps to deliver personalized ads.'
      },
      {
        id: 'NumberOfSIUFInPeriod',
        label: 'Disable Feedback Notifications',
        description: 'Controls how often Windows asks for feedback.'
      },
      {
        id: 'AllowCortana',
        label: 'Disable Cortana',
        description: 'Disables Cortana voice assistant integration.'
      },
      {
        id: 'TailoredExperiencesWithDiagnosticDataEnabled',
        label: 'Disable Tailored Experiences',
        description:
          'Prevents Microsoft from using diagnostic data to offer personalized tips and ads.'
      },
      {
        id: 'RestrictImplicitTextCollection',
        label: 'Prevent Text Collection',
        description: 'Prevents Windows from collecting text you type to improve prediction.'
      },
      {
        id: 'RestrictImplicitInkCollection',
        label: 'Prevent Ink Collection',
        description: 'Prevents Windows from collecting handwriting data.'
      },
      {
        id: 'HarvestContacts',
        label: 'Prevent Contact Harvesting',
        description: 'Prevents Windows from scanning contacts for speech/typing personalization.'
      },
      {
        id: 'EnableActivityFeed',
        label: 'Disable Activity Feed',
        description: 'Disables the "Timeline" feature.'
      },
      {
        id: 'PublishUserActivities',
        label: 'Prevent Publishing Activities',
        description: 'Prevents syncing activities to the cloud.'
      },
      {
        id: 'UploadUserActivities',
        label: 'Prevent Uploading Activities',
        description: 'Prevents uploading activity history.'
      },
      {
        id: 'BingSearchEnabled',
        label: 'Disable Bing Search',
        description: 'Disables Bing web results in the Start Menu.'
      },
      {
        id: 'CortanaConsent',
        label: 'Revoke Cortana Consent',
        description: 'Revokes consent for Cortana data collection.'
      },
      {
        id: 'AllowCrossDeviceClipboard',
        label: 'Disable Clipboard Sync',
        description: 'Disables cloud syncing of clipboard content between devices.'
      }
    ]
  },
  {
    id: 'scheduled_tasks',
    label: 'Scheduled Tasks',
    description: 'Tasks scheduled to run periodically that collect data.',
    children: [
      { id: 'DmClient', label: 'Disable DmClient', description: 'Sends usage data to Microsoft.' },
      {
        id: 'DmClientOnScenarioDownload',
        label: 'Disable DmClient Scenario',
        description: 'Related to Feedback Hub telemetry.'
      },
      {
        id: 'Consolidator',
        label: 'Disable CEIP Collector',
        description: 'Customer Experience Improvement Program data collector.'
      },
      { id: 'UsbCeip', label: 'Disable USB CEIP', description: 'Collects statistics on USB device usage.' },
      {
        id: 'QueueReporting',
        label: 'Disable Error Reporting',
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
        label: 'Disable Geolocation Service',
        description: 'Monitors current location of the system.'
      },
      {
        id: 'SensorService',
        label: 'Disable Sensor Service',
        description: 'Manages various sensors (GPS, etc.)'
      },
      {
        id: 'DisableLocation',
        label: 'Disable Global Location',
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
        label: 'Revoke UWP Location Consent',
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
        label: 'Revoke Webcam Access (Registry)',
        description: 'Prevents apps from accessing the webcam.'
      },
      {
        id: 'MicrophoneConsent',
        label: 'Revoke Microphone Access (Registry)',
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
      { id: 'Wi-Fi', label: 'Enable Secure DNS for Wi-Fi', description: 'Apply secure DNS to Wi-Fi adapter.' },
      {
        id: 'Ethernet',
        label: 'Enable Secure DNS for Ethernet',
        description: 'Apply secure DNS to Ethernet adapter.'
      },
      {
        id: 'DoH',
        label: 'Encrypt DNS through HTTPS',
        description:
          'Sends DNS lookups over encrypted HTTPS instead of plain text, preventing local networks from seeing or tampering with them.'
      },
      {
        id: 'DoH-Hardening',
        label: 'Enforce Encrypted DNS through HTTPS',
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
        description: 'Redirects telemetry (user data) domains to IP 0.0.0.0'
      }
    ]
  }
]