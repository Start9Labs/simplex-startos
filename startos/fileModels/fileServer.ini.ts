import { FileHelper, z } from '@start9labs/start-sdk'
import { xftpConfigDefaults } from '../utils'
import { sdk } from '../sdk'

const { STORE_LOG, AUTH, TRANSPORT, FILES, INACTIVE_CLIENTS } =
  xftpConfigDefaults

const storeLogSchema = z.object({
  enable: z.enum(['on', 'off']).catch(STORE_LOG.enable),
  expire_files_hours: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .catch(STORE_LOG.expire_files_hours),
  log_stats: z.enum(['on', 'off']).catch(STORE_LOG.log_stats),
  prometheus_interval: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .catch(STORE_LOG.prometheus_interval),
})

const authSchema = z.object({
  new_files: z.enum(['on', 'off']).catch(AUTH.new_files),
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
  log_tls_errors: z.enum(['on', 'off']).catch(TRANSPORT.log_tls_errors),
  control_port: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .catch(TRANSPORT.control_port),
})

const filesSchema = z.object({
  path: z.literal(FILES.path).catch(FILES.path),
  storage_quota: z.string().catch(FILES.storage_quota),
})

const inactiveClientsSchema = z.object({
  disconnect: z
    .literal(INACTIVE_CLIENTS.disconnect)
    .catch(INACTIVE_CLIENTS.disconnect),
})

const shape = z.object({
  STORE_LOG: storeLogSchema.catch(() => storeLogSchema.parse({})),
  AUTH: authSchema.catch(() => authSchema.parse({})),
  TRANSPORT: transportSchema.catch(() => transportSchema.parse({})),
  FILES: filesSchema.catch(() => filesSchema.parse({})),
  INACTIVE_CLIENTS: inactiveClientsSchema.catch(() =>
    inactiveClientsSchema.parse({}),
  ),
})

export type FileServerConfig = z.infer<typeof shape>

export const fileServerIni = FileHelper.ini(
  {
    base: sdk.volumes['xftp-configs'],
    subpath: './file-server.ini',
  },
  shape,
)
