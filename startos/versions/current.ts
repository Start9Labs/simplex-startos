import { IMPOSSIBLE, utils, VersionInfo, YAML } from '@start9labs/start-sdk'
import { execFile } from 'child_process'
import { readdir, readFile, rm } from 'fs/promises'
import { join } from 'path'
import { fileServerIni } from '../fileModels/fileServer.ini'
import { smpServerIni } from '../fileModels/smpServer.ini'

// NOTE, adding passwords to xftp server addresses. Previous addresses are less secure and expected to break.

export const current = VersionInfo.of({
  version: '6.5.2:0',
  releaseNotes: {
    en_US: `Updated SimpleX (smp-server & xftp-server) to 6.5.2.

- XFTP: backwards-compatible file header decoding.
- XFTP: server web page tweaks.

Full changelog: https://github.com/simplex-chat/simplexmq/blob/master/CHANGELOG.md`,
    es_ES: `Actualizado SimpleX (smp-server y xftp-server) a 6.5.2.

- XFTP: decodificación de encabezados de archivo retrocompatible.
- XFTP: ajustes en la página web del servidor.

Registro de cambios completo: https://github.com/simplex-chat/simplexmq/blob/master/CHANGELOG.md`,
    de_DE: `SimpleX (smp-server & xftp-server) auf 6.5.2 aktualisiert.

- XFTP: abwärtskompatible Dekodierung von Datei-Headern.
- XFTP: Anpassungen der Server-Webseite.

Vollständiges Änderungsprotokoll: https://github.com/simplex-chat/simplexmq/blob/master/CHANGELOG.md`,
    pl_PL: `Zaktualizowano SimpleX (smp-server i xftp-server) do 6.5.2.

- XFTP: wstecznie zgodne dekodowanie nagłówków plików.
- XFTP: poprawki strony internetowej serwera.

Pełna lista zmian: https://github.com/simplex-chat/simplexmq/blob/master/CHANGELOG.md`,
    fr_FR: `Mise à jour de SimpleX (smp-server et xftp-server) vers 6.5.2.

- XFTP : décodage des en-têtes de fichier rétrocompatible.
- XFTP : ajustements de la page web du serveur.

Journal des modifications complet : https://github.com/simplex-chat/simplexmq/blob/master/CHANGELOG.md`,
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
              'mv /media/startos/volumes/main/xftp/* /media/startos/volumes/xftp-files',
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
