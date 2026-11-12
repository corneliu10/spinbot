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
import { existsSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..", "..");
const check = process.argv.includes("--check");
const NEVER = new Set(["LICENSE", "NOTICE", "CLA.md"]);

/** Exact edits: [file, from, to]. "from" must appear in the file unless "to" is already there. */
const EDITS = [
  // Spinbot: the network guard runs before every other module (src/main/spinbot-network-guard.ts).
  [
    "src/main/index.ts",
    'import { uptime } from "node:os";\n',
    '// Spinbot: first, so that nothing reaches OpenBot\'s online services.\nimport "./spinbot-network-guard";\nimport { uptime } from "node:os";\n',
  ],
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
  // No product analytics or error reports to OpenBot's servers (analytics.openbot.run). Crash dumps already stay local.
  [
    "src/main/application-services.ts",
    'const analyticsEnabled = (app.isPackaged && appVariant === "production") || analyticsCaptureUrl !== null;',
    "// Spinbot: no product analytics or error reports to OpenBot's servers.\n  const analyticsEnabled = analyticsCaptureUrl !== null;",
  ],
  [
    "src/renderer/src/analytics.ts",
    '  return appInfo.analyticsCaptureUrl !== undefined || (productionBuild && appInfo.variant === "production");',
    "  // Spinbot: no product analytics to OpenBot's servers.\n  return appInfo.analyticsCaptureUrl !== undefined && productionBuild !== undefined;",
  ],
  [
    "src/renderer/src/error-reports.ts",
    '  if (capture === undefined && (!import.meta.env.PROD || info.variant !== "production")) return;',
    "  // Spinbot: no error reports to OpenBot's servers.\n  if (capture === undefined) return;",
  ],
  // The release check of servers asks OpenBot's GitHub releases for the newest version. Off, as updates.
  [
    "src/main/host-release-service.ts",
    "    this.#target =\n      options.packaged && isValidSemver",
    "    // Spinbot: no release checks against OpenBot's GitHub releases unless SPINBOT_RELEASE_CHECKS=1.\n" +
      '    this.#target =\n      process.env.SPINBOT_RELEASE_CHECKS === "1" && options.packaged && isValidSemver',
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
  // --- Features that work only through OpenBot's online services: hidden -------------------------
  [
    "src/renderer/src/features/settings/settings-tabs.ts",
    '  if (tab === "hosted-servers") return false;\n',
    "  // Spinbot: no account, billing, phone, updates or hosted servers: they need OpenBot's online services.\n" +
      '  if (tab === "hosted-servers" || tab === "profile" || tab === "billing" || tab === "mobile-connect" || tab === "updates")\n' +
      "    return false;\n",
  ],
  [
    "scripts/automation-cli-e2e.ts",
    'const CLI = resolve(import.meta.dirname, "../resources/cli/openbot-cli.mjs");',
    'const CLI = resolve(import.meta.dirname, "../resources/cli/spinbot-cli.mjs");',
  ],
  // No account service: the person at this computer is the local user, with no sign-in and no request.
  [
    "src/main/central-auth-manager.ts",
    'import { dirname } from "node:path";\n',
    'import { userInfo } from "node:os";\nimport { dirname } from "node:path";\n',
  ],
  [
    "src/main/central-auth-manager.ts",
    '    this.#setState({ status: "loading" });\n    let keyringChanged = false;',
    '    this.#setState({ status: "loading" });\n    // Spinbot: no account service. The person at this computer is the local user: no sign-in, no network\n    // request. SPINBOT_ACCOUNT_SERVICE=1 turns the account service back on (for a self-hosted one).\n    if (process.env.SPINBOT_ACCOUNT_SERVICE !== "1") {\n      const name = userInfo().username || null;\n      // `.invalid` is a reserved domain: the address can never reach anyone. Local data needs a valid form.\n      const user = {\n        id: "local",\n        email: "you@spinbot.invalid",\n        name,\n        avatarUrl: null,\n        analyticsEnabled: false,\n        chatColor: null,\n      };\n      return this.#setState({ status: "signed_in", user });\n    }\n    let keyringChanged = false;',
  ],
  // The switch for OpenBot's online services (packages/contracts/src/spinbot.ts).
  [
    "packages/contracts/package.json",
    '"./live-activity-relay": "./src/live-activity-relay.ts",',
    '"./spinbot": "./src/spinbot.ts",\n    "./live-activity-relay": "./src/live-activity-relay.ts",',
  ],
  [
    "src/renderer/src/features/onboarding/FirstRunChoice.tsx",
    'import { AnalyticsConsentRow, ConsentNotice } from "./AnalyticsConsent";\n',
    'import { AnalyticsConsentRow, ConsentNotice } from "./AnalyticsConsent";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/features/onboarding/FirstRunChoice.tsx",
    "        <AnalyticsConsentRow\n",
    "        <Show when={SPINBOT_ONLINE_SERVICES}>\n          <AnalyticsConsentRow\n",
  ],
  [
    "src/renderer/src/features/onboarding/FirstRunChoice.tsx",
    "          onChange={(enabled) => props.onAnalyticsChange(enabled)}\n        />\n      </div>\n      <ConsentNotice onOpenTerms={() => props.onOpenTerms()} onOpenPrivacy={() => props.onOpenPrivacy()} />\n",
    "          onChange={(enabled) => props.onAnalyticsChange(enabled)}\n          />\n        </Show>\n      </div>\n      <Show when={SPINBOT_ONLINE_SERVICES}>\n        <ConsentNotice onOpenTerms={() => props.onOpenTerms()} onOpenPrivacy={() => props.onOpenPrivacy()} />\n      </Show>\n",
  ],
  [
    "src/renderer/src/features/servers/server-actions.ts",
    'import { useText } from "@openbot/ui/text";\n',
    'import { useText } from "@openbot/ui/text";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/features/servers/server-actions.ts",
    "  const createLocal = platform.landingPreview ? undefined : () => setCreateLocalServerOpen(true);",
    "  const createLocal =\n    platform.landingPreview || !SPINBOT_ONLINE_SERVICES ? undefined : () => setCreateLocalServerOpen(true);",
  ],
  [
    "src/renderer/src/features/servers/server-actions.ts",
    "  const installServer = platform.landingPreview ? undefined : () => setInstallServerOpen(true);",
    "  const installServer =\n    platform.landingPreview || !SPINBOT_ONLINE_SERVICES ? undefined : () => setInstallServerOpen(true);",
  ],
  [
    "src/renderer/src/features/servers/server-actions.ts",
    "    select,\n    add,\n    createLocal,",
    "    select,\n    add: SPINBOT_ONLINE_SERVICES ? add : undefined,\n    createLocal,",
  ],
  [
    "src/renderer/src/app-bootstrap.tsx",
    'import type { MarketplaceListingLink } from "@openbot/contracts/marketplace-links";\n',
    'import type { MarketplaceListingLink } from "@openbot/contracts/marketplace-links";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/app-bootstrap.tsx",
    "    const receiveInvite = (inviteUrl: string) => {\n",
    "    const receiveInvite = (inviteUrl: string) => {\n      if (!SPINBOT_ONLINE_SERVICES) return;\n",
  ],
  [
    "src/renderer/src/app-bootstrap.tsx",
    "    const receiveMarketplaceListing = (link: MarketplaceListingLink) => {\n",
    "    const receiveMarketplaceListing = (link: MarketplaceListingLink) => {\n      if (!SPINBOT_ONLINE_SERVICES) return;\n",
  ],
  [
    "src/renderer/src/app-bootstrap.tsx",
    "    const receiveAgentTemplate = (id: string) => {\n",
    "    const receiveAgentTemplate = (id: string) => {\n      if (!SPINBOT_ONLINE_SERVICES) return;\n",
  ],
  [
    "src/renderer/src/WorkspaceOverlays.tsx",
    'import { currentText } from "@openbot/ui/text";\n',
    'import { currentText } from "@openbot/ui/text";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/WorkspaceOverlays.tsx",
    '          hostedSites={\n            serverSupportsCapability(server(), "hosted-sites-v1")',
    '          hostedSites={\n            SPINBOT_ONLINE_SERVICES && serverSupportsCapability(server(), "hosted-sites-v1")',
  ],
  [
    "packages/ui/src/features/marketplace/marketplace-view.ts",
    'export const MARKETPLACE_TABS: readonly MarketplaceTab[] = ["apps", "agents", "skills"];',
    '// Spinbot: no Agents tab; its catalog is on OpenBot\'s servers.\nexport const MARKETPLACE_TABS: readonly MarketplaceTab[] = ["apps", "skills"];',
  ],
  [
    "src/renderer/src/features/conversation/ConversationPanels.tsx",
    'import { type HostFolderPick, HostFolderPicker } from "@openbot/ui/features/conversation/HostFolderPicker";\n',
    'import { type HostFolderPick, HostFolderPicker } from "@openbot/ui/features/conversation/HostFolderPicker";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/features/conversation/ConversationPanels.tsx",
    "  const canPublish = () =>\n    props.runtime",
    "  const canPublish = () =>\n    SPINBOT_ONLINE_SERVICES &&\n    (props.runtime",
  ],
  [
    "src/renderer/src/features/conversation/ConversationPanels.tsx",
    '        (props.server?.kind === "remote" && serverCanAdminister(props.server, "agent-publish-v1"));',
    '        (props.server?.kind === "remote" && serverCanAdminister(props.server, "agent-publish-v1")));',
  ],
  [
    "src/renderer/src/features/sidebar/WorkspaceSidebar.tsx",
    'import { useText } from "@openbot/ui/text";\n',
    'import { useText } from "@openbot/ui/text";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/features/sidebar/WorkspaceSidebar.tsx",
    "            <Show when={!platform.landingPreview && !alertCards.shown() && !mobileAppDismissed()}>",
    "            <Show when={SPINBOT_ONLINE_SERVICES && !platform.landingPreview && !alertCards.shown() && !mobileAppDismissed()}>",
  ],
  [
    "src/renderer/src/features/sidebar/WorkspaceSidebar.tsx",
    "                !platform.landingPreview && !alertCards.shown() && mobileAppDismissed() && !communityCard.dismissed()",
    "                SPINBOT_ONLINE_SERVICES &&\n                !platform.landingPreview &&\n                !alertCards.shown() &&\n                mobileAppDismissed() &&\n                !communityCard.dismissed()",
  ],
  [
    "src/renderer/src/features/connectors/connectors-context.tsx",
    'import { WHATSAPP_CONNECTOR_CAPABILITY } from "@openbot/contracts/team-protocol/whatsapp-connector-v1";\n',
    'import { WHATSAPP_CONNECTOR_CAPABILITY } from "@openbot/contracts/team-protocol/whatsapp-connector-v1";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/features/connectors/connectors-context.tsx",
    "      { github: githubConnectorPort, ...LOCAL_CONNECTOR_TRANSPORTS, messaging, whatsapp: whatsappPort },",
    "      {\n        github: githubConnectorPort,\n        ...LOCAL_CONNECTOR_TRANSPORTS,\n        ...(SPINBOT_ONLINE_SERVICES ? { messaging } : {}),\n        whatsapp: whatsappPort,\n      },",
  ],
  [
    "src/main/github-connector-config.ts",
    'const GITHUB_APP_CLIENT_ID = "Iv23lik5pzHz70cb0RUL";\nconst GITHUB_APP_SLUG = "openbotgit";',
    '// Spinbot: OpenBot\'s GitHub App is not used, so the built-in GitHub connection is not offered.\nconst GITHUB_APP_CLIENT_ID = "";\nconst GITHUB_APP_SLUG = "";',
  ],
  [
    "src/renderer/src/features/conversation/AgentRoutinesSettings.tsx",
    'import { useText } from "@openbot/ui/text";\n',
    'import { useText } from "@openbot/ui/text";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/features/conversation/AgentRoutinesSettings.tsx",
    "                {/* A host with events offers both triggers, so the choice is always in view. */}\n                <Show when={props.port.events}>",
    "                {/* A host with events offers both triggers, so the choice is always in view. */}\n                <Show when={SPINBOT_ONLINE_SERVICES && props.port.events}>",
  ],
  [
    "packages/ui/src/features/updates/HelpMenu.tsx",
    'import { BookOpen, Bug, CircleQuestionMark, DropdownMenu, Gift, Megaphone, MotionTooltip } from "@openbot/ui";\n',
    'import { BookOpen, Bug, CircleQuestionMark, DropdownMenu, Gift, Megaphone, MotionTooltip } from "@openbot/ui";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "packages/ui/src/features/updates/HelpMenu.tsx",
    "          <DropdownMenu.Item onSelect={() => props.onOpenChangelog()}>",
    "          <Show when={SPINBOT_ONLINE_SERVICES}>\n          <DropdownMenu.Item onSelect={() => props.onOpenChangelog()}>",
  ],
  [
    "packages/ui/src/features/updates/HelpMenu.tsx",
    '            <span>{t("account.menu.sendFeedback")}</span>\n          </DropdownMenu.Item>\n        </DropdownMenu.Content>',
    '            <span>{t("account.menu.sendFeedback")}</span>\n          </DropdownMenu.Item>\n          </Show>\n        </DropdownMenu.Content>',
  ],
  [
    "packages/ui/src/features/updates/WhatsNewDialog.tsx",
    'import { Button, ChevronDown, Dialog, ExternalLink, Heading, IconButton, Text, TriangleAlert, X } from "@openbot/ui";\n',
    'import { Button, ChevronDown, Dialog, ExternalLink, Heading, IconButton, Text, TriangleAlert, X } from "@openbot/ui";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "packages/ui/src/features/updates/WhatsNewDialog.tsx",
    '              <Button type="button" variant="ghost" onClick={() => props.onOpenChangelog()}>\n                {t("update.whatsNew.changelog")}\n                <ExternalLink aria-hidden="true" />\n              </Button>',
    '              <Show when={SPINBOT_ONLINE_SERVICES}>\n                <Button type="button" variant="ghost" onClick={() => props.onOpenChangelog()}>\n                  {t("update.whatsNew.changelog")}\n                  <ExternalLink aria-hidden="true" />\n                </Button>\n              </Show>',
  ],
  [
    "src/renderer/src/features/conversation/github-star-prompt.tsx",
    'import { GitHubStarToast } from "@openbot/ui/features/github-star/GitHubStarToast";\n',
    'import { GitHubStarToast } from "@openbot/ui/features/github-star/GitHubStarToast";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/features/conversation/github-star-prompt.tsx",
    "export function noteAgentMessageSent(): void {\n  let sent: number;",
    "export function noteAgentMessageSent(): void {\n  if (!SPINBOT_ONLINE_SERVICES) return;\n  let sent: number;",
  ],
  [
    "src/renderer/src/features/conversation/social-follow-prompt.tsx",
    'import { currentText } from "@openbot/ui/text";\n',
    'import { currentText } from "@openbot/ui/text";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/features/conversation/social-follow-prompt.tsx",
    "  return githubStarPromptShownThisSession() || dialogOpen();",
    "  return !SPINBOT_ONLINE_SERVICES || githubStarPromptShownThisSession() || dialogOpen();",
  ],
  [
    "packages/ui/src/features/marketplace/MarketplaceAppPage.tsx",
    'import { useText } from "@openbot/ui/text";\n',
    'import { useText } from "@openbot/ui/text";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "packages/ui/src/features/marketplace/MarketplaceAppPage.tsx",
    '          <Button type="button" variant="outline" size="sm" onClick={() => model().copyLink(plugin().slug)}>\n            <Link2 aria-hidden="true" />\n            {t("plugin.copyLink")}\n          </Button>',
    '          <Show when={SPINBOT_ONLINE_SERVICES}>\n            <Button type="button" variant="outline" size="sm" onClick={() => model().copyLink(plugin().slug)}>\n              <Link2 aria-hidden="true" />\n              {t("plugin.copyLink")}\n            </Button>\n          </Show>',
  ],
  [
    "src/backend/openbot-tools.ts",
    'import { isUiBlockId, UI_BLOCK_LIMITS } from "@openbot/contracts/ui-blocks";\n',
    'import { isUiBlockId, UI_BLOCK_LIMITS } from "@openbot/contracts/ui-blocks";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/backend/openbot-tools.ts",
    "export const OPENBOT_TOOL_DEFINITIONS: readonly OpenBotToolDefinition[] = [\n",
    "const ALL_OPENBOT_TOOL_DEFINITIONS: readonly OpenBotToolDefinition[] = [\n",
  ],
  [
    "src/backend/openbot-tools.ts",
    "\nexport const OPENBOT_DYNAMIC_TOOLS = {\n",
    "\n/** Spinbot: tools that need OpenBot's online services: sites, server installs, webhooks, feedback. */\n" +
      "const SPINBOT_SERVICE_TOOLS = new Set([\n" +
      '  "list_sites",\n  "publish_site",\n  "replace_site",\n  "delete_site",\n  "create_server_install_command",\n' +
      '  "create_webhook_routine",\n  "update_webhook_routine",\n  "send_feedback",\n]);\n' +
      "export const OPENBOT_TOOL_DEFINITIONS: readonly OpenBotToolDefinition[] = SPINBOT_ONLINE_SERVICES\n" +
      "  ? ALL_OPENBOT_TOOL_DEFINITIONS\n" +
      "  : ALL_OPENBOT_TOOL_DEFINITIONS.filter((tool) => !SPINBOT_SERVICE_TOOLS.has(tool.name));\n" +
      "\nexport const OPENBOT_DYNAMIC_TOOLS = {\n",
  ],
  [
    "src/backend/agent/developer-instructions.ts",
    " For an Spinbot bug or wanted change, call spinbot.send_feedback unasked; its card asks.",
    "",
  ],
  [
    "src/backend/agent/developer-instructions.ts",
    "create a routine with spinbot.create_routine, or spinbot.create_webhook_routine for events from another system;",
    "create a routine with spinbot.create_routine;",
  ],
  [
    "packages/contracts/src/ipc-agent-import.ts",
    'export const HERMES_EXPORT_SKILL_ID = "nightly-labs/openbot/resources/agent-import/hermes-agent";',
    'export const HERMES_EXPORT_SKILL_ID = "corneliu10/spinbot/resources/agent-import/hermes-agent";',
  ],
  // The skills catalog is on OpenBot's servers: the Skills tab lists only the skills of this computer.
  [
    "src/main/skill-marketplace-service.ts",
    'import { INPUT_LIMITS } from "@openbot/contracts/input-limits";\n',
    'import { INPUT_LIMITS } from "@openbot/contracts/input-limits";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/main/skill-marketplace-service.ts",
    "      const params = marketplaceQueryParams(query);\n      const page = yield* this.auth",
    "      if (!SPINBOT_ONLINE_SERVICES) return { skills: [], nextCursor: null };\n      const params = marketplaceQueryParams(query);\n      const page = yield* this.auth",
  ],
  // Server members (invitations, publishing) and remote desktop work through OpenBot's relay: hidden.
  [
    "src/renderer/src/features/servers/ServerSettingsModal.tsx",
    'import { useText } from "@openbot/ui/text";\n',
    'import { useText } from "@openbot/ui/text";\nimport { SPINBOT_ONLINE_SERVICES } from "@openbot/contracts/spinbot";\n',
  ],
  [
    "src/renderer/src/features/servers/ServerSettingsModal.tsx",
    '      case "general":\n      case "members":\n        return true;',
    '      case "general":\n        return true;\n      case "members":\n        return SPINBOT_ONLINE_SERVICES;',
  ],
  [
    "src/renderer/src/features/servers/ServerSettingsModal.tsx",
    '      case "desktop":\n        return remoteDesktopSection();',
    '      case "desktop":\n        return SPINBOT_ONLINE_SERVICES && remoteDesktopSection();',
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
  // The bundled command line tool: its folder and messages must name Spinbot, or it drives OpenBot's agents.
  { dir: "resources/cli", test: (p) => /\.mjs$/u.test(p) },
  // What's new notes (all languages), plugin descriptions and the texts agents read (skills, import guides).
  { dir: "src/renderer/src/features/updates", test: (p) => /\.json$/u.test(p) },
  { dir: "resources", test: (p) => /\.(json|md)$/u.test(p) && !/(licen[cs]e|notice|copying)/iu.test(p) },
];
// Also Polish case endings (OpenBota, OpenBotem, OpenBotowi, …): the stem changes, the ending stays.
const WORD = /(?:\b|(?<=\\[nt]))OpenBot(?=(?:a|owi|em|ie|u|ów)?\b)/gu;
// Every message says Spinbot (owner's decision 2026-11-12: no OpenBot name anywhere but the legal notices).
const KEEP_KEYS = null;
const KEY = /^\s*"([^"]+)":/u;

/** Replaces the word in a message file, except in the messages that KEEP_KEYS names. */
function rebrandMessages(src) {
  let key = "";
  let n = 0;
  const out = src
    .split("\n")
    .map((line) => {
      const m = KEY.exec(line);
      if (m) key = m[1];
      if (KEEP_KEYS?.test(key)) return line;
      return line.replace(WORD, () => {
        n += 1;
        return "Spinbot";
      });
    })
    .join("\n");
  return { out, n };
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

// Files renamed to Spinbot names (the old name is gone afterwards).
const RENAMES = [["resources/cli/openbot-cli.mjs", "resources/cli/spinbot-cli.mjs"]];
for (const [from, to] of RENAMES) {
  if (!existsSync(join(ROOT, from))) continue;
  if (check) console.log(`rename ${from} -> ${to}`);
  else renameSync(join(ROOT, from), join(ROOT, to));
}

let changed = 0;
let missing = 0;
const pending = new Map();
const read = (rel) => pending.get(rel) ?? readFileSync(join(ROOT, rel), "utf8");

for (const [rel, from, to] of EDITS) {
  const src = read(rel);
  // Already applied when the result is there. Spaces and line breaks do not count (the formatter moves
  // them), and for an edit that only adds text, the added text alone counts (it can move, as imports do).
  const flat = (text) => text.replace(/\s+/gu, "");
  const added = to.startsWith(from) ? to.slice(from.length) : to.endsWith(from) ? to.slice(0, -from.length) : null;
  const applied =
    flat(src).includes(flat(to)) || (added !== null && flat(added) !== "" && flat(src).includes(flat(added)));
  if (!applied && src.includes(from)) {
    pending.set(rel, src.replace(from, to));
    changed += 1;
    if (check) console.log(`${rel}: ${from.split("\n")[0].slice(0, 70)}`);
  } else if (!applied) {
    missing += 1;
    console.error(`NOT FOUND (upstream changed?) ${rel}: ${from.split("\n")[0].slice(0, 70)}`);
  }
}
for (const { dir, test } of TEXT_GLOBS) {
  for (const abs of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, abs);
    if (NEVER.has(rel) || !test(relative(join(ROOT, dir), abs))) continue;
    const src = read(rel);
    const { out, n } = rel.startsWith("packages/i18n/")
      ? rebrandMessages(src)
      : { out: src.replace(WORD, "Spinbot"), n: (src.match(WORD) ?? []).length };
    if (!n) continue;
    pending.set(rel, out);
    changed += n;
    if (check) console.log(`${rel}: ${n} words`);
  }
}
// --- What's new: drop the notes that send people to OpenBot's site. The language files follow the
// English file item by item, so the same positions go from each of them.
{
  const dir = "src/renderer/src/features/updates";
  const englishPath = `${dir}/whats-new-releases.json`;
  const english = JSON.parse(read(englishPath));
  const drop = [];
  for (const [r, release] of english.entries()) {
    for (const [g, group] of (release.groups ?? []).entries()) {
      for (const [i, item] of (group.items ?? []).entries()) {
        if (typeof item === "string" && /openbot\.run/iu.test(item)) drop.push([r, g, i]);
      }
    }
  }
  if (drop.length) {
    const files = [
      englishPath,
      ...readdirSync(join(ROOT, dir, "whats-new"))
        .filter((f) => f.endsWith(".json"))
        .map((f) => `${dir}/whats-new/${f}`),
    ];
    for (const rel of files) {
      const data = JSON.parse(read(rel));
      for (const [r, g, i] of [...drop].sort((a, b) => b[2] - a[2])) data[r]?.groups?.[g]?.items?.splice(i, 1);
      pending.set(rel, `${JSON.stringify(data, null, 2)}\n`);
      changed += drop.length;
      if (check) console.log(`${rel}: ${drop.length} notes about OpenBot's site`);
    }
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
  "packages/team-client/src",
  "packages/whatsapp/src",
  "packages/user-errors/src",
  "packages/telemetry/src",
  "packages/logging/src",
];
// Kept: the legacy paths that database migrations of upgraded OpenBot data match. Never shown to a user.
const KEEP = [/OpenBot(\/|\\\\)Bots|"OpenBot", "Bots"/u];
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

// --- Phase 3: lowercase "openbot" that agents, users or other services see -----------------------
// The tool namespaces (openbot.*, openbot_browser.*, mcp__openbot__*), the client names sent to AI
// providers and MCP servers, the prompt tags agents read, and the shared table's metadata table.
// File names, settings keys and internal identifiers stay as they are.
const LOWER_DIRS = [
  ...CODE_DIRS,
  "packages/i18n/src/messages",
  "resources/managed-skills",
  "resources/plugin-catalog",
  "resources/agent-import",
  "resources/cli",
];
const LOWER_RULES = [
  [/mcp__openbot_browser__/gu, "mcp__spinbot_browser__"],
  [/mcp__openbot__/gu, "mcp__spinbot__"],
  [/\bopenbot_browser\b/gu, "spinbot_browser"],
  [/\bopenbot__/gu, "spinbot__"],
  [/\bopenbot\.(?=(?:remember|[a-z]+_[a-z0-9_]+)\b)/gu, "spinbot."],
  [/\(\?:openbot\\\./gu, "(?:spinbot\\."],
  [
    /(\bname: |\bnamespace: |namespace === |namespace !== |serviceName: |managedBy: |CLAUDE_CODE_ENTRYPOINT: |"server"\) !== |call\()"openbot"/gu,
    '$1"spinbot"',
  ],
  [/"openbot\/0\.1\.0"/gu, '"spinbot/0.1.0"'],
  [/RESERVED_MCP_SERVER_NAMES = \["openbot"/gu, 'RESERVED_MCP_SERVER_NAMES = ["spinbot"'],
  [/\{ GROK_OAUTH2_REFERRER: "openbot" \}/gu, "{}"],
  [/\bopenbot-(export|activity|cli)\b/gu, "spinbot-$1"],
  [
    /\bopenbot_(saved_memories_update|saved_memories|section_teammates|turn_style|agent_instructions|saved_logins|metadata)\b/gu,
    "spinbot_$1",
  ],
];
for (const dir of LOWER_DIRS) {
  let files;
  try {
    files = walk(join(ROOT, dir));
  } catch {
    continue;
  }
  for (const abs of files) {
    if (!/\.(ts|tsx|mts|mjs|json|md)$/u.test(abs) || /\.stories\.tsx?$/u.test(abs)) continue;
    const rel = relative(ROOT, abs);
    if (SKIP_FILES.has(rel) || NEVER.has(rel)) continue;
    const src = read(rel);
    if (!src.includes("openbot")) continue;
    let n = 0;
    let next = src;
    for (const [pattern, replacement] of LOWER_RULES) {
      const hits = next.match(pattern);
      if (!hits) continue;
      n += hits.length;
      next = next.replace(pattern, replacement);
    }
    if (!n) continue;
    pending.set(rel, next);
    changed += n;
    if (check) console.log(`${rel}: ${n} lowercase labels`);
  }
}

if (!check) for (const [rel, text] of pending) writeFileSync(join(ROOT, rel), text);
console.log(
  `${check ? "Would change" : "Changed"} ${changed} spans in ${pending.size} files; ${missing} edits not found.`,
);
if (missing) process.exitCode = 2;
else if (check && changed) process.exitCode = 1;
