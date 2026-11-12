# Spinbot

A local-first desktop workspace for persistent AI agents: run Codex, Claude and other AI coding agents as
teammates on your own computer, each with its own workspace, memory, browser and tools.

Spinbot is for **noncommercial use only**. It runs entirely on your computer and has no Spinbot account,
cloud service, analytics or automatic updates.

## License

Spinbot is distributed under the [PolyForm Noncommercial License 1.0.0](LICENSE). The copyright and Required
Notices of the original authors are in [LICENSE](LICENSE) and [NOTICE](NOTICE); they are kept unchanged and ship
with every build. Spinbot is an independent build and is not affiliated with or endorsed by them.

- Use Spinbot only for noncommercial purposes, as the license defines them.
- Commercial use needs a commercial license from the licensor named in [LICENSE](LICENSE).
- Third-party components keep their own licenses (see NOTICE and the `licenses/` folder of a build).

## Build and run (macOS, unsigned)

```bash
bun install
CSC_IDENTITY_AUTO_DISCOVERY=false bun run package
open dist/mac-arm64/Spinbot.app
```

How Spinbot is made from the upstream code, what it changes and what it contacts: [SPINBOT.md](SPINBOT.md).
