import { socksHostId, socksPort } from 'tor-startos/startos/utils'
import { smpServerIni } from '../fileModels/smpServer.ini'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const watchTorProxy = sdk.setupOnInit(async (effects) => {
  const enableTorProxy = await storeJson
    .read((s) => s?.enableTorProxy ?? false)
    .const(effects)

  if (!enableTorProxy) {
    await smpServerIni.merge(
      effects,
      { PROXY: { socks_proxy: undefined } },
      { allowWriteAfterConst: true },
    )
    return
  }

  // Tor SOCKS over the bridge, no fallback: anonymizing semantics mean a dead
  // address must not be dialed, so the proxy line is written only once Tor's
  // binding resolves. The mapped address changes solely on Tor
  // install/uninstall/port-change, so this .const() heals on late Tor install
  // (one restart) and never restarts the server on Tor updates.
  const socksProxy = await sdk.host
    .getBridgeAddress(effects, {
      packageId: 'tor',
      hostId: socksHostId,
      internalPort: socksPort,
    })
    .const()

  await smpServerIni.merge(
    effects,
    { PROXY: { socks_proxy: socksProxy ?? undefined } },
    { allowWriteAfterConst: true },
  )
})
