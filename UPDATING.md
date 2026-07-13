# Updating the upstream version

This package wraps two upstream binaries — `smp-server` (SMP messaging) and `xftp-server` (file transfer) — that ship together from a single repo and a single release. They are bumped together.

## Determining the upstream version

- **simplexmq** ([simplex-chat/simplexmq](https://github.com/simplex-chat/simplexmq)) — source of both `smp-server` and `xftp-server`. Newest **stable** tag:

  ```
  gh api repos/simplex-chat/simplexmq/tags --jq '[.[].name | select(test("^v[0-9]+\\.[0-9]+\\.[0-9]+$"))][0]'
  ```

  > [!WARNING]
  > **Do not use `gh release view` on this repo — it under-reports.** Upstream routinely marks stable point releases as GitHub *pre-releases*, so they never become "Latest". `gh release view -R simplex-chat/simplexmq` returns **v6.5.0** while the current pin is **v6.5.2** — i.e. the doc'd query looks like a *downgrade* from what's already shipping. Filter the tag list instead, as above.
  >
  > The `select(test(...))` filter is what keeps `v7.0.0-beta.*` out of the results. Those betas are real tags and are published to Docker Hub — **do not chase them.** Only pin a plain `vX.Y.Z` tag.

  Cross-check that matching Docker images have been published (a tag existing upstream does not guarantee an image):

  ```
  curl -fsSL "https://hub.docker.com/v2/repositories/simplexchat/smp-server/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  curl -fsSL "https://hub.docker.com/v2/repositories/simplexchat/xftp-server/tags?page_size=20&ordering=last_updated" | jq -r '.results[].name'
  ```

  The current pins live in `startos/manifest/index.ts` at `images.smp.source.dockerTag` and `images.xftp.source.dockerTag`. Compare the `v<X.Y.Z>` portion against the release tag.

## Applying the bump

In `startos/manifest/index.ts`, update both `dockerTag` values to the new release (keep them in lockstep):

- `images.smp.source.dockerTag` → `simplexchat/smp-server:v<new version>`
- `images.xftp.source.dockerTag` → `simplexchat/xftp-server:v<new version>`
