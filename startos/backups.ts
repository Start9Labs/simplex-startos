import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(
  async ({ effects }) =>
    sdk.Backups.ofVolumes(
      'smp-configs',
      'smp-state',
      'xftp-configs',
      'xftp-state',
      'xftp-files',
    ),
)
