import { sdk } from '../sdk'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { initServers } from './initServers'
import { reattachTorOnions } from './reattachTorOnions'
import { watchTorProxy } from './watchTorProxy'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  initServers,
  setInterfaces,
  actions,
  dependencies,
  watchTorProxy,
  reattachTorOnions,
)

export const uninit = sdk.setupUninit(versionGraph)
