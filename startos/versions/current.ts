import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'

export const current = VersionInfo.of({
  version: '7.0.1:3',
  releaseNotes: {
    en_US:
      'SimpleX clients can connect to the SMP and XFTP servers through a public domain from outside your local network.',
    es_ES:
      'Los clientes de SimpleX pueden conectarse a los servidores SMP y XFTP a través de un dominio público desde fuera de tu red local.',
    de_DE:
      'SimpleX-Clients können sich über eine öffentliche Domain von außerhalb Ihres lokalen Netzwerks mit den SMP- und XFTP-Servern verbinden.',
    pl_PL:
      'Klienci SimpleX mogą łączyć się z serwerami SMP i XFTP przez domenę publiczną spoza Twojej sieci lokalnej.',
    fr_FR:
      'Les clients SimpleX peuvent se connecter aux serveurs SMP et XFTP via un domaine public depuis l’extérieur de votre réseau local.',
  },
  migrations: {
    up: async ({ effects }) => {
      // An .onion on the retired TLS leg goes unserved until reattached to the plain one.
      await storeJson.merge(effects, {
        reattachTorOnions: true,
        reattachSmpOnions: true,
      })
    },
    down: IMPOSSIBLE,
  },
})
