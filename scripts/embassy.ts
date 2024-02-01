export { setConfig } from "./procedures/setConfig.ts";
export { getConfig } from "./procedures/getConfig.ts";
export { properties } from "./procedures/properties.ts";
export { migration } from "./procedures/migrations.ts";
export { main } from "./procedures/main.ts";

export const jsMain = async ({ effects, utils, mainId }: any) => {
  return utils.daemonRun(mainId, ["/usr/local/bin/docker_entrypoint.sh"], {});
};
