import { sdk } from '../sdk'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'
import { initServers } from './initServers'
import { watchTorProxy } from './watchTorProxy'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  setInterfaces,
  actions,
  initServers,
  watchTorProxy,
  setDependencies,
)

export const uninit = sdk.setupUninit(versionGraph)
