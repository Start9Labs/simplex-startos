<p align="center">
  <img src="icon.svg" alt="Project Logo" width="21%">
</p>

# SimpleX Server for StartOS

This repository packages [SimpleX](https://github.com/simplex-chat/simplexmq) for StartOS. This document describes what makes this package different from a default SimpleX deployment.

For general SimpleX usage and features, see the [upstream documentation](https://simplex.chat/docs/guide/readme.html).

## How This Differs from Upstream

This package runs both SMP (messaging) and XFTP (file transfer) servers with auto-generated credentials and pre-configured defaults. Connection URLs with embedded fingerprints and passwords are automatically generated for easy client configuration.

## Container Runtime

This package runs **2 containers**:

| Container | Image | Purpose |
|-----------|-------|---------|
| smp | `simplexchat/smp-server:v6.4.5` | SimpleX Messaging Protocol server |
| xftp | `simplexchat/xftp-server:v6.4.5` | SimpleX File Transfer Protocol server |

**Note:** Currently x86_64 only. ARM64 support coming after v6.4.5.

## Volumes

| Volume | Contents | Backed Up |
|--------|----------|-----------|
| `smp-configs` | SMP server configuration, keys, fingerprint | Yes |
| `smp-state` | SMP message queues and state | Yes |
| `xftp-configs` | XFTP server configuration, keys, fingerprint | Yes |
| `xftp-state` | XFTP file metadata and state | Yes |
| `xftp-files` | Uploaded file storage | Yes |

## Install Flow

On installation:
1. Generates shared authentication password
2. Initializes SMP server (`smp-server init`) - creates keys and fingerprint
3. Initializes XFTP server (`xftp-server init`) - creates keys and fingerprint
4. Writes configuration files with defaults

## Configuration Management

### Auto-Configured Settings

**SMP Server:**

| Setting | Value | Purpose |
|---------|-------|---------|
| Port | 5223 (and 443) | Client connections |
| Control port | 5224 | Server management |
| Message expiry | 365 days | Auto-delete old messages |
| Notification expiry | 168 hours (7 days) | Push notification cleanup |
| Store queues | Memory | Performance optimization |
| Password | Auto-generated | Queue creation auth |

**XFTP Server:**

| Setting | Value | Purpose |
|---------|-------|---------|
| Port | 5225 | File transfers |
| Control port | 5226 | Server management |
| Storage quota | 10 GB | Maximum file storage |
| File expiry | 168 hours (7 days) | Auto-delete uploaded files |
| Password | Shared with SMP | File upload auth |

### User-Configurable Settings

No configuration actions are provided. Advanced users can modify the INI files directly in the config volumes.

## Network Interfaces

| Interface | Type | Port | Scheme | Description |
|-----------|------|------|--------|-------------|
| SMP Server | api | 5223 | `smp://` | Messaging protocol |
| XFTP Server | api | 5225 | `xftp://` | File transfer protocol |

Both interfaces are masked and include credentials in the connection URL format:
```
smp://<fingerprint>:<password>@<hostname>:5223
xftp://<fingerprint>:<password>@<hostname>:5225
```

## Actions

None. Server configuration is automatic.

## Dependencies

None. SimpleX servers are standalone.

## Backups

All server data is backed up:
- `smp-configs` - server identity and settings
- `smp-state` - message queues
- `xftp-configs` - server identity and settings
- `xftp-state` - file metadata
- `xftp-files` - uploaded files

**Important:** The server fingerprint is part of your identity. Losing the config volumes means clients must reconnect to a "new" server.

## Health Checks

| Check | Method | Success Condition |
|-------|--------|-------------------|
| SMP Server | Port listening | Port 5223 responds |
| XFTP Server | Port listening | Port 5225 responds |

## Using with SimpleX Chat

1. Copy the SMP server URL from StartOS interfaces
2. In SimpleX Chat app: Settings → Network & servers → SMP servers
3. Add your server URL
4. Repeat for XFTP server URL under "XFTP servers"

Your messages and files will now route through your own servers.

## Limitations

1. **x86_64 only**: ARM64 (aarch64) not yet supported in this version
2. **No web UI**: Server administration is config-file only
3. **Fixed storage quota**: XFTP limited to 10GB (requires config edit to change)
4. **No stats dashboard**: Prometheus metrics available but not exposed

## What's Unchanged

- Full SMP/XFTP protocol support
- End-to-end encryption
- Message queue functionality
- File transfer capabilities
- Client compatibility

---

## Quick Reference (YAML)

```yaml
package_id: simplex
upstream_version: 6.4.5
arch: x86_64 only

containers:
  - name: smp
    image: simplexchat/smp-server:v6.4.5
    ports: [5223, 5224]
  - name: xftp
    image: simplexchat/xftp-server:v6.4.5
    ports: [5225, 5226]

volumes:
  smp-configs:
    backup: true
  smp-state:
    backup: true
  xftp-configs:
    backup: true
  xftp-state:
    backup: true
  xftp-files:
    backup: true

interfaces:
  smp:
    type: api
    port: 5223
    scheme: smp://
    includes: fingerprint, password
  xftp:
    type: api
    port: 5225
    scheme: xftp://
    includes: fingerprint, password

actions: []

dependencies: []

auto_configure:
  - server fingerprints (generated)
  - shared password (generated)
  - message expiry: 365 days
  - file expiry: 7 days
  - storage quota: 10GB

health_checks:
  - name: SMP Server
    method: port_listening
    port: 5223
  - name: XFTP Server
    method: port_listening
    port: 5225
```
