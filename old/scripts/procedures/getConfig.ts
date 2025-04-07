// To utilize the default config system built, this file is required. It defines the *structure* of the configuration file. These structured options display as changeable UI elements within the "Config" section of the service details page in the Embassy UI.

import { compat, types as T } from "../deps.ts";

export const getConfig: T.ExpectedExports.getConfig = compat.getConfig({
    "tor-address": {
      "name": "SMP Tor Address",
      "description": "The Tor address for SMP Server",
      "type": "pointer",
      "subtype": "package",
      "package-id": "simplex",
      "target": "tor-address",
      "interface": "main"
    },
    "xftp-address": {
      "name": "XFTP Tor Address",
      "description": "The Tor address for XFTP Server",
      "type": "pointer",
      "subtype": "package",
      "package-id": "simplex",
      "target": "tor-address",
      "interface": "xftp"
    }
  });
