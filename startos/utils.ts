import { sdk } from './sdk'

export const smpPort = 5223
export const xftpPort = 5225

export const smpStatePath = '/var/opt/simplex'
export const xftpFilePath = '/srv/xftp'
export const xftpStorageQuota = '10gb'

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
