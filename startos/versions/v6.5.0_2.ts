import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_6_5_0_2 = VersionInfo.of({
  version: '6.5.0:2',
  releaseNotes: {
    en_US: 'Bumps @start9labs/start-sdk → 1.5.2.',
    es_ES: 'Actualiza @start9labs/start-sdk → 1.5.2.',
    de_DE: 'Aktualisiert @start9labs/start-sdk → 1.5.2.',
    pl_PL: 'Aktualizuje @start9labs/start-sdk → 1.5.2.',
    fr_FR: 'Met à jour @start9labs/start-sdk → 1.5.2.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
