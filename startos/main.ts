import { fileServerIni } from './fileModels/fileServer.ini'
import { smpServerIni } from './fileModels/smpServer.ini'
import { sdk } from './sdk'
import { smpMounts, smpPort, xftpMounts, xftpPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting SimpleX!')

  // confirm configuration files are present and restart service if they change
  const smpIni = await smpServerIni.read().const(effects)
  if (!smpIni) {
    throw new Error('No smp-server.ini')
  }
  const fileIni = await fileServerIni.read().const(effects)
  if (!fileIni) {
    throw new Error('No file-server.ini')
  }

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects)
    .addDaemon('smp', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'smp' },
        smpMounts,
        'smp-sub',
      ),
      exec: {
        command: sdk.useEntrypoint(),
      },
      ready: {
        display: 'SMP Server',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, smpPort, {
            successMessage: 'The SMP server is ready',
            errorMessage: 'The SMP server is not ready',
          }),
      },
      requires: [],
    })
    .addDaemon('xftp', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'xftp' },
        xftpMounts,
        'xftp-sub',
      ),
      exec: {
        command: sdk.useEntrypoint(),
      },
      ready: {
        display: 'XFTP Server',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, xftpPort, {
            successMessage: 'The XFTP server is ready',
            errorMessage: 'The XFTP server is not ready',
          }),
      },
      requires: [],
    })
})
