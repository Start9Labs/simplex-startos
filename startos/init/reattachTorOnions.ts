import { setupOnionReattachment } from 'tor-startos/startos/utils/reattach'
import { storeJson } from '../fileModels/store.json'
import { manifest } from '../manifest'
import { sdk } from '../sdk'
import { xftpHostId, xftpInterfaceId, xftpPort } from '../utils'

export const reattachTorOnions = setupOnionReattachment(sdk, {
  packageId: manifest.id,
  hostId: xftpHostId,
  to: { interfaceId: xftpInterfaceId, internalPort: xftpPort, ssl: true },
  pending: storeJson.read((s) => s.reattachTorOnions),
  clear: (effects) =>
    storeJson.merge(
      effects,
      { reattachTorOnions: false },
      { allowWriteAfterConst: true },
    ),
})
