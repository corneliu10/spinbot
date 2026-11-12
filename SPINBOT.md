# Spinbot

Spinbot is a **noncommercial** rebrand of [OpenBot](https://github.com/nightly-labs/openbot) by Synthetify Labs
sp. z o.o. It uses the Spinrun name and S-cube mark. It is not affiliated with or endorsed by Synthetify Labs.

## License

OpenBot is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE), and so is this fork. The license
and the Required Notices in [LICENSE](LICENSE) and [NOTICE](NOTICE) are kept unchanged, and every build ships them.

- Use Spinbot only for noncommercial purposes, as the license defines them.
- Commercial use (selling it, hosting it for others, using it for paid or business work) needs a commercial license
  from Synthetify Labs: licenses@openbot.run.
- Third-party components keep their own licenses (see NOTICE and the `licenses/` folder of a build).

## What the rebrand changes

`scripts/spinbot/rebrand.mjs` makes every change; run it again after each upstream merge.

- Name: Spinbot in the app, windows, menus, notifications, all 15 languages, and agent instructions.
- Identity: bundle id `app.spinbot.desktop`, link scheme `spinbot://`, macOS permission texts.
- Data, kept apart from an installed OpenBot: `~/Spinbot` (agents, shared files, servers),
  `~/Library/Application Support/Spinbot`, `~/Library/Application Support/Spinbot/provider-runtimes`.
- Updates are off: OpenBot's releases would replace Spinbot. Merge upstream to update.
- Logo and icons: the Spinrun S-cube (`scripts/spinbot/make-icons.sh` remakes the icon files).

Kept on purpose: internal identifiers (`@openbot/*`, `OPENBOT_*`), the Team API headers (`OpenBot-*`), and legacy
paths that database migrations match. OpenBot's hosted services (openbot.run sign-in, the marketplace, the mobile app,
the Slack and Discord apps) still belong to OpenBot; links they send open `openbot://`, which an installed OpenBot handles.

## What Spinbot contacts (measured 2026-11-12, first 25 s after start, not signed in)

Through a host-logging proxy; nothing bypassed it.

| Host | Who | Why |
|---|---|---|
| api.openbot.run | Spinbot | `GET /health/live`, a reachability check. No account or usage data. |
| analytics.openbot.run | — | Off in Spinbot (product analytics and error reports, desktop and interface). |
| github.com/nightly-labs/openbot releases | — | Off in Spinbot (update and server release checks). |
| api.github.com, github.com, raw.githubusercontent.com, registry.npmjs.org, x.ai, static.devin.ai, downloads.cursor.com, api.meta.ai, lookaside.facebook.com | Spinbot | Release and version checks of the AI coding tools it can install |
| chatgpt.com, api.anthropic.com | Codex and Claude programs | The AI providers you connected |
| http-intake.logs.us5.datadoghq.com | Anthropic's `claude` program | Claude Code's own telemetry, not Spinbot's |

Only with your approval: the feedback tool sends bug reports to OpenBot's public GitHub issues through api.openbot.run.
Signing in to an openbot.run account, hosted servers, the marketplace and the phone app use OpenBot's services.
Messages about billing, licenses, hosted servers and the phone app say "OpenBot", because those are OpenBot's.

## Update from upstream

```bash
git fetch upstream --tags
git merge v0.X.Y            # an OpenBot release tag
node scripts/spinbot/rebrand.mjs --check   # lists what an upstream change brought back
node scripts/spinbot/rebrand.mjs
bun install && bun run typecheck:node && bun run typecheck:renderer
```

## Build (unsigned, this Mac)

```bash
bun install
bun run build
bunx electron-builder --mac --arm64 --dir -c.mac.notarize=false   # CSC_IDENTITY_AUTO_DISCOVERY=false
```
