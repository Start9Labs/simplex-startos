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
| `smp-state` | `/var/opt/simplex` | smp | SMP message queues and state |
| `xftp-configs` | `/etc/opt/simplex-xftp` | xftp | XFTP server configuration, TLS keys, fingerprint |
| `xftp-state` | `/var/opt/simplex-xftp` | xftp | XFTP file metadata and state |
| `xftp-files` | `/srv/xftp` | xftp | Uploaded file storage |

## Installation and First-Run Flow

On first install:

1. Generates a shared authentication password (21-character random string)
2. Initializes SMP server (`smp-server init`) — creates TLS keys and fingerprint
3. Writes SMP configuration with the generated password
4. Initializes XFTP server (`xftp-server init`) — creates TLS keys and fingerprint
5. Writes XFTP configuration with the same shared password

On update/restore, existing configuration files are merged with defaults (preserving user values).

## Configuration Management

| StartOS-Managed (auto-configured) | Upstream-Managed |
|------------------------------------|------------------|
| SMP port (5223, 443), control port (5224) | N/A — no user-facing config UI |
| XFTP port (5225), control port (5226) | Advanced users can edit INI files directly in config volumes |
| Message expiry (365 days), notification expiry (168 hours) | |
| File expiry (168 hours), storage quota (10 GB) | |
| Store queues/messages in memory, restore messages on start | |
| Shared authentication password (auto-generated) | |
| SOCKS proxy (`127.0.0.1:9050`), client concurrency (32) | |

No configuration actions are provided. All settings are managed via INI file models with defaults applied at install time.

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

None. Server configuration is automatic.

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

None.

## Limitations and Differences

1. **x86_64 only** — aarch64 is not yet supported
2. **No web UI** — server administration is config-file only
3. **Fixed storage quota** — XFTP is limited to 10 GB (requires direct INI file edit to change)
4. **No stats dashboard** — Prometheus metrics interval is not configured by default
5. **No configuration action** — all settings are baked in at install time; changes require editing INI files in the config volumes

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
dependencies: none
startos_managed_env_vars: []
actions: []
```
