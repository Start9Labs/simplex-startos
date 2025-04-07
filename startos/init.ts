import { sdk } from './sdk'
import { exposedStore } from './store'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { smpConfigFile } from './file-models/smp.ini'
import { randomPassword, smpConfigDefaults } from './utils'
import { utils } from '@start9labs/start-sdk'

// **** Install ****
const install = sdk.setupInstall(async ({ effects }) => {
  await smpConfigFile.write(effects, {
    ...smpConfigDefaults,
    auth: {
      ...smpConfigDefaults.auth,
      create_password: utils.getDefaultString(randomPassword),
    },
    proxy: {
      ...smpConfigDefaults.proxy,
      socks_proxy: `${await sdk.getOsIp(effects)}:9050`,
    },
  })
})

// **** Uninstall ****
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  install,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
  exposedStore,
)
