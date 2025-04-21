import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { smpPort, xftpPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting SimpleX!')

  const simplexSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'simplex' },
    sdk.Mounts.of().addVolume('main', null, '/data', false),
    'simplex-sub',
  )

  /**
   * ======================== Additional Health Checks (optional) ========================
   *
   * In this section, we define *additional* health checks beyond those included with each daemon (below).
   */
  const additionalChecks: T.HealthCheck[] = []

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started, additionalChecks)
    .addDaemon('smp', {
      subcontainer: simplexSub,
      command: ['smp-server', 'start', '+RTS', '-N', '-RTS'],
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
      subcontainer: simplexSub,
      command: ['xftp-server', 'start', '+RTS', '-N', '-RTS'],
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
