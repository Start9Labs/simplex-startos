# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `simplex`.** Ships two independent daemons in separate subcontainers: `smp` (SMP messaging server, subcontainer `smp-sub`, interface id `smp` on host `main`) and `xftp` (XFTP file-transfer server, subcontainer `xftp-sub`, interface id `xftp` on host `xftp`). Both are `api` interfaces with credentials embedded in the connection URL.
- **Tor SOCKS is read at runtime, not imported.** The optional `tor` dependency's SOCKS proxy has no StartOS host to read — when the `tor-settings` action enables it, `initServers`/`watchTorProxy` resolve Tor's container IP via `sdk.getContainerIp(effects, { packageId: 'tor' })` and write `${torIp}:9050` into `[PROXY] socks_proxy` in `smp-server.ini`.
- **INI file models use the custom parser in `startos/fileModels/ini-lib.ts`** (accepts both `=` and `:` separators, writes `=`). See `TODO.md` for the plan to retire it.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach simplex -n <name> -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `smp-sub` or `xftp-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
