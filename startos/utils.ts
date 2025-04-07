export const smpPort = 5223
export const xftpPort = 443
export const controlPort = 5224
export const webPort = 443

export const source_code = 'https://github.com/simplex-chat/simplexmq/'

export const randomPassword = {
  charset: 'a-z,A-Z,1-9,!,$,%,&,*',
  len: 21,
}

export const smpConfigDefaults = {
  information: {
    // Basic info
    LICENSE: undefined,
    source_code,

    // Server usage conditions and amendments.
    usage_conditions: undefined,
    condition_amendments: undefined,

    // Server location and operator
    server_country: undefined,
    operator: undefined,
    operator_country: undefined,
    website: undefined,

    // Administrative contacts
    admin_simplex: undefined, // SimpleX address
    admin_email: undefined,
    admin_pgp: undefined,
    admin_pgp_fingerprint: undefined,

    // Contacts for complaints and feedback.
    complaints_simplex: undefined, // SimpleX address
    complaints_email: undefined,
    complaints_pgp: undefined,
    complaints_pgp_fingerprint: undefined,

    // Hosting provider
    hosting: undefined, // entity organization or person name
    hosting_country: undefined, // ISO-3166 2-letter code
  },
  store_log: {
    enable: 'on' as const,

    restore_messages: 'on' as const,
    expire_messages_days: 21,
    expire_ntfs_hours: 24,

    log_stats: 'on' as const,
  },
  auth: {
    new_queues: 'on' as const,

    create_password: '', // any printable ASCII characters without whitespace, '@', ':' and '/'

    control_port_admin_password: '',
    control_port_user_password: '',
  },
  transport: {
    host: 'hostnames', // <domain/ip>
    port: 5223,
    log_tls_errors: 'off' as const,

    websockets: 'off' as const,
    control_port: controlPort,
  },
  proxy: {
    // Network configuration for SMP proxy client.
    host_mode: 'public' as const,
    required_host_mode: 'off' as const,

    own_server_domains: [],

    socks_proxy: '',
    socks_mode: 'onion' as const,

    client_concurrency: 32,
  },
  inactive_clients: {
    disconnect: 'off' as const,
    ttl: 21600,
    check_interval: 3600,
  },
  web: {
    static_path: 'var/opt/simplex/www',
    http: undefined,

    https: webPort,
    cert: '', // @TODO Aiden
    key: '', // @TODO Aiden
  },
}
