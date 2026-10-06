import { storeJson } from './fileModels/store.json'
import i18n from './manifest/i18n'
import { sdk } from './sdk'

export const dependencies = sdk.Dependencies.of().addDependency(
  sdk.Dependency.optional('tor', {
    description: i18n.torDescription,
    metadata: {
      title: 'Tor',
      icon: 'https://raw.githubusercontent.com/Start9Labs/tor-startos/65faea17febc739d910e8c26ff4e61f6333487a8/icon.svg',
    },
    versionRange: '>=0.4.9.11:4',
    kind: 'running',
    healthChecks: [],
    enabled: async ({ effects }) =>
      (await storeJson.read((s) => s.enableTorProxy).const(effects)) ?? false,
  }),
)
