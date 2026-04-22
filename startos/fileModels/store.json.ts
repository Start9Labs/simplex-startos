import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  enableTorProxy: z.boolean().catch(false),
})

export type Store = z.infer<typeof shape>

export const storeJson = FileHelper.json(
  {
    base: sdk.volumes['smp-state'],
    subpath: '/store.json',
  },
  shape,
)
