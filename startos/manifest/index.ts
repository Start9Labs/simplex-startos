import { setupManifest } from '@start9labs/start-sdk'
import i18n from './i18n'

export const manifest = setupManifest({
  id: 'simplex',
  title: 'SimpleX Server',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/simplex-startos',
  upstreamRepo: 'https://github.com/simplex-chat/simplexmq/',
  supportSite: 'https://github.com/simplex-chat/simplexmq//issues',
  marketingSite: 'https://simplex.chat/',
  docsUrl: 'https://simplex.chat/docs/',
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
        dockerTag: 'simplexchat/smp-server:v6.4.5',
      },
      // @TODO aarch64 coming after 6.4.5
      arch: ['x86_64'],
    },
    xftp: {
      source: {
        dockerTag: 'simplexchat/xftp-server:v6.4.5',
      },
      // @TODO aarch64 coming after 6.4.5
      arch: ['x86_64'],
    },
  },
  dependencies: {},
})
