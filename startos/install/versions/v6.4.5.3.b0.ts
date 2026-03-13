import { IMPOSSIBLE, utils, VersionInfo, YAML } from '@start9labs/start-sdk'
import { execFile } from 'child_process'
import { readdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { fileServerIni } from '../../fileModels/fileServer.ini'
import { smpServerIni } from '../../fileModels/smpServer.ini'
import { smpConfigDefaults, xftpConfigDefaults } from '../../utils'

// NOTE, adding passwords to xftp server addresses. Previous addresses are less secure and expected to break.

export const v_6_4_5_3_b0 = VersionInfo.of({
  version: '6.4.5:3-beta.0',
  releaseNotes: {
    en_US: 'Update to StartOS SDK beta.59',
    es_ES: 'Actualización a StartOS SDK beta.59',
    de_DE: 'Update auf StartOS SDK beta.59',
    pl_PL: 'Aktualizacja do StartOS SDK beta.59',
    fr_FR: 'Mise à jour vers StartOS SDK beta.59',
  },
  migrations: {
    up: async ({ effects }) => {
      // get old stats.yaml
      const statsYaml:
        | {
            data: {
              'SimpleX SMP Server Address': {
                value: string
              }
            }
          }
        | undefined = await readFile(
        '/media/startos/volumes/main/start9/stats.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (statsYaml) {
        // config (was used for smp-server.ini)
        await new Promise((res, rej) => {
          execFile(
            'sh',
            [
              '-c',
              'mv /media/startos/volumes/conf/* /media/startos/volumes/smp-configs',
            ],
            (err) => (err ? rej(err) : res(null)),
          )
        }).catch(console.error)

        // xftp (was used for file-server.ini)
        await new Promise((res, rej) => {
          execFile(
            'sh',
            [
              '-c',
              'mv /media/startos/volumes/xftp/* /media/startos/volumes/xftp-configs',
            ],
            (err) => (err ? rej(err) : res(null)),
          )
        }).catch(console.error)

        // log (was used for smp-state)
        await new Promise((res, rej) => {
          execFile(
            'sh',
            [
              '-c',
              'mv /media/startos/volumes/log/* /media/startos/volumes/smp-state',
            ],
            (err) => (err ? rej(err) : res(null)),
          )
        }).catch(console.error)

        // main (was used for xftp files)
        await new Promise((res, rej) => {
          execFile(
            'sh',
            [
              '-c',
              'mv /media/startos/volumes/xftp/* /media/startos/volumes/xftp-files',
            ],
            (err) => (err ? rej(err) : res(null)),
          )
        }).catch(console.error)

        const create_password =
          new URL(
            statsYaml.data['SimpleX SMP Server Address'].value.replace(
              'smp://',
              'https://',
            ),
          ).password ||
          utils.getDefaultString({
            charset: 'a-z,A-Z,1-9,!,$,%,&,*',
            len: 21,
          })

        // overwrite smp-server.ini
        await smpServerIni.write(effects, {
          ...smpConfigDefaults,
          AUTH: { ...smpConfigDefaults.AUTH, create_password },
        })

        // overwrite file-server.ini
        await fileServerIni.write(effects, {
          ...xftpConfigDefaults,
          AUTH: { ...xftpConfigDefaults.AUTH, create_password },
        })
        // remove everything from old volumes
        await Promise.all(
          ['conf', 'xftp', 'log', 'main'].map((vol) =>
            clearVolume(`/media/startos/volumes/${vol}`),
          ),
        )
      }
    },
    down: IMPOSSIBLE,
  },
})

async function clearVolume(volumePath: string) {
  const entries = await readdir(volumePath)
  await Promise.all(
    entries.map((entry) =>
      rm(join(volumePath, entry), { recursive: true }).catch(console.error),
    ),
  )
}
