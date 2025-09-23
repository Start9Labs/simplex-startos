# Getting started with SimpleX

## About

Your SimpleX Server comes with a [SMP server](https://simplex.chat/docs/server.html) for sending/receiving messages and an [XFTP server](https://simplex.chat/docs/xftp-server.html) for transferring files and media.

In SimpleX, participants choose which servers to use for receiving messages and files. I receive through my private server, and you receive through your private server. Or we could both receive through the same private server. Or we could each use different public servers.

SimpleX servers function as queues. Servers only store messages until a client retrieves them, after which they are deleted. This means message histories are stored on client devices, so it is client devices that must be backed up to prevent loss of messages.

For detailed instructions on using SimpleX, check out the [official docs](https://simplex.chat/docs/guide/readme.html).

## Initial setup

1. Ensure your SimpleX Server is running, and health checks are passing.

1. Follow instructions in the [Start9 docs](https://docs.start9.com) for running Tor on your client device (phone/laptop).

1. Download and install the [SimpleX app](https://simplex.chat/) on your client device.

1. During initial setup of the app, if you choose to create a profile, _do not_ create a SimpleX address. You can do this later, once you have configured your servers, since your server is included in your address.

## Creating a fully anonymous profile

The purpose of this profile is _total_ anonymity. For this profile, you will receive messages through your self-hosted server over Tor, and you only permit sending messages to other .onion servers.

For sending messages to non-Tor servers, we recommend creating a separate profile entirely.

SimpleX can be configured many different ways, depending on your threat model and privacy goals, each with different tradeoffs.

### Enable and enforce Tor

1. If you did not create a profile during initial setup, create one now.

1. Navigate to `Settings > Network & servers`.

1. For iOS users: Skip this step. For other platforms: Enable "Use SOCKS proxy".

1. Set `Use .onion hosts` to "Required" (this might be under `SOCKS proxy settings` or `Advanced network settings`). This means that this profile can _only_ send messages to other .onion servers.

1. Finally, in `Advanced Network Settings`, set `Private Routing` to "Never".

### Connect your SMP server for messages

1. Navigate to `Settings > Network & servers > Message servers`.

1. You will see some default receiving servers (e.g. smp1, smp2, smp3). It is recommended you _delete them all_ to ensure you do not accidentally use them in the future. If you choose not to delete them, at least disable the "Use for new connections" setting on each of them. This will prevent them from being used without your explicit instruction.

1. Click "Add Server".

1. Tap "Scan QR Code".

1. Scan your SMP Server Address QR code, located in StartOS UI under `SimpleX Server > Properties > SimpleX SMP Server Address`.

1. Click on the newly added server.

1. Click "Test server" and wait for the test to pass.

1. Enable "Use for new connections".

1. Navigate back and click "Save servers".

### Connect your XFTP server for media and files

1. Navigate to `Settings > Network & servers > Media and file servers`.

1. You will see some default receiving servers (e.g. xftp1, xftp2, xftp3). It is recommended you _delete them all_ to ensure you do not accidentally use them in the future. If you choose not to delete them, at least disable the "Use for new connections" setting on each of them. This will prevent them from being used without your explicit instruction.

1. Click "Add server".

1. Tap "Scan QR Code".

1. Scan your XFTP Server Address QR code, located in StartOS UI under `SimpleX Server > Properties > SimpleX XFTP Server Address`.

1. Click on the newly added server.

1. Click "Test server" and wait for the test to pass.

1. Enable "Use for new connections".

1. Navigate back and click "Save servers".

### Create a SimpleX address (optional)

You can now create a SimpleX Address if you want, but you should _not_ share the address publicly, as it will link the .onion URL to your identity. Remember, the purpose of this profile is total anonymity.
