import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'
import { source_code } from './utils'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'simplex',
  title: 'SimpleX Server',
  license: 'MIT',
  wrapperRepo: 'https://github.com/Start9Labs/simplex-startos',
  upstreamRepo: source_code,
  supportSite: 'https://github.com/simplex-chat/simplexmq/issues',
  marketingSite: 'https://simplex.chat/',
    docsUrl:
    'https://github.com/Start9Labs/simplex-startos/blob/update/040/docs/README.md',
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
      arch: architectures,
    } as SDKImageInputSpec,
  },
  hardwareRequirements: {
    arch: architectures,
  },
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
