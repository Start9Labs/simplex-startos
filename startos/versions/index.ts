import { VersionGraph } from '@start9labs/start-sdk'
import { v_6_4_5_8 } from './v6.4.5_8'
import { v_6_5_0_0 } from './v6.5.0_0'

export const versionGraph = VersionGraph.of({
  current: v_6_5_0_0,
  other: [v_6_4_5_8],
})
