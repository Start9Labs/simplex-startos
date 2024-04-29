# Getting Started with SimpleX Server

## About

Your SimpleX Server comes with an <a href="https://simplex.chat/docs/server.html" target="_blank">SMP server </a>(for relaying messages) and an <a href="https://simplex.chat/docs/xftp-server.html" target="_blank">XFTP server</a> (for transferring files and media).

SimpleX chats are unique in that each participant chooses which server to use for receiving messages. I recieve messages through `Server A`, and you receive messages through `Server B`. This means that I must send messages to `Server B`, and you must send messages to `Server A`.

SimpleX servers function as queues. Servers only store messages until a client retreives them, after which they are deleted. This means message histories are stored on client devices, so it is client devices that must be backed up to prevent loss of messages.

## General  Usage Instrucitons

For detailed instructions on using SimpleX, check out the <a href="https://simplex.chat/docs/guide/readme.html" target="_blank">official docs</a>

## Connecting to Your Own Server

1. Ensure your SimpleX Server is running, and health checks are passing.

1. Follow instructions in the <a href="https://docs.start9.com">Start9 docs</a> for running Tor on your client device (phone/laptop).

1. Download and Install the<a href="https://simplex.chat/" target="_blank">SimpleX app</a> to your client device.

1. During initial setup, if you choose to crete a profile, _do not_ create a SimpleX address. You can do this later after you connect to your own server.

### Enable Tor

1. In SimpleX client app, go to `Settings > Network & Servers`.

1. Enable "Use SOCKS proxy".

1. For `Use .onion hosts`, you have two options:
	- `Required` (recommended): you can only send messages to someone who is receives via  a .onion URL. For sending and receiving with non-Tor users, we recommend creating another profile entirely.
	- `When Available`: you can send messages to anyone. NOTE:  you still receive via a .onion URL, which means your counter party must have Tor running on their client device and "Use SOCKS proxy" enabled in their SimpleX app.

1. Remember, for this profile, you are choosing to receive messages via a Tor (.onion) server. This means whoever messages you must have Tor running on their client device and "Use SOCKS proxy" enabled in their SimpleX app.

### Connect SMP Server

1. In SimpleX client app, go to `Settings > Network & Servers > SMP Servers`.

1. You will see some default receiving servers (e.g. smp8, smp9, smp10). _Delete them all_. If you want to receive via these default clearnet servers, we recommend creating another profile entirely. If you chose not to delete these default servers, at least disable the "Use for new conenctions" setting on each of them. This will prevent them from being used without your explicit instruciton.

1. Click "Add Server".

1. Tap "Scan QR Code".

1. Scan your SMP Server Address QR code, located in StartOS UI under `SimpleX Server > Properties > SMP Server Address`.

1. Click "Test servers" and wait for the test to pass.

1. Click "Save servers".

1. You can now create a SimpleX Address if you want.

### Connect XFTP Server

1. In SimpleX client app, go to `Settings > Network & Servers > XFTP Servers`.

1. You will see some default xftp servers (e.g. xftp1, xftp2, xftp3). _Delete them all_. If you want to use these default clearnet servers, we recommend creating another profile entirely. If you chose not to delete these default servers, at least disable the "Use for new conenctions" setting on each of them. This will prevent them from being used without your explicit instruciton.

1. Click "Add server..."

1. Tap "Scan QR Code".

1. Scan your XFTP Server Address QR code, located in StartOS UI under `SimpleX Server > Properties > XFTP Server Address`.

1. Click "Test servers" and wait for the test to pass.

1. Click "Save servers".
