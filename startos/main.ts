import { fileServerIni } from './fileModels/fileServer.ini'
import { smpServerIni } from './fileModels/smpServer.ini'
import { sdk } from './sdk'
import { smpMounts, smpPort, xftpMounts, xftpPort } from './utils'
import { i18n } from './i18n'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info(i18n('Starting SimpleX!'))

  // confirm configuration files are present and restart service if they change
  const smpIni = await smpServerIni.read().const(effects)
  if (!smpIni) {
    throw new Error(i18n('No smp-server.ini'))
  }
  const fileIni = await fileServerIni.read().const(effects)
  if (!fileIni) {
    throw new Error(i18n('No file-server.ini'))
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
        display: i18n('SMP Server'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, smpPort, {
            successMessage: i18n('The SMP server is ready'),
            errorMessage: i18n('The SMP server is not ready'),
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
        display: i18n('XFTP Server'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, xftpPort, {
            successMessage: i18n('The XFTP server is ready'),
            errorMessage: i18n('The XFTP server is not ready'),
          }),
      },
      requires: [],
    })
})
