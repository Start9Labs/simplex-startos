import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

export const manifest = setupManifest({
  id: 'simplex',
  title: 'SimpleX Server',
  license: 'AGPL-3.0',
  packageRepo: 'https://github.com/Start9Labs/simplex-startos',
  upstreamRepo: 'https://github.com/simplex-chat/simplexmq/',
  marketingUrl: 'https://simplex.chat/',
  donationUrl:
    'https://github.com/simplex-chat/simplex-chat#help-us-with-donations',
  description: i18n.description,
  volumes: [
    'smp-configs',
    'smp-state',
    'xftp-configs',
    'xftp-state',
    'xftp-files',
    'main', // migration
    'conf', // migration
    'xftp', // migration
    'log', // migration
  ],
  images: {
    smp: {
      source: {
        dockerTag: 'simplexchat/smp-server:v6.5.0',
      },
      arch: ['x86_64', 'aarch64'],
    },
    xftp: {
      source: {
        dockerTag: 'simplexchat/xftp-server:v6.5.0',
      },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {
    tor: {
      description: i18n.torDescription,
      optional: true,
      metadata: {
        title: 'Tor',
        icon: 'https://raw.githubusercontent.com/Start9Labs/tor-startos/65faea17febc739d910e8c26ff4e61f6333487a8/icon.svg',
      },
    },
  },
})
