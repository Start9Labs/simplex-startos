import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const torSettingsSpec = InputSpec.of({
  enableTorProxy: Value.toggle({
    name: i18n('Enable Tor SOCKS Proxy'),
    description: i18n(
      'SimpleX clients use private routing (2-hop onion routing) by asking an SMP server to forward messages to the recipient\u2019s server; if a recipient\u2019s server is reachable only on Tor, the forwarding server must have a Tor SOCKS proxy to reach it. Enabling this adds a running dependency on the Tor service and writes it to [PROXY] socks_proxy in smp-server.ini.',
    ),
    default: false,
  }),
})

export const torSettings = sdk.Action.withInput(
  'tor-settings',

  async () => ({
    name: i18n('Tor Settings'),
    description: i18n(
      'Configure whether this SMP server forwards messages to .onion destination servers via Tor.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  torSettingsSpec,

  () => storeJson.read().once(),

  ({ effects, input }) => storeJson.merge(effects, input),
)
