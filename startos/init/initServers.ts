import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import {
  smpMounts,
  xftpConfigDefaults,
  xftpFilePath,
  xftpMounts,
} from '../utils'
import { smpServerIni } from '../fileModels/smpServer.ini'
import { fileServerIni } from '../fileModels/fileServer.ini'

export const initServers = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    const create_password = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9,!,$,%,&,*',
      len: 21,
    })

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'smp' },
      smpMounts,
      'init-smp',
      async (sub) => {
        await sub.execFail([
          'smp-server',
          'init',
          '-y',
          '-l',
          '--password',
          create_password,
        ])

        await smpServerIni.merge(effects, {
          AUTH: { create_password },
        })
      },
    )

    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'xftp' },
      xftpMounts,
      'init-xftp',
      async (sub) => {
        await sub.execFail([
          'xftp-server',
          'init',
          '-p',
          xftpFilePath,
          '-q',
          xftpConfigDefaults.FILES.storage_quota,
        ])

        await fileServerIni.merge(effects, {
          AUTH: { create_password },
        })
      },
    )
  } else {
    await smpServerIni.merge(effects, {})
    await fileServerIni.merge(effects, {})
  }
})
