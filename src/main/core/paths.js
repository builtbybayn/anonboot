import path from 'node:path'
import { app } from 'electron'

// This objects a bit ugly but it gets the job done, the scripts.js files functions all refer to the paths from here
// At the top of scripts.js we set const paths = getPaths() so it has access to this object through that.
// It is a function becasue I wanted to add logic to export the correct path depending on if its running in dev or production.

// Old getScriptsRoot function (commented out)
/*
function getScriptsRoot() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "scripts")
    : path.join(app.getAppPath(), "resources", "scripts");
}
*/

// New getScriptsRoot function
function getScriptsRoot() {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'scripts')
    : path.join(app.getAppPath(), 'src', 'main', 'core', 'scripts')
}

function getUserDataRoot() {
  return app.getPath('userData')
}

export default function getPaths() {
  const scriptsRoot = getScriptsRoot()
  const userDataRoot = getUserDataRoot()

  const script = (...p) => path.join(scriptsRoot, ...p)

  const SNAP = path.join(userDataRoot, 'snapshots.json')
  const STATE = path.join(userDataRoot, 'state.json')

  return {
    // roots
    scriptsRoot,
    userDataRoot,

    // capture files (THIS is what you asked for)
    SNAP,
    STATE,

    // scripts
    services: {
      detect: script('Processes', 'detect.ps1'),
      apply: script('Processes', 'apply.ps1'),
      revert: script('Processes', 'revert.ps1')
    },

    registry: {
      detect: script('Registry', 'detect_registry.ps1'),
      apply: script('Registry', 'apply_registry.ps1'),
      revert: script('Registry', 'revert_registry.ps1')
    },

    scheduled: {
      detect: script('Scheduled', 'detect_scheduled.ps1'),
      apply: script('Scheduled', 'apply_scheduled.ps1'),
      revert: script('Scheduled', 'revert_scheduled.ps1')
    },

    dns: {
      detect: script('DNS', 'detect_dns.ps1'),
      apply: script('DNS', 'apply_dns.ps1'),
      revert: script('DNS', 'revert_dns.ps1'),
      flush: script('DNS', 'flush_dns.ps1'),

      dohDetect: script('DNS', 'DoH', 'detect_doh.ps1'),
      dohApply: script('DNS', 'DoH', 'apply_doh.ps1'),
      dohRevert: script('DNS', 'DoH', 'revert_doh.ps1'),

      dohHardenDetect: script('DNS', 'DoH', 'detect_doh_harden.ps1'),
      dohHardenApply: script('DNS', 'DoH', 'apply_doh_harden.ps1'),
      dohHardenRevert: script('DNS', 'DoH', 'revert_doh_harden.ps1')
    },

    firewall: {
      detectEndpoint: script('Firewall', 'detect_firewall_endpoint.ps1'),
      applyEndpoint: script('Firewall', 'apply_firewall_endpoint.ps1'),
      revertEndpoint: script('Firewall', 'revert_firewall_endpoint.ps1')
    },

    hosts: {
      detect: script('Hosts', 'detect_hosts.ps1'),
      apply: script('Hosts', 'apply_hosts.ps1'),
      revert: script('Hosts', 'revert_hosts.ps1')
    },

    devices: {
      detect: script('Devices', 'detect_devices.ps1'),
      apply: script('Devices', 'apply_devices.ps1'),
      revert: script('Devices', 'revert_devices.ps1')
    }
  }
}
