import { sdk } from './sdk'
import { smpPort, webPort, xftpPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // ** SMP Server **
  const smpMulti = sdk.MultiHost.of(effects, 'smp-multi')

  // smp
  const smpMultiOrigin = await smpMulti.bindPort(smpPort, {
    protocol: 'http',
  })
  const smp = sdk.createInterface(effects, {
    name: 'SMP Server',
    id: 'smp',
    description: 'The SMP server for SimpleX',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const smpReceipt = await smpMultiOrigin.export([smp])

  // admin
  const adminMultiOrigin = await smpMulti.bindPort(webPort, {
    protocol: 'http',
  })
  const admin = sdk.createInterface(effects, {
    name: 'Admin UI',
    id: 'admin',
    description: 'Your SimpleX SMP server admin user interface',
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const adminReceipt = await adminMultiOrigin.export([admin])

  // ** XFTP Server **
  const xftpMulti = sdk.MultiHost.of(effects, 'xftp-multi')
  const xftpMultiOrigin = await xftpMulti.bindPort(xftpPort, {
    protocol: 'http',
  })
  const xftp = sdk.createInterface(effects, {
    name: 'XFTP Server',
    id: 'xftp',
    description: 'The XFTP server for SimpleX',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const xftpReceipt = await xftpMultiOrigin.export([xftp])

  return [smpReceipt, adminReceipt, xftpReceipt]
})
