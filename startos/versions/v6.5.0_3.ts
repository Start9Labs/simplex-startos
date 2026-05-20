import { IMPOSSIBLE, utils, VersionInfo, YAML } from '@start9labs/start-sdk'
import { execFile } from 'child_process'
import { readdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { fileServerIni } from '../fileModels/fileServer.ini'
import { smpServerIni } from '../fileModels/smpServer.ini'

// NOTE, adding passwords to xftp server addresses. Previous addresses are less secure and expected to break.

export const v_6_5_0_3 = VersionInfo.of({
  version: '6.5.0:3',
  releaseNotes: {
    en_US:
      'Fix SMP server failing to start on fresh installs ("no key websockets in section TRANSPORT").',
    es_ES:
      'Corrige el fallo de inicio del servidor SMP en instalaciones nuevas ("no key websockets in section TRANSPORT").',
    de_DE:
      'Behebt den Startfehler des SMP-Servers bei Neuinstallationen ("no key websockets in section TRANSPORT").',
    pl_PL:
      'Naprawia błąd uruchamiania serwera SMP przy nowych instalacjach ("no key websockets in section TRANSPORT").',
    fr_FR:
      'Corrige l\'échec de démarrage du serveur SMP lors des nouvelles installations ("no key websockets in section TRANSPORT").',
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

        // seed smp-server.ini (zod schema handles all other defaults)
        await smpServerIni.merge(effects, {
          AUTH: { create_password },
        })

        // seed file-server.ini (zod schema handles all other defaults)
        await fileServerIni.merge(effects, {
          AUTH: { create_password },
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
