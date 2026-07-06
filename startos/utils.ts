import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'

/**
 * Bridge address (`10.0.3.1:<assigned external port>`) of a dependency's
 * binding, as a minimal reactive value. Chain `.const()` in main (or an init
 * watcher): the mapped string only changes when the address itself does, so
 * the service restarts exactly on dependency install/uninstall/port-change
 * and never on dependency updates. Chain `.once()` in an action context.
 * `fallbackPort` keeps the value non-null while the dependency is absent —
 * sanctioned only for tor's allocator-guaranteed SOCKS 9050. Drop-in for the
 * planned SDK `sdk.host.getBridgeAddress` helper.
 */
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort: number
  },
): { const(): Promise<string>; once(): Promise<string> }
export function bridgeAddress(
  effects: T.Effects,
  opts: { packageId: string; hostId: string; internalPort: number },
): { const(): Promise<string | null>; once(): Promise<string | null> }
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort?: number
  },
) {
  const watchable = async () => {
    const osIp = await sdk.getOsIp(effects)
    return sdk.host.get(
      effects,
      { packageId: opts.packageId, hostId: opts.hostId },
      (host) => {
        const port =
          host?.bindings[opts.internalPort]?.net.assignedPort ??
          opts.fallbackPort
        return port != null ? `${osIp}:${port}` : null
      },
    )
  }
  return {
    const: async () => (await watchable()).const(),
    once: async () => (await watchable()).once(),
  }
}

export const smpPort = 5223
export const smpControlPort = 5224
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
