// Spinbot: the hosts and addresses of OpenBot's online services. Spinbot never connects to them.
// Pure functions, so tests can check them; spinbot-network-guard.ts applies them.

/** Every host name under these domains is blocked. */
export const SPINBOT_BLOCKED_DOMAINS = ["openbot.run", "openbot.site", "openbot.app"] as const;

/** Addresses on shared hosts (GitHub) that belong to OpenBot. Compared in lower case. */
export const SPINBOT_BLOCKED_URL_PREFIXES = [
  "https://github.com/nightly-labs/",
  "https://raw.githubusercontent.com/nightly-labs/",
  "https://api.github.com/repos/nightly-labs/",
  "https://objects.githubusercontent.com/github-production-release-asset/nightly-labs/",
] as const;

/** Electron URL patterns for the same hosts and addresses, for `webRequest` filters. */
export const SPINBOT_BLOCKED_URL_PATTERNS: readonly string[] = [
  ...SPINBOT_BLOCKED_DOMAINS.flatMap((domain) =>
    ["http", "https", "ws", "wss"].flatMap((scheme) => [`${scheme}://${domain}/*`, `${scheme}://*.${domain}/*`]),
  ),
  ...SPINBOT_BLOCKED_URL_PREFIXES.map((prefix) => `${prefix}*`),
];

export function isSpinbotBlockedHost(hostname: string): boolean {
  const host = hostname.trim().toLowerCase().replace(/\.$/u, "");
  return SPINBOT_BLOCKED_DOMAINS.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

export function isSpinbotBlockedUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (isSpinbotBlockedHost(url.hostname)) return true;
  const href = url.href.toLowerCase();
  return SPINBOT_BLOCKED_URL_PREFIXES.some((prefix) => href.startsWith(prefix));
}
