import { matches, FileHelper } from '@start9labs/start-sdk'
import { smpConfigDefaults } from '../utils'

const { object, string, oneOf, literal, natural, arrayOf } = matches

const {
  information,
  store_log,
  auth,
  transport,
  proxy,
  inactive_clients,
  web,
} = smpConfigDefaults

const shape = object({
  information: object({
    // Basic info
    LICENSE: string.optional().onMismatch(information.LICENSE),
    source_code: literal(information.source_code).onMismatch(
      information.source_code,
    ),

    // Server usage conditions and amendments.
    usage_conditions: string
      .optional()
      .onMismatch(information.usage_conditions),
    condition_amendments: string
      .optional()
      .onMismatch(information.condition_amendments),

    // Server location and operator
    server_country: string.optional().onMismatch(information.server_country),
    operator: string.optional().onMismatch(information.operator),
    operator_country: string
      .optional()
      .onMismatch(information.operator_country),
    website: string.optional().onMismatch(information.website),

    // Administrative contacts
    admin_simplex: string.optional().onMismatch(information.admin_simplex), // SimpleX address
    admin_email: string.optional().onMismatch(information.admin_email),
    admin_pgp: string.optional().onMismatch(information.admin_pgp),
    admin_pgp_fingerprint: string
      .optional()
      .onMismatch(information.admin_pgp_fingerprint),

    // Contacts for complaints and feedback.
    complaints_simplex: string
      .optional()
      .onMismatch(information.complaints_simplex), // SimpleX address
    complaints_email: string
      .optional()
      .onMismatch(information.complaints_email),
    complaints_pgp: string.optional().onMismatch(information.complaints_pgp),
    complaints_pgp_fingerprint: string
      .optional()
      .onMismatch(information.complaints_pgp_fingerprint),

    // Hosting provider
    hosting: string.optional().onMismatch(information.hosting), // entity (organization or person name)
    hosting_country: string.optional().onMismatch(information.hosting_country), // ISO-3166 2-letter code
  }),
  store_log: object({
    enable: oneOf(literal('on'), literal('off')).onMismatch(store_log.enable),

    restore_messages: oneOf(literal('on'), literal('off')).onMismatch(
      store_log.restore_messages,
    ),
    expire_messages_days: natural.onMismatch(store_log.expire_messages_days),
    expire_ntfs_hours: natural.onMismatch(store_log.expire_ntfs_hours),

    log_stats: oneOf(literal('on'), literal('off')).onMismatch(
      store_log.log_stats,
    ),
  }),
  auth: object({
    new_queues: oneOf(literal('on'), literal('off')).onMismatch(
      auth.new_queues,
    ),

    create_password: string.onMismatch(auth.create_password),

    control_port_admin_password: string.onMismatch(
      auth.control_port_admin_password,
    ),
    control_port_user_password: string.onMismatch(
      auth.control_port_user_password,
    ),
  }),
  transport: object({
    host: literal(transport.host).onMismatch(transport.host),
    port: literal(transport.port).onMismatch(transport.port),
    log_tls_errors: oneOf(literal('on'), literal('off')).onMismatch(
      transport.log_tls_errors,
    ),

    websockets: oneOf(literal('on'), literal('off')).onMismatch(
      transport.websockets,
    ),
    control_port: literal(transport.control_port).onMismatch(
      transport.control_port,
    ),
  }),
  proxy: object({
    // Network configuration for SMP proxy client.
    host_mode: oneOf(literal('public'), literal('onion')).onMismatch(
      proxy.host_mode,
    ),
    required_host_mode: oneOf(literal('on'), literal('off')).onMismatch(
      proxy.required_host_mode,
    ),

    own_server_domains: arrayOf(string).onMismatch(proxy.own_server_domains),

    socks_proxy: string.onMismatch(proxy.socks_proxy),
    socks_mode: oneOf(literal('onion'), literal('always')).onMismatch(
      proxy.socks_mode,
    ),

    client_concurrency: natural.onMismatch(proxy.client_concurrency),
  }),
  inactive_clients: object({
    disconnect: oneOf(literal('on'), literal('off')).onMismatch(
      inactive_clients.disconnect,
    ),
    ttl: natural.onMismatch(inactive_clients.ttl),
    check_interval: natural.onMismatch(inactive_clients.check_interval),
  }),
  web: object({
    static_path: literal(web.static_path),
    http: literal(web.http).onMismatch(web.http),

    https: literal(web.https).onMismatch(web.https),
    cert: literal(web.cert).onMismatch(web.cert),
    key: literal(web.key).onMismatch(web.key),
  }),
})

export const smpConfigFile = FileHelper.ini(
  '/media/startos/volumes/main/etc/opt/simplex/smp-server.ini',
  shape,
)
