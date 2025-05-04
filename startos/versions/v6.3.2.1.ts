import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { rmdir } from 'fs/promises'

export const v_6_3_2_1 = VersionInfo.of({
  version: '6.3.2:1',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      // remove old start9 dir
      await rmdir('/root/start9')
    },
    down: IMPOSSIBLE,
  },
})
