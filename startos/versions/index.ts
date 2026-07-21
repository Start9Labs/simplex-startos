import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_6_5_2_1 } from './v6.5.2_1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_6_5_2_1],
})
