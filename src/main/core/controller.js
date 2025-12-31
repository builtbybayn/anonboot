import * as scripts from './scripts.js'
import * as config from './settingsToConfigure.js'
import * as history from './history.js'
import getPaths from './paths.js'
import { readFile } from 'fs/promises'

const paths = getPaths()

/*
This is a central logic hub API for the frontend. We dont need the frontend to be "smart", we actually want it dumb so thatbackend changes are not breaking. The toggleSetting function
allows us to call any apply and revert function without needing to bridge all of them to the frontend 
*/
//config is setttingsToConfigure
export const getSchema = () => {
  return {
    services: config.listOfServices,
    registry: config.listOfRegistry,
    scheduled: config.listOfScheduledTasks,
    firewall: config.listOfFirewallEndpoints,
    hosts: config.listOfDomainsForHosts,
    location: config.locationSettings,
    devicesRegistry: config.registryDevices
  }
}

export const getState = async () => {
  try {
    const data = await readFile(paths.STATE, 'utf8')
    return JSON.parse(data)
  } catch (e) {
    console.error('Failed to read state file:', e)
    return {}
  }
}

export const handleUserToggle = async (category, id, value) => {
  // 1. Push action to history
  history.pushAction({ category, id, value, timestamp: Date.now() })

  // 2. Perform toggle
  await toggleSetting(category, id, value)

  // 3. Return updated counts
  return history.getCounts()
}

export const handleUndo = async () => {
  const action = history.popUndo()
  if (!action) return null

  // Invert value: If it was Secure (true), we Revert (false).
  const newValue = !action.value

  console.log(`Undoing: ${action.category} -> ${action.id} (Setting to ${newValue})`)

  await toggleSetting(action.category, action.id, newValue)

  // Push original action to redo stack
  history.pushRedo(action)

  return {
    counts: history.getCounts(),
    action: action
  }
}

export const handleRedo = async () => {
  const action = history.popRedo()
  if (!action) return null

  // Re-apply original value
  console.log(`Redoing: ${action.category} -> ${action.id} (Setting to ${action.value})`)

  await toggleSetting(action.category, action.id, action.value)

  // Push back to undo stack
  history.pushUndo(action)

  return {
    counts: history.getCounts(),
    action: action
  }
}

export const getHistoryCounts = () => {
  return history.getCounts()
}

export const toggleSetting = async (category, id, value) => {
  console.log(`Toggling ${category} -> ${id} to ${value ? 'SECURE' : 'DEFAULT'}`)

  // value = true  => Privacy Mode ON  (Apply / Disable Service / Block)
  // value = false => Privacy Mode OFF (Revert / Enable Service / Unblock)

  if (value) {
    // APPLY (Secure it)
    switch (category) {
      case 'services':
        return await scripts.applyService(id)
      case 'registry':
        const reg = config.listOfRegistry.find((r) => r.name === id)
        if (reg) return await scripts.applyRegistry(reg)
        break
      case 'scheduled_tasks':
        const task = config.listOfScheduledTasks.find((t) => t.name === id)
        if (task) return await scripts.applyTask(task)
        break
      case 'firewall':
        if (id === 'telemetry_hosts') {
          for (const ep of config.listOfFirewallEndpoints) {
            await scripts.applyFirewallEndpoint(ep)
          }
          return
        }
        return await scripts.applyFirewallEndpoint(id)
      case 'hosts':
        if (id === 'block_hosts') {
          for (const domain of config.listOfDomainsForHosts) {
            await scripts.applyDomain(domain)
          }
          return
        }
        return await scripts.applyDomain(id)
      case 'devices':
        const devReg = config.registryDevices.find((r) => (r.id || r.name) === id)
        if (devReg) return await scripts.applyDeviceRegistry(devReg)
        return await scripts.applyDeviceInstance(id)
      case 'location':
        if (config.locationSettings.services.includes(id)) {
          return await scripts.applyService(id) // Reusing applyService
        }
        const locReg = config.locationSettings.registry.find((r) => (r.id || r.name) === id)
        if (locReg) return await scripts.applyLocationRegistry(locReg)
        break
      case 'dns':
        if (id === 'DoH') {
          await scripts.applyDoh()
        } else if (id === 'DoH-Hardening') {
          await scripts.applyDohHardening()
        } else {
          await scripts.applyInterface(id)
        }
        return await scripts.applyFlushDnsRegular()
    }
  } else {
    // REVERT (Restore it)
    switch (category) {
      case 'services':
        return await scripts.revertService(id)
      case 'registry':
        const reg = config.listOfRegistry.find((r) => r.name === id)
        if (reg) return await scripts.revertRegistry(reg)
        break
      case 'scheduled_tasks':
        const task = config.listOfScheduledTasks.find((t) => t.name === id)
        if (task) return await scripts.revertTask(task)
        break
      case 'firewall':
        if (id === 'telemetry_hosts') {
          for (const ep of config.listOfFirewallEndpoints) {
            await scripts.revertFirewallEndpoint(ep)
          }
          return
        }
        return await scripts.revertFirewallEndpoint(id)
      case 'hosts':
        if (id === 'block_hosts') {
          for (const domain of config.listOfDomainsForHosts) {
            await scripts.revertDomain(domain)
          }
          return
        }
        return await scripts.revertDomain(id)
      case 'devices':
        const devReg = config.registryDevices.find((r) => (r.id || r.name) === id)
        if (devReg) return await scripts.revertDeviceRegistry(devReg)
        return await scripts.revertDeviceInstance(id)
      case 'location':
        if (config.locationSettings.services.includes(id)) {
          return await scripts.revertService(id)
        }
        const locReg = config.locationSettings.registry.find((r) => (r.id || r.name) === id)
        if (locReg) return await scripts.revertLocationRegistry(locReg)
        break
      case 'dns':
        if (id === 'DoH') {
          await scripts.revertDoh()
        } else if (id === 'DoH-Hardening') {
          await scripts.revertDohHardening()
        } else {
          await scripts.revertInterface(id)
        }
        return await scripts.applyFlushDnsRegular()
    }
  }
}