import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { readFile, writeFile } from 'fs/promises'

// SimpleX v6.5.0 changed the INI key/value separator from `: ` to `=`.
const INI_PATHS = [
  '/media/startos/volumes/smp-configs/smp-server.ini',
  '/media/startos/volumes/xftp-configs/file-server.ini',
]

export const v_6_5_0_0 = VersionInfo.of({
  version: '6.5.0:0',
  releaseNotes: {
    en_US: `**Bumps**

- SimpleX → 6.5.0

**Features**

- aarch64 builds are now supported in addition to x86_64.

**Internal**

- Migrated config files to the new \`=\` separator format introduced upstream in 6.5.0.`,
    es_ES: `**Actualizaciones**

- SimpleX → 6.5.0

**Funcionalidades**

- Ahora se admiten compilaciones aarch64 además de x86_64.

**Interno**

- Se migraron los archivos de configuración al nuevo separador \`=\` introducido en 6.5.0.`,
    de_DE: `**Aktualisierungen**

- SimpleX → 6.5.0

**Funktionen**

- aarch64-Builds werden jetzt zusätzlich zu x86_64 unterstützt.

**Intern**

- Konfigurationsdateien auf das neue \`=\`-Trennzeichen aus 6.5.0 umgestellt.`,
    pl_PL: `**Aktualizacje**

- SimpleX → 6.5.0

**Funkcje**

- Obsługa kompilacji aarch64 oprócz x86_64.

**Wewnętrzne**

- Pliki konfiguracyjne przeniesione na nowy separator \`=\` z 6.5.0.`,
    fr_FR: `**Mises à jour**

- SimpleX → 6.5.0

**Fonctionnalités**

- Les builds aarch64 sont désormais pris en charge en plus de x86_64.

**Interne**

- Fichiers de configuration migrés vers le nouveau séparateur \`=\` introduit en 6.5.0.`,
  },
  migrations: {
    up: async () => {
      await Promise.all(INI_PATHS.map(rewriteIniSeparator))
    },
    down: IMPOSSIBLE,
  },
})

async function rewriteIniSeparator(path: string) {
  const text = await readFile(path, 'utf-8').catch(() => null)
  if (text === null) return
  const converted = text
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return line
      if (trimmed.startsWith('#') || trimmed.startsWith(';')) return line
      if (/^\[[^\]]+\]$/.test(trimmed)) return line
      const idx = line.indexOf(': ')
      if (idx === -1) return line
      return `${line.slice(0, idx)} = ${line.slice(idx + 2)}`
    })
    .join('\n')
  if (converted !== text) {
    await writeFile(path, converted)
  }
}
