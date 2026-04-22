<p align="center">
  <img src="icon.svg" alt="SimpleX Logo" width="21%">
</p>

# SimpleX Server on StartOS

> **Upstream docs:** <https://simplex.chat/docs/guide/readme.html>
>
> Everything not listed in this document should behave the same as upstream
> SimpleX. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

This repository packages [SimpleX](https://github.com/simplex-chat/simplexmq) for StartOS. SimpleX provides private messaging (SMP) and file transfer (XFTP) servers with no user identifiers.

This package runs both SMP and XFTP servers with auto-generated credentials and pre-configured defaults. Connection URLs with embedded fingerprints and passwords are automatically generated for easy client configuration.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

This package runs **2 containers**:

| Container | Image | Purpose |
|-----------|-------|---------|
| smp | `simplexchat/smp-server` | SimpleX Messaging Protocol server |
| xftp | `simplexchat/xftp-server` | SimpleX File Transfer Protocol server |

- **Architectures:** x86_64 only
- **Entrypoint:** Default upstream entrypoints for both containers

## Volume and Data Layout

| Volume | Mount Point | Container | Contents |
|--------|-------------|-----------|----------|
| `smp-configs` | `/etc/opt/simplex` | smp | SMP server configuration, TLS keys, fingerprint |
| `smp-state` | `/var/opt/simplex` | smp | SMP message queues, server state, and `store.json` (StartOS-managed action state) |
| `xftp-configs` | `/etc/opt/simplex-xftp` | xftp | XFTP server configuration, TLS keys, fingerprint |
| `xftp-state` | `/var/opt/simplex-xftp` | xftp | XFTP file metadata and state |
| `xftp-files` | `/srv/xftp` | xftp | Uploaded file storage |

`store.json` is a StartOS-only file (never read by smp-server) that records action-driven toggles — currently just `enableTorProxy: boolean`.

## Installation and First-Run Flow

On first install:

1. Generates a shared authentication password (21-character random string)
2. Initializes SMP server (`smp-server init`) — creates TLS keys and fingerprint
3. Writes SMP configuration with the generated password
4. Initializes XFTP server (`xftp-server init`) — creates TLS keys and fingerprint
5. Writes XFTP configuration with the same shared password

On update/restore, existing configuration files are merged with defaults (preserving user values).

## Configuration Management

| StartOS-Managed (enforced) | Upstream-Managed (pass-through) |
|------------------------------------|------------------|
| `TRANSPORT.host: <hostnames>`, `TRANSPORT.port: 5223,443` (smp) / `5225` (xftp) | Control ports, stats/prometheus, log levels |
| `STORE_LOG.enable: on`, `expire_messages_days: 365`, `expire_messages_on_start: off`, `expire_ntfs_hours: 168` (smp) | Any other key not listed here |
| `FILES.path`, `FILES.storage_quota: 10gb` (xftp) | |
| `AUTH.create_password` (auto-generated 21-char) | |
| `INACTIVE_CLIENTS.disconnect: off` (both) | |
| `WEB.static_path`, `WEB.http: 8000`; `WEB.https`/`cert`/`key` stripped — StartOS terminates TLS | |
| `PROXY.socks_proxy` — written/stripped by the **Tor Settings** action | |

StartOS INI schemas only constrain the fields above. Unknown keys are preserved by `merge()`, so advanced users may edit the INI files directly in the config volumes to set anything else (control ports, inactive-client timeouts, stats/prometheus, etc.) and those values will survive StartOS rewrites.

## Network Access and Interfaces

| Interface | ID | Type | Port | Scheme | Description |
|-----------|----|------|------|--------|-------------|
| SMP Server | `smp` | api | 5223 | `smp://` | Messaging protocol (also listens on 443) |
| XFTP Server | `xftp` | api | 5225 | `xftp://` | File transfer protocol |

Both interfaces are **masked** and include credentials in the connection URL:

```
smp://<fingerprint>:<password>@<hostname>:5223
xftp://<fingerprint>:<password>@<hostname>:5225
```

## Actions (StartOS UI)

| Action | ID | Purpose | Inputs | Availability |
|--------|----|---------|--------|--------------|
| Tor Settings | `tor-settings` | Configure whether this SMP server forwards messages to `.onion` destination servers via Tor. | `enableTorProxy: boolean` (default `false`) — when on, adds a running dependency on the Tor service and writes its container IP to `[PROXY] socks_proxy` in `smp-server.ini`; when off, strips that setting and drops the Tor dependency. | Any status |

The form is prepopulated from `enableTorProxy` in `store.json`; submissions merge the new value back.

## Backups and Restore

**Backed up volumes:** `smp-configs`, `smp-state`, `xftp-configs`, `xftp-state`, `xftp-files`

**Important:** The server fingerprint is part of your server identity. Losing the config volumes means clients must reconnect to a "new" server.

**Restore behavior:** All volumes are restored in place. The server resumes with the same identity, queues, and files.

## Health Checks

| Check | Daemon | Method | Success Condition |
|-------|--------|--------|-------------------|
| SMP Server | smp | Port listening (5223) | Port 5223 responds |
| XFTP Server | xftp | Port listening (5225) | Port 5225 responds |

Both daemons start independently (no ordering dependency).

## Dependencies

| Service | Required? | Version | Health Checks | Purpose |
|---------|-----------|---------|---------------|---------|
| `tor` | Optional — only active when `enableTorProxy` is on in the **Tor Settings** action | `>=0.4.9.5:0` | none | Provides the SOCKS5 endpoint that smp-server uses to forward messages to `.onion` destination servers. |

When `enableTorProxy` is off (default), the package has no runtime dependencies.

## Limitations and Differences

1. **x86_64 only** — aarch64 is not yet supported
2. **No web UI** — server administration is config-file only
3. **Fixed storage quota** — XFTP is limited to 10 GB (requires direct INI file edit to change)
4. **No stats dashboard** — Prometheus metrics interval is not configured by default
5. **TLS is not served by smp-server** — StartOS terminates TLS for the web info page, so `WEB.https`/`cert`/`key` are stripped from `smp-server.ini` on every merge; Let's Encrypt / direct HTTPS configuration on the smp-server side is disabled by design
6. **Tor SOCKS proxy is opt-in only** — the `[PROXY] socks_proxy` setting is toggled solely by the `tor-settings` action; hand-edits to that field will be overwritten on the next init run

## What Is Unchanged from Upstream

- Full SMP/XFTP protocol support
- End-to-end encryption
- Message queue functionality
- File transfer capabilities
- Client compatibility (SimpleX Chat, etc.)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for build instructions and development workflow.

---

## Quick Reference for AI Consumers

```yaml
package_id: simplex
image: simplexchat/smp-server, simplexchat/xftp-server
architectures: [x86_64]
volumes:
  smp-configs: /etc/opt/simplex
  smp-state: /var/opt/simplex
  xftp-configs: /etc/opt/simplex-xftp
  xftp-state: /var/opt/simplex-xftp
  xftp-files: /srv/xftp
ports:
  smp: 5223
  xftp: 5225
dependencies:
  tor:
    required: false
    version: ">=0.4.9.5:0"
    activated_by: tor-settings action (enableTorProxy=true)
startos_managed_env_vars: []
actions:
  - tor-settings
startos_managed_files:
  - smp-state/store.json
```
