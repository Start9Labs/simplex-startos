import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '7.0.0:0',
  releaseNotes: {
    en_US: `Updated SimpleX to 7.0.0.

- Fixes two memory leaks in the SMP server that grew as clients subscribed and unsubscribed.
- The SMP proxy reconnects reliably to a relay after that relay restarts.
- Hardening across cryptography and message parsing, including a limit on decompressed message size.
- Accepts IPv6 server addresses written in bracketed form.

Full upstream release notes: https://github.com/simplex-chat/simplexmq/releases/tag/v7.0.0`,
    es_ES: `Actualiza SimpleX a la versión 7.0.0.

- Corrige dos fugas de memoria en el servidor SMP que crecían a medida que los clientes se suscribían y cancelaban su suscripción.
- El proxy SMP se reconecta de forma fiable a un repetidor después de que este se reinicie.
- Refuerzo de la criptografía y del análisis de mensajes, incluido un límite en el tamaño de los mensajes descomprimidos.
- Acepta direcciones de servidor IPv6 escritas entre corchetes.

Notas completas de la versión original: https://github.com/simplex-chat/simplexmq/releases/tag/v7.0.0`,
    de_DE: `Aktualisiert SimpleX auf 7.0.0.

- Behebt zwei Speicherlecks im SMP-Server, die mit dem An- und Abmelden von Clients anwuchsen.
- Der SMP-Proxy verbindet sich nach einem Neustart des Relays zuverlässig wieder mit diesem.
- Härtung von Kryptografie und Nachrichtenverarbeitung, einschließlich einer Begrenzung der entpackten Nachrichtengröße.
- Akzeptiert IPv6-Serveradressen in Klammerschreibweise.

Vollständige Versionshinweise des Upstream-Projekts: https://github.com/simplex-chat/simplexmq/releases/tag/v7.0.0`,
    pl_PL: `Aktualizuje SimpleX do wersji 7.0.0.

- Naprawia dwa wycieki pamięci w serwerze SMP, które narastały wraz z subskrybowaniem i anulowaniem subskrypcji przez klientów.
- Proxy SMP niezawodnie łączy się ponownie z przekaźnikiem po jego ponownym uruchomieniu.
- Wzmocnienia w kryptografii i przetwarzaniu wiadomości, w tym limit rozmiaru zdekompresowanych wiadomości.
- Obsługuje adresy serwerów IPv6 zapisane w nawiasach kwadratowych.

Pełne informacje o wydaniu od twórców: https://github.com/simplex-chat/simplexmq/releases/tag/v7.0.0`,
    fr_FR: `Met à jour SimpleX vers la version 7.0.0.

- Corrige deux fuites de mémoire du serveur SMP qui augmentaient au fil des abonnements et désabonnements des clients.
- Le proxy SMP se reconnecte de manière fiable à un relais après le redémarrage de celui-ci.
- Renforcement de la cryptographie et de l'analyse des messages, dont une limite sur la taille des messages décompressés.
- Accepte les adresses de serveur IPv6 écrites entre crochets.

Notes de version complètes du projet amont : https://github.com/simplex-chat/simplexmq/releases/tag/v7.0.0`,
  },
  migrations: {},
})
