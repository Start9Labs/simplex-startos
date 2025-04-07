import { setupManifest } from '@start9labs/start-sdk'
import { source_code } from './utils'

export const manifest = setupManifest({
  id: 'simplex',
  title: 'SimpleX Server',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/simplex-startos',
  upstreamRepo: source_code,
  supportSite: 'https://github.com/simplex-chat/simplexmq/issues',
  marketingSite: 'https://simplex.chat/',
  donationUrl:
    'https://github.com/simplex-chat/simplex-chat#help-us-with-donations',
  // @TODO
  description: {
    short: '',
    long: '',
  },
  volumes: ['main'],
  images: {
    simplex: {
      source: {
        dockerBuild: {},
      },
    },
  },
  hardwareRequirements: {},
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
