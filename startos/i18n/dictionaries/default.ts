export const DEFAULT_LANG = 'en_US'

const dict = {
  'Starting SimpleX!': 0,
  'No smp-server.ini': 1,
  'No file-server.ini': 2,
  'SMP Server': 3,
  'The SMP server is ready': 4,
  'The SMP server is not ready': 5,
  'XFTP Server': 6,
  'The XFTP server is ready': 7,
  'The XFTP server is not ready': 8,
  'The SMP server for SimpleX': 9,
  'The XFTP server for SimpleX': 10,
  'Enable Tor SOCKS Proxy': 11,
  'Tor Settings': 12,
  'SimpleX clients use private routing (2-hop onion routing) by asking an SMP server to forward messages to the recipient’s server; if a recipient’s server is reachable only on Tor, the forwarding server must have a Tor SOCKS proxy to reach it. Enabling this adds a running dependency on the Tor service and writes it to [PROXY] socks_proxy in smp-server.ini.': 13,
  'Configure whether this SMP server forwards messages to .onion destination servers via Tor.': 14,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
