import { sdk } from './sdk'

export const smpPort = 5223
export const smpControlPort = 5224

export const xftpPort = 5225
export const xftpControlPort = 5226

export const smpStatePath = '/var/opt/simplex'
export const xftpFilePath = '/srv/xftp'

export const webPort = 8000

export const smpMounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'smp-configs',
    subpath: null,
    mountpoint: '/etc/opt/simplex',
    readonly: false,
  })
  .mountVolume({
    volumeId: 'smp-state',
    subpath: null,
    mountpoint: smpStatePath,
    readonly: false,
  })

export const xftpMounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'xftp-configs',
    subpath: null,
    mountpoint: '/etc/opt/simplex-xftp',
    readonly: false,
  })
  .mountVolume({
    volumeId: 'xftp-state',
    subpath: null,
    mountpoint: '/var/opt/simplex-xftp',
    readonly: false,
  })
  .mountVolume({
    volumeId: 'xftp-files',
    subpath: null,
    mountpoint: xftpFilePath,
    readonly: false,
  })

export const smpConfigDefaults = {
  INFORMATION: {
    source_code: 'https://github.com/simplex-chat/simplexmq/',
  },
  STORE_LOG: {
    enable: 'on',
    store_queues: 'memory',
    store_messages: 'memory',
    restore_messages: 'on',
    expire_messages_days: 365, // @TODO ask Evgany
    expire_messages_on_start: 'off',
    expire_ntfs_hours: 168,
    log_stats: 'on',
    prometheus_interval: undefined,
  },
  AUTH: {
    new_queues: 'on',
    control_port_admin_password: undefined,
    control_port_user_password: undefined,
  },
  TRANSPORT: {
    host: '<hostnames>',
    port: `${smpPort},443`,
    log_tls_errors: 'off',
    websockets: 'off',
    control_port: smpControlPort,
  },
  PROXY: {
    socks_proxy: '127.0.0.1:9050',
    client_concurrency: 32,
  },
  INACTIVE_CLIENTS: {
    disconnect: 'off',
  },
  WEB: {
    static_path: undefined,
    http: webPort,
    https: undefined,
    cert: undefined,
    key: undefined,
  },
} as const

export const xftpConfigDefaults = {
  STORE_LOG: {
    enable: 'on',
    expire_files_hours: 168,
    log_stats: 'off',
    prometheus_interval: undefined,
  },
  AUTH: {
    new_files: 'on',
    control_port_admin_password: undefined,
    control_port_user_password: undefined,
  },
  TRANSPORT: {
    host: '<hostnames>',
    port: xftpPort,
    log_tls_errors: 'off',
    control_port: xftpControlPort,
  },
  FILES: {
    path: xftpFilePath,
    storage_quota: '10gb',
  },
  INACTIVE_CLIENTS: {
    disconnect: 'off',
  },
} as const
