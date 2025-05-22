import { matches, FileHelper } from '@start9labs/start-sdk'
const { object } = matches

// @TODO
const shape = object({})

export const xftpConfigFile = FileHelper.ini(
  {
    volumeId: 'main',
    subpath: '/etc/opt/simplex/xftp-server.ini',
  },
  shape,
)
