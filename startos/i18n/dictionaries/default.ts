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
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
