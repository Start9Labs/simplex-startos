import { matches, FileHelper } from '@start9labs/start-sdk'
import { smpConfigDefaults, smpStatePath } from '../utils'
import * as INI from './ini-lib'
import { sdk } from '../sdk'

const { object, string, literal, literals, natural, nill } = matches

const {
  INFORMATION,
  STORE_LOG,
  AUTH,
  TRANSPORT,
  PROXY,
  INACTIVE_CLIENTS,
  WEB,
} = smpConfigDefaults

const shape = object({
  INFORMATION: object({
    source_code: literal(INFORMATION.source_code).onMismatch(
      INFORMATION.source_code,
    ),
  }),
  STORE_LOG: object({
    /**
      The server uses STM memory for persistence,
      that will be lost on restart (e.g., as with redis).
      This option enables saving memory to append only log,
      and restoring it when the server is started.
      Log is compacted on start (deleted objects are removed).
    */
    enable: literals('on', 'off').onMismatch(STORE_LOG.enable),
    store_queues: literal(STORE_LOG.store_queues).onMismatch(
      STORE_LOG.store_queues,
    ),
    store_messages: literal(STORE_LOG.store_messages).onMismatch(
      STORE_LOG.store_messages,
    ),
    /**
      Undelivered messages are optionally saved and restored when the server restarts,
      they are preserved in the .bak file until the next restart.
    */
    restore_messages: literals('on', 'off').onMismatch(
      STORE_LOG.restore_messages,
    ),
    expire_messages_days: natural
      .optional()
      .onMismatch(STORE_LOG.expire_messages_days),
    expire_messages_on_start: literal(
      STORE_LOG.expire_messages_on_start,
    ).onMismatch(STORE_LOG.expire_messages_on_start),
    expire_ntfs_hours: natural
      .optional()
      .onMismatch(STORE_LOG.expire_ntfs_hours),
    /**
      Log daily server statistics to CSV file
    */
    log_stats: literals('on', 'off').onMismatch(STORE_LOG.log_stats),
    /**
      Log interval for real-time Prometheus metrics, in seconds
    */
    prometheus_interval: natural
      .optional()
      .onMismatch(STORE_LOG.prometheus_interval),
  }),
  AUTH: object({
    /**
      Set new_queues option to off to completely prohibit creating new messaging queues.
      This can be useful when you want to decommission the server, but not all connections are switched yet.
    */
    new_queues: literal(AUTH.new_queues).onMismatch(AUTH.new_queues),
    /**
      Use create_password option to enable basic auth to create new messaging queues.
      The password should be used as part of server address in client configuration:
      smp://fingerprint:password@host1,host2
      The password will not be shared with the connecting contacts, you must share it only
      with the users who you want to allow creating messaging queues on your server.
    */
    create_password: string,
    control_port_admin_password: string
      .optional()
      .onMismatch(AUTH.control_port_admin_password),
    control_port_user_password: string
      .optional()
      .onMismatch(AUTH.control_port_user_password),
  }),
  TRANSPORT: object({
    /**
      Host is only used to print server address on start.
      You can specify multiple server ports.
    */
    host: string,
    port: literal(TRANSPORT.port).onMismatch(TRANSPORT.port),
    log_tls_errors: literal(TRANSPORT.log_tls_errors).onMismatch(
      TRANSPORT.log_tls_errors,
    ),
    websockets: literal(TRANSPORT.websockets).onMismatch(TRANSPORT.websockets),
    control_port: literal(TRANSPORT.control_port).onMismatch(
      TRANSPORT.control_port,
    ),
  }),
  PROXY: object({
    socks_proxy: literal(PROXY.socks_proxy).onMismatch(PROXY.socks_proxy),
    /**
      Limit number of threads a client can spawn to process proxy commands in parallel.
    */
    client_concurrency: natural.onMismatch(PROXY.client_concurrency),
  }),
  INACTIVE_CLIENTS: object({
    /**
      Whether or not to disconnect inactive clients. If set, ttl and check_interval should also be set (seconds)
    */
    disconnect: literal(INACTIVE_CLIENTS.disconnect).onMismatch(
      INACTIVE_CLIENTS.disconnect,
    ),
  }),
  WEB: object({
    /**
      Set path to generate static mini-site for server information and qr codes/links
    */
    static_path: literal(`${smpStatePath}/www`)
      .optional()
      .onMismatch(WEB.static_path),
    /**
      Run an embedded server on this port
      Onion sites can use any port and register it in the hidden service config.
      Running on a port 80 may require setting process capabilities.
    */
    http: literal(WEB.http).onMismatch(WEB.http),
    /**
      Do not permit HTTPS, since that is handled by StartOS reverse proxy
    */
    https: nill.onMismatch(undefined),
    cert: nill.onMismatch(undefined),
    key: nill.onMismatch(undefined),
  }),
})

export const smpServerIni = FileHelper.raw<typeof shape._TYPE>(
  {
    base: sdk.volumes['smp-configs'],
    subpath: './smp-server.ini',
  },
  (inData) => INI.stringify(inData),
  (inString) => INI.parse(inString),
  (data) => shape.unsafeCast(data),
)
