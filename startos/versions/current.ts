import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '7.1.0:0',
  releaseNotes: {
    en_US: `Updated SimpleX Server to 7.1.0.

- Very old SimpleX apps can no longer connect to this server. Update the SimpleX app on every device that uses it.
- Security fixes for the SMP and XFTP servers, including a fix that kept file senders from writing outside the server's file storage.
- Lower load from message expiration.

[Full release notes](https://github.com/simplex-chat/simplexmq/releases/tag/v7.1.0)`,
    es_ES: `Se actualizó SimpleX Server a 7.1.0.

- Las versiones muy antiguas de las aplicaciones de SimpleX ya no pueden conectarse a este servidor. Actualiza la aplicación de SimpleX en cada dispositivo que lo use.
- Correcciones de seguridad para los servidores SMP y XFTP, incluida una que impide que los remitentes de archivos escriban fuera del almacenamiento de archivos del servidor.
- Menor carga por la caducidad de mensajes.

[Notas de la versión completas](https://github.com/simplex-chat/simplexmq/releases/tag/v7.1.0)`,
    de_DE: `SimpleX Server auf 7.1.0 aktualisiert.

- Sehr alte SimpleX-Apps können sich nicht mehr mit diesem Server verbinden. Aktualisieren Sie die SimpleX-App auf jedem Gerät, das ihn nutzt.
- Sicherheitskorrekturen für die SMP- und XFTP-Server, darunter eine, die verhindert, dass Absender von Dateien außerhalb des Dateispeichers des Servers schreiben.
- Geringere Last durch das Ablaufen von Nachrichten.

[Vollständige Versionshinweise](https://github.com/simplex-chat/simplexmq/releases/tag/v7.1.0)`,
    pl_PL: `Zaktualizowano SimpleX Server do wersji 7.1.0.

- Bardzo stare wersje aplikacji SimpleX nie mogą już łączyć się z tym serwerem. Zaktualizuj aplikację SimpleX na każdym urządzeniu, które z niego korzysta.
- Poprawki bezpieczeństwa serwerów SMP i XFTP, w tym jedna uniemożliwiająca nadawcom plików zapis poza magazynem plików serwera.
- Mniejsze obciążenie związane z wygasaniem wiadomości.

[Pełne informacje o wydaniu](https://github.com/simplex-chat/simplexmq/releases/tag/v7.1.0)`,
    fr_FR: `Mise à jour de SimpleX Server vers la version 7.1.0.

- Les très anciennes versions des applications SimpleX ne peuvent plus se connecter à ce serveur. Mettez à jour l’application SimpleX sur chaque appareil qui l’utilise.
- Correctifs de sécurité pour les serveurs SMP et XFTP, dont un qui empêche les expéditeurs de fichiers d’écrire en dehors du stockage de fichiers du serveur.
- Charge réduite liée à l’expiration des messages.

[Notes de version complètes](https://github.com/simplex-chat/simplexmq/releases/tag/v7.1.0)`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
