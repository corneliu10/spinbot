#!/usr/bin/env node
// Spinbot: a noncommercial rebrand of OpenBot (nightly-labs/openbot, PolyForm Noncommercial 1.0.0).
//
// Rewrites the OpenBot brand to Spinbot where a user sees it, and moves every place where the app
// keeps data, so Spinbot runs next to an installed OpenBot without touching its files. Safe to run
// again after each upstream merge: it changes only text that still has the old value.
//
//   node scripts/spinbot/rebrand.mjs           rewrite in place
//   node scripts/spinbot/rebrand.mjs --check   list what would change; exit 1 if anything would
//
// It never changes LICENSE, NOTICE, CLA.md or the "Required Notice" lines: the license requires that
// every copy carries them. Internal identifiers (@openbot/* packages, OPENBOT_* variables, class
// names, wire-protocol values, database migrations) stay as they are, so upstream merges stay simple.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..", "..");
const check = process.argv.includes("--check");
const NEVER = new Set(["LICENSE", "NOTICE", "CLA.md"]);

/** Exact edits: [file, from, to]. "from" must appear in the file unless "to" is already there. */
const EDITS = [
  // --- Identity: name, bundle id, link scheme, updates -------------------------------------------
  ["package.json", '"productName": "OpenBot"', '"productName": "Spinbot"'],
  ["package.json", '"desktopName": "openbot.desktop"', '"desktopName": "spinbot.desktop"'],
  ["electron-builder.yml", "appId: app.openbot.desktop", "appId: app.spinbot.desktop"],
  ["electron-builder.yml", "productName: OpenBot", "productName: Spinbot"],
  [
    "electron-builder.yml",
    "  - name: OpenBot invitations\n    schemes:\n      - openbot",
    "  - name: Spinbot links\n    schemes:\n      - spinbot",
  ],
  ["electron-builder.yml", "  owner: nightly-labs\n  repo: openbot", "  owner: corneliu10\n  repo: spinbot"],
  ["electron-builder.yml", "NSMicrophoneUsageDescription: OpenBot uses", "NSMicrophoneUsageDescription: Spinbot uses"],
  [
    "electron-builder.yml",
    "NSScreenCaptureUsageDescription: OpenBot captures",
    "NSScreenCaptureUsageDescription: Spinbot captures",
  ],
  [
    "electron-builder.yml",
    "NSAppleEventsUsageDescription: OpenBot sends",
    "NSAppleEventsUsageDescription: Spinbot sends",
  ],
  // The macOS 26 icon catalog (Assets.car) holds OpenBot's icon and needs Xcode's actool to remake, so
  // Spinbot ships only icon-production.icns (made by scripts/spinbot/make-icons.sh).
  [
    "electron-builder.yml",
    "  extraResources:\n    - from: build/macos/Assets.car\n      to: Assets.car\n",
    "  extraResources:\n",
  ],
  ["electron-builder.yml", "  extendInfo:\n    CFBundleIconName: Icon\n", "  extendInfo:\n"],
  ["src/main/index.ts", 'app.setName("OpenBot");', 'app.setName("Spinbot");'],
  ["src/main/index.ts", 'app.setAppUserModelId("app.openbot.desktop")', 'app.setAppUserModelId("app.spinbot.desktop")'],
  ["src/main/index.ts", 'app.setAsDefaultProtocolClient("openbot")', 'app.setAsDefaultProtocolClient("spinbot")'],
  [
    "src/main/index.ts",
    '"Unable to register the openbot:// scheme. Invitation links will not open OpenBot."',
    '"Unable to register the spinbot:// scheme. Links will not open Spinbot."',
  ],
  [
    "src/main/index.ts",
    'new Notification({ title: "OpenBot", body: translate("notification.welcome") })',
    'new Notification({ title: "Spinbot", body: translate("notification.welcome") })',
  ],
  // Spinbot registers spinbot://. Links keep their openbot:// form inside the app (shared contracts,
  // the mobile app and openbot.run use it), so an incoming spinbot: link is read as openbot:.
  [
    "src/main/deep-link-router.ts",
    'export const MCP_OAUTH_REDIRECT_URL = "openbot://mcp-auth";',
    'export const MCP_OAUTH_REDIRECT_URL = "spinbot://mcp-auth";',
  ],
  [
    "src/main/deep-link-router.ts",
    "export function parseDeepLink(value: string, options: InviteLinkOptions = {}): DeepLink | null {\n  try {",
    "export function parseDeepLink(value: string, options: InviteLinkOptions = {}): DeepLink | null {\n" +
      "  // Spinbot: the operating system hands this app spinbot: links; the parsers read the openbot: form.\n" +
      '  if (/^spinbot:/iu.test(value)) value = `openbot:${value.slice("spinbot:".length)}`;\n  try {',
  ],
  // Updates come from OpenBot's releases. They would replace Spinbot with OpenBot, so they are off.
  [
    "src/main/application-services.ts",
    "  const updatesEnabled =\n    !localServerChild &&",
    "  // Spinbot: no automatic updates; OpenBot's releases would replace this build. Merge upstream instead.\n" +
      "  const updatesEnabled =\n    false &&\n    !localServerChild &&",
  ],
  [
    "src/main/application-services.ts",
    'join(homedir(), "Library", "Caches", "app.openbot.desktop.ShipIt")',
    'join(homedir(), "Library", "Caches", "app.spinbot.desktop.ShipIt")',
  ],
  // --- Data folders: never the ones of an installed OpenBot ---------------------------------------
  [
    "src/backend/agent-store.ts",
    'openbotRoot = join(homePath, "OpenBot"),',
    'openbotRoot = join(homePath, "Spinbot"),',
  ],
  [
    "src/main/application-services.ts",
    'agentRoot: join(homedir(), "OpenBot", "Servers"),',
    'agentRoot: join(homedir(), "Spinbot", "Servers"),',
  ],
  [
    "src/main/provider-runtime-manager.ts",
    'return join(input.appData, "OpenBot", "provider-runtimes");',
    'return join(input.appData, "Spinbot", "provider-runtimes");',
  ],
  [
    "packages/ui/src/features/conversation/MarkdownMessageText.tsx",
    'return normalized.startsWith("~/OpenBot/Shared/") ||\n    normalized.startsWith("OpenBot/Shared/") ||\n    normalized.includes("/OpenBot/Shared/")',
    'return normalized.startsWith("~/Spinbot/Shared/") ||\n    normalized.startsWith("Spinbot/Shared/") ||\n    normalized.includes("/Spinbot/Shared/")',
  ],
  // --- Names that other services show to the user -------------------------------------------------
  ["src/backend/mcp-oauth-provider.ts", 'client_name: "OpenBot",', 'client_name: "Spinbot",'],
  ["src/main/link-auth.ts", 'const LINK_CLIENT_HINT = "OpenBot";', 'const LINK_CLIENT_HINT = "Spinbot";'],
  ["src/main/server-mode.ts", 'const DEFAULT_SERVER_NAME = "OpenBot";', 'const DEFAULT_SERVER_NAME = "Spinbot";'],
  [
    "src/backend/claude-client.ts",
    'const CLAUDE_SESSION_TITLE = "OpenBot";',
    'const CLAUDE_SESSION_TITLE = "Spinbot";',
  ],
  ["src/backend/messaging/whatsapp/whatsapp-session.ts", '#browserName = "OpenBot";', '#browserName = "Spinbot";'],
  [
    "src/backend/messaging/whatsapp/whatsapp-session.ts",
    'options.codeLink ? "Chrome" : "OpenBot";',
    'options.codeLink ? "Chrome" : "Spinbot";',
  ],
  [
    "src/main/maintenance-service.ts",
    'application: { name: "OpenBot", version: app.getVersion() },',
    'application: { name: "Spinbot", version: app.getVersion() },',
  ],
];

