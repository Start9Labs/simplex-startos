import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const enableTorProxy = await storeJson
    .read((s) => s?.enableTorProxy ?? false)
    .const(effects)

  if (!enableTorProxy) return {}

  return {
    tor: {
      kind: 'running',
      versionRange: '>=0.4.9.5:0',
      healthChecks: [],
    },
  }
})
