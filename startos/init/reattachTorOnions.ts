import { setupOnionReattachment } from 'tor-startos/startos/utils/reattach'
import { storeJson } from '../fileModels/store.json'
import { manifest } from '../manifest'
import { sdk } from '../sdk'
import { smpPort, xftpHostId, xftpInterfaceId, xftpPort } from '../utils'

export const reattachXftpOnions = setupOnionReattachment(sdk, {
  packageId: manifest.id,
  hostId: xftpHostId,
  to: { interfaceId: xftpInterfaceId, internalPort: xftpPort, ssl: false },
  pending: storeJson.read((s) => s.reattachTorOnions),
  clear: (effects) =>
    storeJson.merge(
      effects,
      { reattachTorOnions: false },
      { allowWriteAfterConst: true },
    ),
})

export const reattachSmpOnions = setupOnionReattachment(sdk, {
  packageId: manifest.id,
  hostId: 'main',
  to: { interfaceId: 'smp', internalPort: smpPort, ssl: false },
  pending: storeJson.read((s) => s.reattachSmpOnions),
  clear: (effects) =>
    storeJson.merge(
      effects,
      { reattachSmpOnions: false },
      { allowWriteAfterConst: true },
    ),
})
