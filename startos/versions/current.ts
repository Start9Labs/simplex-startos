import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'

export const current = VersionInfo.of({
  version: '7.0.1:3',
  releaseNotes: {
    en_US:
      'SimpleX clients can connect to the SMP and XFTP servers through a public domain from outside your local network. If you use .onion addresses, update Tor to 0.4.9.13:1 or later to keep them working.',
    es_ES:
      'Los clientes de SimpleX pueden conectarse a los servidores SMP y XFTP a través de un dominio público desde fuera de tu red local. Si usas direcciones .onion, actualiza Tor a la versión 0.4.9.13:1 o posterior para que sigan funcionando.',
    de_DE:
      'SimpleX-Clients können sich über eine öffentliche Domain von außerhalb Ihres lokalen Netzwerks mit den SMP- und XFTP-Servern verbinden. Wenn Sie .onion-Adressen verwenden, aktualisieren Sie Tor auf 0.4.9.13:1 oder neuer, damit diese weiterhin funktionieren.',
    pl_PL:
      'Klienci SimpleX mogą łączyć się z serwerami SMP i XFTP przez domenę publiczną spoza Twojej sieci lokalnej. Jeśli używasz adresów .onion, zaktualizuj Tor do wersji 0.4.9.13:1 lub nowszej, aby nadal działały.',
    fr_FR:
      'Les clients SimpleX peuvent se connecter aux serveurs SMP et XFTP via un domaine public depuis l’extérieur de votre réseau local. Si vous utilisez des adresses .onion, mettez Tor à jour vers la version 0.4.9.13:1 ou ultérieure pour qu’elles continuent de fonctionner.',
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
