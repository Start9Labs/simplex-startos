# SimpleX Server

## Documentation

- [SimpleX Chat documentation](https://github.com/simplex-chat/simplex-chat/tree/stable/docs) — upstream guides covering the SimpleX protocol, clients, and server operation.

## What you get on StartOS

- An **SMP Server** interface — the SimpleX Messaging Protocol endpoint your SimpleX clients connect to for messaging. Listens on port 5223 (and 443).
- An **XFTP Server** interface — the SimpleX File Transfer Protocol endpoint used by SimpleX clients for sending files. Listens on port 5225.
- Both interfaces are pre-configured with an auto-generated 21-character password and embed the server fingerprint and password directly in the connection URL, so there is nothing to copy out by hand.
- A fixed 10 GB storage quota for hosted files on the XFTP side.

## Getting set up

There is nothing to configure before first start. Both servers initialize themselves on install, generating TLS keys, fingerprints, and a shared password.

1. Start the service.
2. Open the **SMP Server** interface and copy the connection URL (`smp://<fingerprint>:<password>@<hostname>:5223`). Paste it into your SimpleX client where it asks for an SMP server.
3. Open the **XFTP Server** interface and copy that URL (`xftp://<fingerprint>:<password>@<hostname>:5225`) into the same client for XFTP.

The fingerprint is part of your server identity — if you lose the `smp-configs` / `xftp-configs` volumes, clients will see a different server and must reconnect. Keep StartOS backups enabled.

## Using SimpleX Server

### Tor Settings

SimpleX clients use private routing (2-hop onion routing): when a client wants to deliver a message to a recipient whose server is reachable only on Tor, it asks an SMP server to forward the message on its behalf. For your server to participate in that forwarding to `.onion` destinations, it needs a Tor SOCKS proxy.

Run the **Tor Settings** action and toggle **Enable Tor SOCKS Proxy**:

- When **on**, the package takes a running dependency on the Tor service (install Tor first if you haven't) and writes the Tor SOCKS proxy address into `smp-server.ini` under `[PROXY]`.
- When **off** (default), the proxy line is stripped and the Tor dependency is dropped. Your server still works for clients on the clearnet and as a forwarder to non-Tor destinations.

This setting is opt-in: hand-edits to the `[PROXY] socks_proxy` field in the INI files will be overwritten on every init.

### Advanced configuration

Most upstream `smp-server.ini` and `file-server.ini` fields are passed through unchanged. The package only enforces a small set of keys (transport settings, store-log retention, file path, storage quota, web TLS, and the proxy field above); anything else you set by editing the INI files directly in the config volumes will be preserved.
