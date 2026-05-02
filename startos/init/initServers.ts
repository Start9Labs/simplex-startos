import { utils } from '@start9labs/start-sdk'
import { fileServerIni } from '../fileModels/fileServer.ini'
import { smpServerIni } from '../fileModels/smpServer.ini'
import { sdk } from '../sdk'
import { smpMounts, xftpFilePath, xftpMounts, xftpStorageQuota } from '../utils'

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
      },
    )

    await smpServerIni.merge(effects, {
      AUTH: { create_password },
    })

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
          xftpStorageQuota,
        ])
      },
    )

    await fileServerIni.merge(effects, {
      AUTH: { create_password },
    })
  } else {
    await smpServerIni.merge(effects, {})
    const create_password = await smpServerIni
      .read((s) => s.AUTH.create_password)
      .once()
    if (!create_password) {
      throw new Error('No smp-server.ini create_password')
    }
    await fileServerIni.merge(effects, {
      AUTH: { create_password },
    })
  }
})
