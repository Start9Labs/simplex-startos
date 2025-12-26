import { matches, FileHelper } from '@start9labs/start-sdk'
import { xftpConfigDefaults } from '../utils'

const { object, literals, natural, string, literal } = matches

const { STORE_LOG, AUTH, TRANSPORT, FILES, INACTIVE_CLIENTS } =
  xftpConfigDefaults

const shape = object({
  STORE_LOG: object({
    /**
      The server uses STM memory for persistence,
      that will be lost on restart (e.g., as with redis).
      This option enables saving memory to append only log,
      and restoring it when the server is started.
      Log is compacted on start (deleted objects are removed).
    */
    enable: literals('on', 'off').onMismatch(STORE_LOG.enable),
    /**
      Expire files after the specified number of hours.
    */
    expire_files_hours: natural
      .optional()
      .onMismatch(STORE_LOG.expire_files_hours),
    /**
      Enable xftp-server statistics for Grafana dashboard
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
      Set new_files option to off to completely prohibit uploading new files.
      This can be useful when you want to decommission the server, but still allow downloading the existing files.
    */
    new_files: literals('on', 'off').onMismatch(AUTH.new_files),
    /**
      Use create_password option to enable basic auth to upload new files.
      The password should be used as part of server address in client configuration:
      xftp://fingerprint:password@host1,host2
      The password will not be shared with file recipients, you must share it only
      with the users who you want to allow uploading files to your server.
      Password to upload files (any printable ASCII characters without whitespace, '@', ':' and '/') 
    */
    create_password: string,
    control_port_admin_password: string.optional().onMismatch(AUTH.new_files),
    control_port_user_password: string.optional().onMismatch(AUTH.new_files),
  }),
  TRANSPORT: object({
    /**
      host is only used to print server address on start
    */
    host: string,
    port: literal(TRANSPORT.port).onMismatch(TRANSPORT.port),
    log_tls_errors: literals('on', 'off').onMismatch(TRANSPORT.log_tls_errors),
    control_port: natural.optional().onMismatch(TRANSPORT.control_port),
  }),
  FILES: object({
    path: literal(FILES.path),
    storage_quota: string.onMismatch(FILES.storage_quota),
  }),
  INACTIVE_CLIENTS: object({
    /**
      Whether or not to disconnect inactive clients. If set, ttl and check_interval should also be set (seconds)
    */
    disconnect: literals(INACTIVE_CLIENTS.disconnect).onMismatch(
      INACTIVE_CLIENTS.disconnect,
    ),
  }),
})

export const fileServerIni = FileHelper.ini(
  {
    volumeId: 'xftp-configs',
    subpath: './file-server.ini',
  },
  shape,
)
