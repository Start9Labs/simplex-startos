import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '7.0.1:1',
  releaseNotes: {
    en_US: `Fixes the SMP and XFTP relay addresses being published before the server has finished initializing, which briefly advertised an address no client could use.

Updated SimpleX to 7.0.1.

A small maintenance release with a single fix for the SMP server: when relaying messages for private routing, the server no longer creates an internal message queue that was never drained, which could leak memory and stall message processing. The XFTP file server is unchanged.

Full upstream release notes: https://github.com/simplex-chat/simplexmq/releases/tag/v7.0.1`,
    es_ES: `Corrige la publicación de las direcciones de los relés SMP y XFTP antes de que el servidor termine de inicializarse, lo que anunciaba brevemente una dirección que ningún cliente podía usar.

Actualiza SimpleX a la versión 7.0.1.

Una pequeña versión de mantenimiento con una única corrección para el servidor SMP: al retransmitir mensajes para el enrutamiento privado, el servidor ya no crea una cola de mensajes interna que nunca se vaciaba, lo que podía provocar fugas de memoria y detener el procesamiento de mensajes. El servidor de archivos XFTP no ha cambiado.

Notas completas de la versión original: https://github.com/simplex-chat/simplexmq/releases/tag/v7.0.1`,
    de_DE: `Behebt, dass die SMP- und XFTP-Relay-Adressen veröffentlicht wurden, bevor der Server seine Initialisierung abgeschlossen hatte, wodurch kurzzeitig eine für Clients unbrauchbare Adresse angezeigt wurde.

Aktualisiert SimpleX auf 7.0.1.

Eine kleine Wartungsversion mit einer einzigen Korrektur für den SMP-Server: Beim Weiterleiten von Nachrichten für das Private Routing erstellt der Server keine interne Nachrichtenwarteschlange mehr, die nie geleert wurde und zu Speicherlecks sowie zum Stocken der Nachrichtenverarbeitung führen konnte. Der XFTP-Dateiserver ist unverändert.

Vollständige Versionshinweise des Upstream-Projekts: https://github.com/simplex-chat/simplexmq/releases/tag/v7.0.1`,
    pl_PL: `Naprawia publikowanie adresów przekaźników SMP i XFTP, zanim serwer zakończy inicjalizację, przez co przez chwilę ogłaszany był adres nieużyteczny dla klientów.

Aktualizuje SimpleX do wersji 7.0.1.

Niewielkie wydanie konserwacyjne z jedną poprawką serwera SMP: podczas przekazywania wiadomości w ramach prywatnego routingu serwer nie tworzy już wewnętrznej kolejki wiadomości, która nigdy nie była opróżniana, co mogło powodować wycieki pamięci i wstrzymanie przetwarzania wiadomości. Serwer plików XFTP pozostaje bez zmian.

Pełne informacje o wydaniu od twórców: https://github.com/simplex-chat/simplexmq/releases/tag/v7.0.1`,
    fr_FR: `Corrige la publication des adresses des relais SMP et XFTP avant la fin de l'initialisation du serveur, qui annonçait brièvement une adresse inutilisable par les clients.

Met à jour SimpleX vers la version 7.0.1.

Une petite version de maintenance avec un seul correctif pour le serveur SMP : lors du relais de messages pour le routage privé, le serveur ne crée plus de file d'attente de messages interne qui n'était jamais vidée, ce qui pouvait entraîner des fuites de mémoire et bloquer le traitement des messages. Le serveur de fichiers XFTP est inchangé.

Notes de version complètes du projet amont : https://github.com/simplex-chat/simplexmq/releases/tag/v7.0.1`,
  },
  migrations: {},
})