/** Whole files where the word OpenBot is user-facing text only (checked: no keys or identifiers). */
const TEXT_GLOBS = [
  { dir: "packages/i18n/src/messages", test: (p) => /\.(ts|json)$/u.test(p) && !/\.test\./u.test(p) },
  { dir: "src/renderer", test: (p) => /^[^/]+\.html$/u.test(p) },
];
// Also Polish case endings (OpenBota, OpenBotem, OpenBotowi, …): the stem changes, the ending stays.
const WORD = /(?:\b|(?<=\\[nt]))OpenBot(?=(?:a|owi|em|ie|u|ów)?\b)/gu;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

let changed = 0;
let missing = 0;
const pending = new Map();
const read = (rel) => pending.get(rel) ?? readFileSync(join(ROOT, rel), "utf8");

for (const [rel, from, to] of EDITS) {
  const src = read(rel);
  if (src.includes(from)) {
    pending.set(rel, src.replace(from, to));
    changed += 1;
    if (check) console.log(`${rel}: ${from.split("\n")[0].slice(0, 70)}`);
  } else if (!src.includes(to)) {
    missing += 1;
    console.error(`NOT FOUND (upstream changed?) ${rel}: ${from.split("\n")[0].slice(0, 70)}`);
  }
}
for (const { dir, test } of TEXT_GLOBS) {
  for (const abs of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, abs);
    if (NEVER.has(rel) || !test(relative(join(ROOT, dir), abs))) continue;
    const src = read(rel);
    const n = (src.match(WORD) ?? []).length;
    if (!n) continue;
    pending.set(rel, src.replace(WORD, "Spinbot"));
    changed += n;
    if (check) console.log(`${rel}: ${n} words`);
  }
}
// --- Phase 2: the word OpenBot in strings of the app's code (messages, agent instructions, paths) ---
// Line by line, only lines that hold a string, never comment lines. Tests too, so they stay in step.
// KEEP lists values that other OpenBot apps and servers read (wire protocol), and the legacy paths that
// database migrations match. Changing those would break joined servers, the mobile app or upgrades.
const CODE_DIRS = [
  "src/main",
  "src/backend",
  "src/preload",
  "src/renderer/src",
  "packages/ui/src",
  "packages/contracts/src",
  "packages/brand/src",
];
const KEEP = [
  /OpenBot-(Protocol-Version|App-Version|Capabilities|Host-Id|Host-Token|Hosting-Developer-Key)\b/u,
  /Co-authored-by: OpenBot/u,
  /OpenBot(\/|\\\\)Bots|"OpenBot", "Bots"/u,
];
// Tests of the legacy OpenBot/Bots -> OpenBot/Agents migration: their paths are upstream data, not our brand.
const SKIP_FILES = new Set(["src/backend/agent-workspace-root-migration.test.ts"]);
const CODE_WORD = /\bOpenBot\b/gu;
const COMMENT = /^\s*(\/\/|\*|\/\*)/u;
for (const dir of CODE_DIRS) {
  for (const abs of walk(join(ROOT, dir))) {
    if (!/\.(ts|tsx|mts)$/u.test(abs) || /\.stories\.tsx?$/u.test(abs)) continue;
    const rel = relative(ROOT, abs);
    if (SKIP_FILES.has(rel)) continue;
    const src = read(rel);
    if (!src.includes("OpenBot")) continue;
    let n = 0;
    const next = src
      .split("\n")
      .map((line) => {
        if (COMMENT.test(line) || !/["'`]/u.test(line) || KEEP.some((k) => k.test(line))) return line;
        return line.replace(CODE_WORD, () => {
          n += 1;
          return "Spinbot";
        });
      })
      .join("\n");
    if (!n) continue;
    pending.set(rel, next);
    changed += n;
    if (check) console.log(`${rel}: ${n} in code strings`);
  }
}

if (!check) for (const [rel, text] of pending) writeFileSync(join(ROOT, rel), text);
console.log(
  `${check ? "Would change" : "Changed"} ${changed} spans in ${pending.size} files; ${missing} edits not found.`,
);
if (missing) process.exitCode = 2;
else if (check && changed) process.exitCode = 1;
