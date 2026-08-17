<p align="center">
  <img src="icon.svg" alt="SimpleX Logo" width="21%">
</p>

# SimpleX Server on StartOS

> Everything not listed in this document should behave the same as upstream
> SimpleX. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[SimpleX](https://github.com/simplex-chat/simplexmq/) is a messaging network with no user identifiers at all. This package runs both server roles it needs — the SMP message relay and the XFTP file relay — generates one password for both, and builds the server addresses your clients paste in.

- **Upstream repo:** <https://github.com/simplex-chat/simplexmq/>
- **Wrapper repo:** <https://github.com/Start9Labs/simplex-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

Two upstream images, unmodified, run as two independent daemons.

| Property      | Value                                               |
| ------------- | --------------------------------------------------- |
| Images        | `simplexchat/smp-server`, `simplexchat/xftp-server` |
| Architectures | x86_64, aarch64                                     |
| Entrypoint    | Each image's own                                    |

| Subcontainer            | Purpose                                               |
| ----------------------- | ----------------------------------------------------- |
| `smp-sub`               | The SMP message relay — the one to `attach` to        |
| `xftp-sub`              | The XFTP file relay                                   |
| `init-smp`, `init-xftp` | Temporary; the install-time key and config generation |

Neither daemon waits on the other. They are separate servers that happen to be packaged together, and one can be healthy while the other is not.

## Volume and Data Layout

Nine volumes are declared, five carry data, and four exist only for a migration.

| Volume                        | Mount Point             | Purpose                                                |
| ----------------------------- | ----------------------- | ------------------------------------------------------ |
| `smp-configs`                 | `/etc/opt/simplex`      | `smp-server.ini`, the server keys, and its fingerprint |
| `smp-state`                   | `/var/opt/simplex`      | The message store and `store.json`                     |
| `xftp-configs`                | `/etc/opt/simplex-xftp` | `file-server.ini`, its keys, and its fingerprint       |
| `xftp-state`                  | `/var/opt/simplex-xftp` | XFTP's own state                                       |
| `xftp-files`                  | `/srv/xftp`             | The files clients have uploaded                        |
| `main`, `conf`, `xftp`, `log` | — (unused)              | Retained only for the 6.5.2:1 migration path           |

**The fingerprints under the two config volumes are the servers' identities.** A SimpleX address is built from the fingerprint, so losing those keys means every client's saved address for this server stops working — there is no way to regenerate the same one.

`xftp-files` is the one that grows: it holds whatever clients have uploaded, under a storage quota set at install.

## File Models

Two models, one per server, and both are INI files with a custom serializer and parser rather than a stock format.

| File              | Volume         | Modelled                                   | Written by                              |
| ----------------- | -------------- | ------------------------------------------ | --------------------------------------- |
| `smp-server.ini`  | `smp-configs`  | Yes — `FileHelper` with a custom INI codec | Install, every init, and the Tor action |
| `file-server.ini` | `xftp-configs` | Yes — same codec                           | Install, and every init                 |
| `store.json`      | `smp-state`    | Yes — `FileHelper.json`                    | The Tor action                          |

**Enforced** — rewritten whenever the package writes: the listen hosts and ports for both servers, message retention and expiry, TLS error logging, websockets off, the control port, inactive-client disconnection off, the XFTP file path and quota, and the web block's paths.

**Seeded once at install** — `create_password`, generated as a 21-character value. **The same password is written into both files**, and every later init re-reads it from the SMP config and re-asserts it into XFTP's, so the two can never drift apart.

**Derived** — `socks_proxy`, written from Tor's bridge address when the Tor setting is on. **There is no fallback port**: the proxy line is written only once Tor's binding actually resolves, because a dead address here would mean traffic meant to be anonymised going somewhere else. Installing Tor later heals it with one restart.

`store.json` holds one boolean: whether Tor forwarding is on.

## Dependencies

One, optional, and only while you have asked for it.

| Dependency | Kind      | Required                     |
| ---------- | --------- | ---------------------------- |
| `tor`      | `running` | Only with the Tor setting on |

Tor is needed for the SMP server to forward messages on to `.onion` destination servers. Without it, this server still works for every clearnet destination.

## Network Access and Interfaces

Two interfaces, both masked, and **both carry a credential in the address itself**.

| Interface   | Id     | Type | Port | Description                 |
| ----------- | ------ | ---- | ---- | --------------------------- |
| SMP Server  | `smp`  | api  | 5223 | The SMP server for SimpleX  |
| XFTP Server | `xftp` | api  | 5225 | The XFTP server for SimpleX |

Each advertises itself with a `smp://` or `xftp://` scheme rather than an HTTP one, and each address embeds `<fingerprint>:<password>` — which is exactly the form a SimpleX client expects to be given. **That is why both are masked**: the address is a secret, not a link to share.

Both bindings are marked secure with TLS, since the SimpleX protocol carries its own transport security.

## Installation and First-Run Flow

Install generates everything and asks nothing. It runs each server's own `init` command in a temporary container, which creates the server keys and the fingerprint that becomes part of your address, and generates the single password both servers share.

There is no task and no web UI. **The whole product is the two addresses**, which appear on the service page once the servers are running — copy them into a SimpleX client's server settings.

The XFTP server is initialised with a fixed storage quota, which is what bounds how much clients can upload.

## Actions

One action.

### Tor Settings

Whether the SMP server forwards messages on to `.onion` destination servers through Tor.

- **What it changes:** `enableTorProxy` in `store.json`; through it the package's dependency and the `socks_proxy` line in `smp-server.ini`.
- **Cost:** seconds, then a restart.
- **Repeat safety:** idempotent. Turning it off removes the proxy line rather than leaving a stale one.
- **Turning it on before Tor is installed is not an error.** No proxy line is written until Tor's address resolves, and it appears on its own once Tor is there.

## Tasks

None. This package raises no tasks, so the service is never held on a prompt and its ordinary controls are always available.

## Health Checks

Two checks, one per server, and they are independent.

| Check  | Displayed     | Method                 |
| ------ | ------------- | ---------------------- |
| `smp`  | "SMP Server"  | Port 5223 is listening |
| `xftp` | "XFTP Server" | Port 5225 is listening |

Neither gates the other, so one red and one green is a real state: messaging works and file transfer does not, or vice versa.

Both servers refuse to start without their config file, and the package throws with a clear message rather than starting a daemon that would fail obscurely. A failure after that is the server itself, named in the service logs.

## Backups and Restore

Five volumes are copied wholesale — everything except the four migration-only ones.

- **Included:** both servers' keys and fingerprints, both INI files with the shared password, the message store, and every uploaded file.
- **This backup contains the server identities.** Anyone holding it can stand up a server that clients accept as yours.
- **Size:** dominated by `xftp-files`, up to whatever the storage quota allows.
- **Restore:** complete, and **the addresses are unchanged**, because the fingerprints and the password come back with them. Clients keep working with no reconfiguration — which is the point of backing this up at all.

## Limitations and Differences

1. **Both servers share one password**, re-asserted from the SMP config into XFTP's on every start.
2. **The server addresses are secrets**, and both interfaces are masked for that reason.
3. **Losing the config volumes loses the addresses permanently.** The fingerprint cannot be regenerated.
4. **The XFTP storage quota is fixed at install** and is not exposed as a setting.
5. **The Tor proxy fails closed.** With the setting on and Tor absent, no proxy line is written rather than one pointing at a dead port.
6. **There is no web interface.** SimpleX's optional read-only info page is not enabled by this package.
7. **No riscv64 build.** x86_64 and aarch64 only.

---

## Quick Reference for AI Consumers

```yaml
package_id: simplex
image: simplexchat/smp-server # plus simplexchat/xftp-server
architectures:
  - x86_64
  - aarch64
subcontainers:
  - smp-sub # the message relay; the one to attach to
  - xftp-sub # the file relay
  - init-smp # temporary; install-time key and config generation
  - init-xftp # temporary; install-time key and config generation
volumes:
  smp-configs: /etc/opt/simplex
  smp-state: /var/opt/simplex
  xftp-configs: /etc/opt/simplex-xftp
  xftp-state: /var/opt/simplex-xftp
  xftp-files: /srv/xftp
  main: unused; legacy
  conf: unused; legacy
  xftp: unused; legacy
  log: unused; legacy
file_models:
  - smp-server.ini
  - file-server.ini
  - store.json
startos_managed_env_vars: []
dependencies:
  - tor # optional, running; only while the Tor setting is on
interfaces:
  smp: { type: api, port: 5223 } # masked; address embeds fingerprint:password
  xftp: { type: api, port: 5225 } # masked; address embeds fingerprint:password
actions:
  - tor-settings
tasks: []
health_checks:
  - smp # displayed "SMP Server"
  - xftp # displayed "XFTP Server"
```
