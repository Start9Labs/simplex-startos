# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `simplex`.** Ships two independent daemons in separate subcontainers: `smp` (SMP messaging server, subcontainer `smp-sub`, interface id `smp` on host `main`) and `xftp` (XFTP file-transfer server, subcontainer `xftp-sub`, interface id `xftp` on host `xftp`). Both are `api` interfaces with credentials embedded in the connection URL.
- **Tor SOCKS is resolved reactively over the LXC bridge.** When the `tor-settings` action enables it, `watchTorProxy` resolves the optional `tor` dependency's SOCKS binding through the `bridgeAddress` helper in `startos/utils.ts` — `bridgeAddress(effects, { packageId: 'tor', hostId: socksHostId, internalPort: socksPort }).const()` (host id / port imported from `tor-startos/startos/utils`) — and writes the resolved `10.0.3.1:<assigned port>` into `[PROXY] socks_proxy` in `smp-server.ini`. No `fallbackPort` (anonymizing semantics: never dial a dead address), so the proxy line is written only once Tor's binding resolves; the `.const()` subscription heals on a late Tor install and does not restart the server on Tor updates.
- **INI file models use the custom parser in `startos/fileModels/ini-lib.ts`** (accepts both `=` and `:` separators, writes `=`). See `TODO.md` for the plan to retire it.

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach simplex -n <name> -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `smp-sub` or `xftp-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
