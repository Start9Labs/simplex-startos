import { VersionGraph } from '@start9labs/start-sdk'
import { v_6_4_5_5 } from './v6.4.5.5'
import { v_6_4_5_6 } from './v6.4.5.6'

export const versionGraph = VersionGraph.of({
  current: v_6_4_5_6,
  other: [v_6_4_5_5],
})
