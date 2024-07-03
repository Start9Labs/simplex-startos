import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration =
  compat.migrations.fromMapping(
    {
      "5.8.2": {
        up: compat.migrations.updateConfig(
          (config: any) => {
            config["xftp-address"];

            return config;
          },
          true,
          { version: "5.8.2", type: "up" }
        ),
        down: compat.migrations.updateConfig(
          (config: any) => {
            delete config["xftp-address"];

            return config;
          },
          true,
          { version: "5.8.2", type: "down" }
        ),
      },
    },
    "5.8.2"
  );
