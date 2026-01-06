import { app, net } from 'electron'
import fs from 'fs/promises'
import path from 'path'

const SUPPORT_JSON_URL = 'https://support.anonboot.app/support.json'
const CACHE_FILENAME = 'support-cache.json'
const THROTTLE_HOURS = 24

const getCachePath = () => path.join(app.getPath('userData'), CACHE_FILENAME)

const getDefaultDataPath = () => {
  if (app.isPackaged) {
    // In production with asarUnpack: resources/**
    // Files are in resources/app.asar.unpacked/resources/
    return path.join(app.getAppPath() + '.unpacked', 'resources', 'support-default.json')
  } else {
    // In development, app.getAppPath() is usually the project root
    return path.join(app.getAppPath(), 'resources', 'support-default.json')
  }
}

const validateSupportData = (data) => {
  if (!data || typeof data !== 'object') return false
  if (typeof data.version !== 'number') return false
  if (!Array.isArray(data.crypto) || data.crypto.length === 0) return false

  for (const item of data.crypto) {
    if (!item.assetId || !item.label) return false

    // Check for either direct address or networks array
    if (item.networks) {
      if (!Array.isArray(item.networks) || item.networks.length === 0) return false
      for (const net of item.networks) {
        if (!net.networkId || !net.address || typeof net.address !== 'string' || net.address.length < 10) return false
      }
    } else {
      if (!item.address || typeof item.address !== 'string' || item.address.length < 10) return false
    }
  }

  return true
}

export const getSupportData = async () => {
  const cachePath = getCachePath()

  // 1. Try Cache
  try {
    const cacheContent = await fs.readFile(cachePath, 'utf-8')
    const cache = JSON.parse(cacheContent)
    if (cache && cache.data && validateSupportData(cache.data)) {
      console.log('[Support] Serving from cache')
      return cache.data
    }
  } catch (error) {
    // Cache missing or invalid, ignore
  }

  // 2. Fallback to Defaults
  const defaultPath = getDefaultDataPath()
  try {
    console.log('[Support] Cache miss/invalid, serving defaults from:', defaultPath)
    const defaultContent = await fs.readFile(defaultPath, 'utf-8')
    return JSON.parse(defaultContent)
  } catch (error) {
    console.error('[Support] Failed to load defaults:', error)
    return { error: 'Failed to load support data' }
  }
}

export const refreshSupportData = async (force = false) => {
  const cachePath = getCachePath()

  // 1. Check Throttle
  if (!force) {
    try {
      const cacheContent = await fs.readFile(cachePath, 'utf-8')
      const cache = JSON.parse(cacheContent)
      if (cache && cache.fetchedAt) {
        const lastFetch = new Date(cache.fetchedAt).getTime()
        const now = Date.now()
        const hoursDiff = (now - lastFetch) / (1000 * 60 * 60)

        if (hoursDiff < THROTTLE_HOURS) {
          console.log(`[Support] Fetch throttled. Last fetch: ${hoursDiff.toFixed(2)}h ago.`)
          return { updated: false, throttled: true }
        }
      }
    } catch (e) {
      // Ignore error, proceed to fetch
    }
  }

  // 2. Fetch Remote
  console.log('[Support] Fetching remote data...')
  try {
    const response = await net.fetch(SUPPORT_JSON_URL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()

    // 3. Validate
    if (!validateSupportData(data)) {
      console.error('[Support] Remote data validation failed')
      return { updated: false, error: 'Validation failed' }
    }

    // 4. Overwrite Cache
    const cacheObject = {
      fetchedAt: new Date().toISOString(),
      data: data
    }

    await fs.writeFile(cachePath, JSON.stringify(cacheObject, null, 2))
    console.log('[Support] Cache updated successfully')
    return { updated: true, data: data }
  } catch (error) {
    console.error('[Support] Fetch failed:', error)
    return { updated: false, error: error.message }
  }
}

const compareVersions = (v1, v2) => {
  // Simple semantic version comparison
  // Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
  if (v1 === undefined || v1 === null || v2 === undefined || v2 === null) return 0

  const p1 = String(v1).split('.').map(Number)
  const p2 = String(v2).split('.').map(Number)

  for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
    const n1 = p1[i] || 0
    const n2 = p2[i] || 0
    if (n1 > n2) return 1
    if (n1 < n2) return -1
  }
  return 0
}

export const checkForUpdates = async () => {
  // Ensure we have fresh data (throttled)
  await refreshSupportData(false)

  try {
    const data = await getSupportData()
    if (!data) return { updateAvailable: false }

    const currentVersion = app.getVersion()

    // Priority:
    // 1. latestVersion (explicit semver string)
    // 2. version (if it's a string or number)
    let remoteVersion = data.latestVersion || data.version

    if (remoteVersion === undefined || remoteVersion === null) {
      return { updateAvailable: false }
    }

    const comparison = compareVersions(remoteVersion, currentVersion)

    if (comparison > 0) {
      console.log(`[Update] New version available: ${remoteVersion} (Current: ${currentVersion})`)
      return {
        updateAvailable: true,
        latestVersion: remoteVersion,
        url: data.updateUrl || 'https://github.com/builtbybayn/anonboot/releases/latest'
      }
    }

    return { updateAvailable: false }
  } catch (error) {
    console.error('[Update] Check failed:', error)
    return { updateAvailable: false }
  }
}

