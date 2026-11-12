# How Spinbot is made (maintainer notes)

Spinbot is built from the upstream project in the `upstream` git remote, under the PolyForm Noncommercial
License 1.0.0. [LICENSE](LICENSE) and [NOTICE](NOTICE) name the original licensor; they stay unchanged and
ship with every build. Use Spinbot for noncommercial purposes only.

Every change is made by two scripts, so they can be applied again after each upstream merge:

- `scripts/spinbot/rebrand.mjs`: names, labels, identity, data folders, hidden features, local mode.
- `scripts/spinbot/make-icons.sh`: all icons from the Spinrun S-cube mark.

## What Spinbot changes

- **Name and labels:** "Spinbot" in the app, windows, notifications, all 15 languages, What's new notes,
  agent instructions, tool names (`spinbot.*`, `spinbot_browser.*`), the names sent to AI providers and MCP
  servers, the command line tool (`spinbot-cli.mjs`), and skill and import texts.
- **Identity:** bundle id `app.spinbot.desktop`, link scheme `spinbot://`, its own keychain entry.
- **Data:** `~/Spinbot` and `~/Library/Application Support/Spinbot`, apart from an installed copy of the upstream app.
- **No account:** the person at the computer is a local user (`you@spinbot.invalid`, a reserved address that
  reaches nobody). `SPINBOT_ACCOUNT_SERVICE=1` turns an account service back on, for a self-hosted one.
- **No online services of the upstream project.** `src/main/spinbot-network-guard.ts` refuses every connection to
  them (fetch, host name lookups, Chromium requests, links opened in the browser);
  `src/main/spinbot-blocklist.ts` lists the hosts. The features that need those services are hidden
  (`SPINBOT_ONLINE_SERVICES` in `packages/contracts/src/spinbot.ts`): account and billing settings, phone app,
  hosted servers, adding or joining servers, server members and remote desktop, published sites, the agents
  catalog and agent publishing, the skills catalog, Slack, Discord and Telegram (they go through the upstream relay),
  the built-in GitHub app connection, webhook routines, feedback reports, community links, and their agent tools.
- **Off:** automatic updates and release checks, product analytics and error reports.
- **Logo and icons:** the Spinrun S-cube, in every logo color, and in dev and preview builds.

Kept on purpose: internal identifiers (`@openbot/*` packages, `OPENBOT_*` variables, file names such as
`openbot.db`, protocol constants) that nobody sees, and the legacy folder paths that data migrations read.

## What Spinbot contacts

Measured 2026-11-12 through a host-logging proxy during setup, settings and marketplace use: no host of the
upstream project. The rest: the AI providers you connect, version checks of the AI coding tools Spinbot can
install (GitHub, npm and the tools' own sites), app logos in the marketplace (loaded from each vendor's site),
and Claude Code's own telemetry (Anthropic's program, not Spinbot's).

## Update from upstream

```bash
git fetch upstream --tags
git merge v0.X.Y                             # an upstream release tag
node scripts/spinbot/rebrand.mjs --check     # what the upstream change brought back
node scripts/spinbot/rebrand.mjs
bash scripts/spinbot/make-icons.sh           # only if icons changed upstream
bun install && bun run typecheck:node && bun run typecheck:renderer && bunx vitest run
```

`--check` prints `NOT FOUND` when upstream changed a line that the script edits: adjust that edit by hand.

## Build (unsigned, this Mac)

```bash
bun install
CSC_IDENTITY_AUTO_DISCOVERY=false bun run package
open dist/mac-arm64/Spinbot.app
```
