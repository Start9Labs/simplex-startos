import { utils, VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { randomPassword, smpConfigDefaults } from '../utils'
import { smpConfigFile } from '../fileModels/smp.ini'
import { sdk } from '../sdk'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
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
  },
})
