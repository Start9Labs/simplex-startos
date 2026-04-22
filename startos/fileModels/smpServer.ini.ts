import { FileHelper, z } from '@start9labs/start-sdk'
import { smpPort, smpStatePath, webPort } from '../utils'
import * as INI from './ini-lib'
import { sdk } from '../sdk'

const storeLogSchema = z.object({
  enable: z.literal('on').catch('on'),
  expire_messages_days: z.literal(365).catch(365),
  expire_messages_on_start: z.literal('off').catch('off'),
  expire_ntfs_hours: z.literal(168).catch(168),
})

const authSchema = z.object({
  create_password: z.string(),
})

const transportSchema = z.object({
  host: z.literal('<hostnames>').catch('<hostnames>'),
  port: z.literal(`${smpPort},443`).catch(`${smpPort},443`),
})

const proxySchema = z.object({
  socks_proxy: z.string().optional().catch(undefined),
})

const inactiveClientsSchema = z.object({
  disconnect: z.literal('off').catch('off'),
})

const webSchema = z.object({
  static_path: z.literal(`${smpStatePath}/www`).catch(`${smpStatePath}/www`),
  http: z.literal(webPort).catch(webPort),
  https: z.undefined().catch(undefined),
  cert: z.undefined().catch(undefined),
  key: z.undefined().catch(undefined),
})

const shape = z.object({
  STORE_LOG: storeLogSchema.catch(() => storeLogSchema.parse({})),
  AUTH: authSchema,
  TRANSPORT: transportSchema.catch(() => transportSchema.parse({})),
  PROXY: proxySchema.catch(() => proxySchema.parse({})),
  INACTIVE_CLIENTS: inactiveClientsSchema.catch(() =>
    inactiveClientsSchema.parse({}),
  ),
  WEB: webSchema.catch(() => webSchema.parse({})),
})

export type SmpServerConfig = z.infer<typeof shape>

export const smpServerIni = FileHelper.raw<SmpServerConfig>(
  {
    base: sdk.volumes['smp-configs'],
    subpath: './smp-server.ini',
  },
  (inData) => INI.stringify(inData),
  (inString) => INI.parse(inString),
  (data) => shape.parse(data),
)
