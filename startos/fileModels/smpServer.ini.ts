import { FileHelper, z } from '@start9labs/start-sdk'
import { smpConfigDefaults, smpStatePath } from '../utils'
import * as INI from './ini-lib'
import { sdk } from '../sdk'

const {
  INFORMATION,
  STORE_LOG,
  AUTH,
  TRANSPORT,
  PROXY,
  INACTIVE_CLIENTS,
  WEB,
} = smpConfigDefaults

const informationSchema = z.object({
  source_code: z
    .literal(INFORMATION.source_code)
    .catch(INFORMATION.source_code),
})

const storeLogSchema = z.object({
  enable: z.enum(['on', 'off']).catch(STORE_LOG.enable),
  store_queues: z
    .literal(STORE_LOG.store_queues)
    .catch(STORE_LOG.store_queues),
  store_messages: z
    .literal(STORE_LOG.store_messages)
    .catch(STORE_LOG.store_messages),
  restore_messages: z.enum(['on', 'off']).catch(STORE_LOG.restore_messages),
  expire_messages_days: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .catch(STORE_LOG.expire_messages_days),
  expire_messages_on_start: z
    .literal(STORE_LOG.expire_messages_on_start)
    .catch(STORE_LOG.expire_messages_on_start),
  expire_ntfs_hours: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .catch(STORE_LOG.expire_ntfs_hours),
  log_stats: z.enum(['on', 'off']).catch(STORE_LOG.log_stats),
  prometheus_interval: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .catch(STORE_LOG.prometheus_interval),
})

const authSchema = z.object({
  new_queues: z.literal(AUTH.new_queues).catch(AUTH.new_queues),
  create_password: z.string().catch(''),
  control_port_admin_password: z
    .string()
    .optional()
    .catch(AUTH.control_port_admin_password),
  control_port_user_password: z
    .string()
    .optional()
    .catch(AUTH.control_port_user_password),
})

const transportSchema = z.object({
  host: z.string().catch(TRANSPORT.host),
  port: z.literal(TRANSPORT.port).catch(TRANSPORT.port),
  log_tls_errors: z
    .literal(TRANSPORT.log_tls_errors)
    .catch(TRANSPORT.log_tls_errors),
  websockets: z.literal(TRANSPORT.websockets).catch(TRANSPORT.websockets),
  control_port: z
    .literal(TRANSPORT.control_port)
    .catch(TRANSPORT.control_port),
})

const proxySchema = z.object({
  socks_proxy: z.literal(PROXY.socks_proxy).catch(PROXY.socks_proxy),
  client_concurrency: z
    .number()
    .int()
    .nonnegative()
    .catch(PROXY.client_concurrency),
})

const inactiveClientsSchema = z.object({
  disconnect: z
    .literal(INACTIVE_CLIENTS.disconnect)
    .catch(INACTIVE_CLIENTS.disconnect),
})

const webSchema = z.object({
  static_path: z
    .literal(`${smpStatePath}/www`)
    .optional()
    .catch(WEB.static_path),
  http: z.literal(WEB.http).catch(WEB.http),
  https: z.any().optional().catch(undefined),
  cert: z.any().optional().catch(undefined),
  key: z.any().optional().catch(undefined),
})

const shape = z.object({
  INFORMATION: informationSchema.catch(() => informationSchema.parse({})),
  STORE_LOG: storeLogSchema.catch(() => storeLogSchema.parse({})),
  AUTH: authSchema.catch(() => authSchema.parse({})),
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
