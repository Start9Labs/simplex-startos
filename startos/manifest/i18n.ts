export default {
  journalStorageUpgradeWarning: {
    en_US:
      'SimpleX 7.1.0 removes SMP journal message storage. **If you manually set `store_messages = journal`, cancel this update and migrate to memory storage with the installed server first.** The new server cannot start with journal storage or export its contents. Default installations already use memory storage and need no change.',
    es_ES:
      'SimpleX 7.1.0 elimina el almacenamiento de mensajes SMP en journal. **Si configuraste manualmente `store_messages = journal`, cancela esta actualización y migra primero al almacenamiento en memoria con el servidor instalado.** El nuevo servidor no puede iniciarse con el almacenamiento en journal ni exportar su contenido. Las instalaciones predeterminadas ya usan el almacenamiento en memoria y no necesitan cambios.',
    de_DE:
      'SimpleX 7.1.0 entfernt den SMP-Nachrichtenspeicher im Journal. **Wenn Sie manuell `store_messages = journal` eingestellt haben, brechen Sie dieses Update ab und migrieren Sie zuerst mit dem installierten Server zum Speicher im Arbeitsspeicher.** Der neue Server kann mit dem Journal-Speicher weder starten noch dessen Inhalt exportieren. Standardinstallationen verwenden bereits den Speicher im Arbeitsspeicher und benötigen keine Änderung.',
    pl_PL:
      'SimpleX 7.1.0 usuwa magazyn wiadomości SMP typu journal. **Jeśli ręcznie ustawiono `store_messages = journal`, anuluj tę aktualizację i najpierw przeprowadź migrację do magazynu w pamięci za pomocą zainstalowanego serwera.** Nowy serwer nie może uruchomić się z magazynem journal ani wyeksportować jego zawartości. Domyślne instalacje już korzystają z magazynu w pamięci i nie wymagają zmian.',
    fr_FR:
      'SimpleX 7.1.0 supprime le stockage des messages SMP en journal. **Si vous avez défini manuellement `store_messages = journal`, annulez cette mise à jour et migrez d’abord vers le stockage en mémoire avec le serveur installé.** Le nouveau serveur ne peut ni démarrer avec le stockage en journal ni en exporter le contenu. Les installations par défaut utilisent déjà le stockage en mémoire et ne nécessitent aucun changement.',
  },
  torDescription: {
    en_US:
      'Required when Enable Tor SOCKS Proxy is turned on in the Tor Settings action. The SMP server uses Tor to forward messages to .onion destination servers on behalf of clients that use this server as their private-routing relay.',
  },
  description: {
    short: {
      en_US: 'Freedom & security of your communications',
      es_ES: 'Libertad y seguridad de tus comunicaciones',
      de_DE: 'Freiheit und Sicherheit Ihrer Kommunikation',
      pl_PL: 'Wolność i bezpieczeństwo Twojej komunikacji',
      fr_FR: 'Liberté et sécurité de vos communications',
    },
    long: {
      en_US:
        'An open-source, decentralized messenger designed for maximum privacy and control.',
      es_ES:
        'Un mensajero descentralizado y de código abierto diseñado para máxima privacidad y control.',
      de_DE:
        'Ein quelloffener, dezentraler Messenger für maximale Privatsphäre und Kontrolle.',
      pl_PL:
        'Otwartoźródłowy, zdecentralizowany komunikator zaprojektowany z myślą o maksymalnej prywatności i kontroli.',
      fr_FR:
        'Un messager open source et décentralisé conçu pour une confidentialité et un contrôle maximaux.',
    },
  },
}
