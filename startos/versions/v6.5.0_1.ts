import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_6_5_0_1 = VersionInfo.of({
  version: '6.5.0:1',
  releaseNotes: {
    en_US: `**Bumps**

- SimpleX → 6.5.0`,
    es_ES: `**Cambios de versión**

- SimpleX → 6.5.0`,
    de_DE: `**Versions-Updates**

- SimpleX → 6.5.0`,
    pl_PL: `**Aktualizacje wersji**

- SimpleX → 6.5.0`,
    fr_FR: `**Mises à jour**

- SimpleX → 6.5.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
