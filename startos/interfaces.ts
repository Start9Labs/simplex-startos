import { FileHelper } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { smpPort, webPort, xftpPort } from './utils'
import { smpServerIni } from './fileModels/smpServer.ini'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // get fingerprints
  const smpFingerprint = await FileHelper.string({
    base: sdk.volumes['smp-configs'],
    subpath: './fingerprint',
  })
    .read()
    .const(effects)
    .then((f) => f?.trim())

  const xftpFingerprint = await FileHelper.string({
    base: sdk.volumes['xftp-configs'],
    subpath: './fingerprint',
  })
    .read()
    .const(effects)
    .then((f) => f?.trim())

  // get password
  const password = await smpServerIni
    .read((s) => s.AUTH.create_password)
    .const(effects)

  // ** SMP Server **
  const smpMulti = sdk.MultiHost.of(effects, 'main')
  const smpMultiOrigin = await smpMulti.bindPort(smpPort, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: smpPort,
    secure: { ssl: true },
  })
  const smp = sdk.createInterface(effects, {
    name: 'SMP Server',
    id: 'smp',
    description: 'The SMP server for SimpleX',
    type: 'api',
    masked: true,
    schemeOverride: { ssl: 'smp', noSsl: 'smp' },
    username: `${smpFingerprint}:${password}`,
    path: '',
    query: {},
  })
  const smpReceipt = await smpMultiOrigin.export([smp])

  // ** XFTP Server **
  const xftpMulti = sdk.MultiHost.of(effects, 'xftp')
  const xftpMultiOrigin = await xftpMulti.bindPort(xftpPort, {
    protocol: null,
    addSsl: null,
    preferredExternalPort: xftpPort,
    secure: { ssl: true },
  })
  const xftp = sdk.createInterface(effects, {
    name: 'XFTP Server',
    id: 'xftp',
    description: 'The XFTP server for SimpleX',
    type: 'api',
    masked: true,
    schemeOverride: { ssl: 'xftp', noSsl: 'xftp' },
    username: `${xftpFingerprint}:${password}`,
    path: '',
    query: {},
  })
  const xftpReceipt = await xftpMultiOrigin.export([xftp])

  const receipts = [smpReceipt, xftpReceipt]

  // @TODO consider implementing optional web info page
  // if (store.enableWeb) {
  //   const infoMultiOrigin = await smpMulti.bindPort(webPort, {
  //     protocol: 'http',
  //   })
  //   const info = sdk.createInterface(effects, {
  //     name: 'Info UI',
  //     id: 'info',
  //     description: 'Information about your SMP server',
  //     type: 'ui',
  //     masked: false,
  //     schemeOverride: null,
  //     username: null,
  //     path: '',
  //     query: {},
  //   })
  //   receipts.push(await infoMultiOrigin.export([info]))
  // }

  return receipts
})
