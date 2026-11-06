import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_6_5_2_1 } from './v6.5.2_1'
import { v_7_0_1_2 } from './v7.0.1_2'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_7_0_1_2, v_6_5_2_1],
})
