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

  const torIp = await sdk
    .getContainerIp(effects, { packageId: 'tor' })
    .const()

  await smpServerIni.merge(
    effects,
    { PROXY: { socks_proxy: torIp ? `${torIp}:9050` : undefined } },
    { allowWriteAfterConst: true },
  )
})
