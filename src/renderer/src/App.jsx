import { useEffect, useState, useRef } from 'react'
import AdminRequiredModal from './components/AdminRequiredModal'
import Header from './components/Header'
import ConfigGroup from './components/ConfigGroup'
import Footer from './components/Footer'
import SupportModal from './components/SupportModal'
import PaymentModal from './components/PaymentModal'
import AboutModal from './components/AboutModal'
import { configStructure } from './data/configData'

function App() {
  const [isAdmin, setIsAdmin] = useState(null)
  const scrollRef = useRef(null)

  const [mode, setMode] = useState('standard')
  const [config, setConfig] = useState({})
  const [configLayout, setConfigLayout] = useState(configStructure)

  const [pendingRequests, setPendingRequests] = useState(0)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [historyCounts, setHistoryCounts] = useState({ undo: 0, redo: 0 })
  const [currentSchema, setSchema] = useState(null)

  const [isSupportOpen, setIsSupportOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [paymentPayload, setPaymentPayload] = useState(null)

  // Logic to calculate config based on mode (Only handles static layout for now)
  const getModeConfig = (selectedMode) => {
    const newConfig = {}
    configLayout.forEach((category) => {
      let shouldEnableCategory = false
      if (selectedMode === 'paranoid') {
        shouldEnableCategory = true
      } else if (selectedMode === 'standard') {
        if (['services', 'registry', 'scheduled_tasks'].includes(category.id)) {
          shouldEnableCategory = true
        }
      }

      category.children.forEach((child) => {
        newConfig[child.id] = shouldEnableCategory
      })
    })
    return newConfig
  }

  const findCategoryForId = (id) => {
    for (const cat of configLayout) {
      if (cat.children.find((c) => c.id === id)) {
        return cat.id
      }
    }
    return null
  }

  const checkSecurity = (categoryId, id, itemState, schema) => {
    const isRegistrySecure = (id, stateItem, registryDef) => {
      if (!registryDef || !stateItem) return false
      if (!stateItem.valueExists) return false
      return stateItem.valueData === registryDef.desired.value
    }

    if (categoryId === 'services') {
      return itemState ? itemState.startType === 'Disabled' : true
    } else if (categoryId === 'registry') {
      const target = schema.registry.find((r) => r.name === id)
      return isRegistrySecure(id, itemState, target)
    } else if (categoryId === 'scheduled_tasks') {
      return itemState ? !itemState.wasEnabled : true
    } else if (categoryId === 'firewall') {
      if (id === 'telemetry_hosts') {
        // Check if ALL endpoints are blocked. itemState is object of endpoints
        // itemState = { [ep]: { exists: true, enabled: true }, ... }
        return schema.firewall.every((ep) => {
          const key = 'FW_' + ep
          return itemState[key] && itemState[key].enabled === true
        })
      } else {
        return itemState ? itemState.enabled : false
      }
    } else if (categoryId === 'hosts') {
      if (id === 'block_hosts') {
        // itemState is object of domains
        return schema.hosts.every((d) => itemState[d] && itemState[d].present === true)
      } else {
        return itemState ? itemState.present : false
      }
    } else if (categoryId === 'location') {
      if (schema.location.services.includes(id)) {
        return itemState ? itemState.startType === 'Disabled' : true
      } else {
        const target = schema.location.registry.find((r) => (r.id || r.name) === id)
        return isRegistrySecure(id, itemState, target)
      }
    } else if (categoryId === 'devices') {
      const target = schema.devicesRegistry.find((r) => (r.id || r.name) === id)
      if (target) {
        return isRegistrySecure(id, itemState[id], target)
      } else {
        // Dynamic Device
        // itemState is { Devices: [...] } or single device if filtered?
        // detectDevices returns { Devices: [...] }
        // We need to find our specific device in the list
        if (itemState && itemState.Devices && Array.isArray(itemState.Devices)) {
          const dev = itemState.Devices.find((d) => d.instanceId === id)
          if (dev) {
            return dev.status !== 'OK'
          }
        }
        return true
      }
    } else if (categoryId === 'dns') {
      if (id === 'DoH') {
        return itemState
          ? itemState.cloudflare11Configured && itemState.cloudflare10Configured
          : false
      } else if (id === 'DoH-Hardening') {
        if (
          itemState &&
          itemState.servers &&
          Array.isArray(itemState.servers) &&
          itemState.servers.length > 0
        ) {
          const allowed = ['1.1.1.1', '1.0.0.1', '2606:4700:4700::1111', '2606:4700:4700::1001']
          return itemState.servers.every((s) => allowed.includes(s.serverAddress))
        } else {
          return false
        }
      } else {
        if (itemState && itemState.serverAddresses) {
          return itemState.serverAddresses.includes('1.1.1.1')
        }
      }
    }
    return false
  }

  const mapStateToConfig = (state, schema, layout) => {
    const mappedConfig = {}

    layout.forEach((category) => {
      category.children.forEach((child) => {
        const id = child.id
        // state[id] works for flat keys. For special cases (firewall/hosts/devices), state might be structured differently?
        // detectAll returns flattened object where keys are IDs (mostly).
        // For firewall telemetry_hosts, we need to pass the whole state or the subset?
        // checkSecurity handles 'telemetry_hosts' expecting itemState to be the collection of endpoints.
        // In full state, `state` has keys for each endpoint.
        // So for telemetry_hosts, itemState should be `state`.
        // Same for block_hosts.
        // For devices, itemState should be `state` (containing Devices array).

        let itemState = state[id]
        if (id === 'telemetry_hosts' || id === 'block_hosts' || category.id === 'devices') {
          itemState = state
        }

        mappedConfig[id] = checkSecurity(category.id, id, itemState, schema)
      })
    })

    return mappedConfig
  }

  // Extracted loading logic
  const loadState = async (forceDetect = false) => {
    try {
      if (forceDetect) {
        await window.api.detectState()
      }

      const [schema, state, counts] = await Promise.all([
        window.api.getSchema(),
        window.api.getState(),
        window.api.getHistoryCounts()
      ])

      setSchema(schema)
      setHistoryCounts(counts)

      // Inject Dynamic Devices into Layout
      const newLayout = [...configStructure] // Copy base structure
      const devicesCatIndex = newLayout.findIndex((c) => c.id === 'devices')

      if (devicesCatIndex !== -1 && state.Devices && Array.isArray(state.Devices)) {
        const devicesCat = { ...newLayout[devicesCatIndex] }
        const staticChildren = devicesCat.children

        const dynamicChildren = state.Devices.map((dev) => ({
          id: dev.instanceId,
          label: dev.name || dev.instanceId,
          description: `Hardware Device (${dev.class}) - ${dev.status}`,
          isDynamic: true
        }))

        devicesCat.children = [...staticChildren, ...dynamicChildren]
        newLayout[devicesCatIndex] = devicesCat
      }

      setConfigLayout(newLayout)

      const initialConfig = mapStateToConfig(state, schema, newLayout)
      setConfig(initialConfig)
      setMode('custom')
    } catch (error) {
      console.error('Failed to load state:', error)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const adminResult = await window.api.checkAdmin()
        setIsAdmin(adminResult)
        if (!adminResult) return

        await loadState(true)
      } finally {
        setIsInitialLoading(false)
      }
    }
    init()
  }, [])

  const handleRefresh = async () => {
    if (pendingRequests > 0 || isInitialLoading) return
    setPendingRequests((prev) => prev + 1)
    try {
      await loadState(true)
    } finally {
      setPendingRequests((prev) => Math.max(0, prev - 1))
    }
  }

  const handleUndo = async () => {
    if (historyCounts.undo === 0) return
    setPendingRequests((prev) => prev + 1)
    try {
      const result = await window.api.undo()
      if (result) {
        setHistoryCounts(result.counts)
        if (result.action) {
          // Optimistically update UI based on what we just undid
          // Undo inverts the value: if action.value was true (Secure), we are now false (Default)
          setConfig((prev) => ({ ...prev, [result.action.id]: !result.action.value }))
        } else {
          await loadState(true) // Fallback if no action returned
        }
      }
    } finally {
      setPendingRequests((prev) => Math.max(0, prev - 1))
    }
  }

  const handleRedo = async () => {
    if (historyCounts.redo === 0) return
    setPendingRequests((prev) => prev + 1)
    try {
      const result = await window.api.redo()
      if (result) {
        setHistoryCounts(result.counts)
        if (result.action) {
          // Optimistically update UI based on what we just redid
          // Redo applies the value: if action.value was true, we are now true
          setConfig((prev) => ({ ...prev, [result.action.id]: result.action.value }))
        } else {
          await loadState(true)
        }
      }
    } finally {
      setPendingRequests((prev) => Math.max(0, prev - 1))
    }
  }

  const handleRevertAll = async () => {
    if (pendingRequests > 0) return
    setPendingRequests((prev) => prev + 1)
    try {
      await window.api.revertAll()
      await loadState(true)
    } catch (error) {
      console.error('Revert All failed:', error)
    } finally {
      setPendingRequests((prev) => Math.max(0, prev - 1))
    }
  }

  const handleModeChange = async (newMode) => {
    if (newMode === 'custom') {
      setMode('custom')
      return
    }

    const newConfig = {}
    configLayout.forEach((category) => {
      let shouldEnableCategory = false
      if (newMode === 'paranoid') {
        shouldEnableCategory = true
      } else if (newMode === 'standard') {
        if (['services', 'registry', 'scheduled_tasks'].includes(category.id)) {
          shouldEnableCategory = true
        }
      }
      category.children.forEach((child) => {
        newConfig[child.id] = shouldEnableCategory
      })
    })

    setMode(newMode)
    setConfig(newConfig)

    const changes = []
    Object.entries(newConfig).forEach(([id, value]) => {
      const category = findCategoryForId(id)
      if (category) {
        changes.push({ category, id, value })
      }
    })

    setPendingRequests((prev) => prev + 1)
    try {
      const promises = changes.map((item) =>
        window.api.toggleSetting(item.category, item.id, item.value)
      )
      const results = await Promise.allSettled(promises)
      const failed = results.filter((r) => r.status === 'rejected')
      if (failed.length > 0) console.warn('Failures during mode switch', failed)

      const counts = await window.api.getHistoryCounts()
      setHistoryCounts(counts)

      // Mode switch applies many items. We should probably do a full refresh or trust the optimistic update?
      // Since we updated local config above, we are mostly good.
      // But verifying is safer. We can run loadState(true) here as it is a bulk action.
      // Or just loadState(true) to be safe.
      await loadState(true)
    } catch (error) {
      console.error('Error applying mode:', error)
    } finally {
      setPendingRequests((prev) => Math.max(0, prev - 1))
    }
  }

  const handleToggleItem = async (ids, value) => {
    setConfig((prev) => {
      const next = { ...prev }
      ids.forEach((id) => {
        next[id] = value
      })
      return next
    })
    setMode('custom')

    setPendingRequests((prev) => prev + 1)
    try {
      const promises = ids.map((id) => {
        const category = findCategoryForId(id)
        if (!category) return Promise.resolve()
        return window.api
          .toggleSetting(category, id, value)
          .then(() => ({ id, category, status: 'fulfilled' }))
          .catch((err) => ({ id, status: 'rejected', reason: err }))
      })

      const results = await Promise.all(promises)
      const failedItems = results.filter((r) => r.status === 'rejected')

      if (failedItems.length > 0) {
        setConfig((prev) => {
          const next = { ...prev }
          failedItems.forEach((item) => {
            next[item.id] = !value
          })
          return next
        })
      }

      const counts = await window.api.getHistoryCounts()
      setHistoryCounts(counts)
    } catch (error) {
      console.error('Error in toggle:', error)
    } finally {
      setPendingRequests((prev) => Math.max(0, prev - 1))
    }
  }

  const handleOpenPayment = (payload) => {
    setPaymentPayload(payload)
    setIsPaymentOpen(true)
  }

  if (isAdmin === false) {
    return <AdminRequiredModal />
  }

  return (
    <div className="app-container">
      <Header
        currentMode={mode}
        setMode={handleModeChange}
        isLoading={pendingRequests > 0 || isInitialLoading}
        scrollRef={scrollRef}
        onRefresh={handleRefresh}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onRevertAll={handleRevertAll}
        canUndo={historyCounts.undo > 0}
        canRedo={historyCounts.redo > 0}
      />

      <main ref={scrollRef} className="main-scroll-container">
        <div className="config-list">
          {configLayout.map((category) => (
            <ConfigGroup
              key={category.id}
              category={category}
              configState={config}
              toggleItem={handleToggleItem}
            />
          ))}
        </div>
        <Footer
          onOpenSupport={() => setIsSupportOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
        />
      </main>

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        onOpenPayment={handleOpenPayment}
        isCovered={isPaymentOpen}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onBack={() => setIsPaymentOpen(false)}
        onClose={() => setIsPaymentOpen(false)}
        {...paymentPayload}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  )
}

export default App