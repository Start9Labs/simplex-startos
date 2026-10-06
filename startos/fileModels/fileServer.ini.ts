import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { xftpFilePath, xftpPort, xftpStorageQuota } from '../utils'
import * as INI from './ini-lib'

const authSchema = z.looseObject({
  create_password: z.string(),
})

const transportSchema = z.looseObject({
  host: z.literal('<hostnames>').catch('<hostnames>'),
  port: z.literal(xftpPort).catch(xftpPort),
})

const filesSchema = z.looseObject({
  path: z.literal(xftpFilePath).catch(xftpFilePath),
  storage_quota: z.string().catch(xftpStorageQuota),
})

const inactiveClientsSchema = z.looseObject({
  disconnect: z.literal('off').catch('off'),
})

const shape = z.looseObject({
  AUTH: authSchema,
  TRANSPORT: transportSchema.catch(() => transportSchema.parse({})),
  FILES: filesSchema.catch(() => filesSchema.parse({})),
  INACTIVE_CLIENTS: inactiveClientsSchema.catch(() =>
    inactiveClientsSchema.parse({}),
  ),
})

export type FileServerConfig = z.infer<typeof shape>

export const fileServerIni = FileHelper.raw<FileServerConfig>(
  {
    base: sdk.volumes['xftp-configs'],
    subpath: './file-server.ini',
  },
  (inData) => INI.stringify(inData as INI.IniInputData),
  (inString) => INI.parse(inString),
  (data) => shape.parse(data),
)
