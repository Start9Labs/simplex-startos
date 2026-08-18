# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

**Start every task at the recipe index** — `../start-technologies/projects/start-sdk/docs/src/recipes.md`
(or <https://docs.start9.com/packaging/recipes.html>). It maps an intent ("prompt the user to create
admin credentials", "expose a web UI") to the constructs, the reference pages, and a named production
package to copy. Find the recipe before you read this package's neighbours: a package you reach by
grepping may be non-conformant, and the recipe outranks it.

Freshly scaffolded? Work the
[New Package Checklist](../start-technologies/projects/start-sdk/docs/src/new-package-checklist.md)
(or <https://docs.start9.com/packaging/new-package-checklist.html>) from top to bottom. It is a
guide page, not a file in this repo — read it, don't copy it in.

Keep `README.md` (technical reference for an AI support or administering agent) and
`instructions.md` (end-user docs) in sync with your changes.

**Bugs and feature requests are GitHub issues on this repo** — file them as you find them.
Don't record work in the repo instead: no `TODO.md`, no `NOTES.md`, no `PLAN.md`. What you
verified, tried, and decided belongs in the commit message and the PR body.

## This repo

- **`smp-server.ini` is the source of truth for `create_password`, and every init re-asserts it into `file-server.ini`.** The two servers must never drift apart — a client's XFTP address carries the same password as its SMP one.
- **The Tor proxy takes no fallback port.** Anonymising semantics mean a dead address must never be dialled, so `socks_proxy` is written only once tor's binding resolves. The `.const()` heals on a late tor install with one restart and never restarts on tor updates.
- **The fingerprints under `smp-configs`/`xftp-configs` are the server identities.** They are what the published addresses are built from and cannot be regenerated — anything that would recreate or relocate them changes every client's saved address.
- **Both interfaces must stay `masked`.** Their addresses embed `fingerprint:password`, so they are credentials rather than links.
- **`main`, `conf`, `xftp`, and `log` are retained solely for the `6.5.2:1` migration path**, which relocates the old single-volume layout. Don't reuse them for new data, and don't drop them from the manifest.
- **The INI files use a custom codec (`fileModels/ini-lib.ts`), not a stock format.** Adding a key means the codec has to round-trip it; check both directions.
- **The `[WEB]` block is modelled but the info page is not enabled.** Turning it on needs the static site generated at init time and a user-facing opt-out — see the commented plan in `interfaces.ts` before wiring it up.
