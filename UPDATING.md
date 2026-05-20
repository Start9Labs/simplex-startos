# Updating the upstream version

This package wraps two upstream binaries — `smp-server` (SMP messaging) and `xftp-server` (file transfer) — that ship together from a single repo and a single release. They are bumped together.

## Determining the upstream version

- **simplexmq** ([simplex-chat/simplexmq](https://github.com/simplex-chat/simplexmq)) — source of both `smp-server` and `xftp-server`. Latest release tag:

  ```
  gh release view -R simplex-chat/simplexmq --json tagName -q .tagName
  ```

  Cross-check that matching Docker images have been published:

  ```
  curl -fsSL "https://hub.docker.com/v2/repositories/simplexchat/smp-server/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  curl -fsSL "https://hub.docker.com/v2/repositories/simplexchat/xftp-server/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

  The current pins live in `startos/manifest/index.ts` at `images.smp.source.dockerTag` and `images.xftp.source.dockerTag`. Compare the `v<X.Y.Z>` portion against the release tag.

## Applying the bump

In `startos/manifest/index.ts`, update both `dockerTag` values to the new release (keep them in lockstep):

- `images.smp.source.dockerTag` → `simplexchat/smp-server:v<new version>`
- `images.xftp.source.dockerTag` → `simplexchat/xftp-server:v<new version>`
