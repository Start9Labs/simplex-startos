import { matches, FileHelper } from '@start9labs/start-sdk'
const { object } = matches

// @TODO
const shape = object({})

export const xftpConfigFile = FileHelper.ini(
  '/media/startos/volumes/main/etc/opt/simplex/xftp-server.ini',
  shape,
)
