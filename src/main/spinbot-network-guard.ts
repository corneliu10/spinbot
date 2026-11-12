// Spinbot: refuses every connection to OpenBot's online services (see spinbot-blocklist.ts).
//
// Imported first by the main entry point, so it runs before any other module can make a request.
// Four layers, because the app reaches the network four ways:
// 1. `fetch` in this process: refused before it starts, also for OpenBot paths on GitHub.
// 2. Everything else in this process (http, https, WebSocket clients): host name lookups fail.
// 3. Chromium (app windows, hidden windows, Electron `net`): each session cancels the request.
// 4. `shell.openExternal`: OpenBot pages are not opened in the user's browser.
import dns, { type LookupAddress } from "node:dns";
import { syncBuiltinESMExports } from "node:module";
import { app, type Session, session, shell } from "electron";
import { isSpinbotBlockedHost, isSpinbotBlockedUrl, SPINBOT_BLOCKED_URL_PATTERNS } from "./spinbot-blocklist";

function refusal(hostname: string): NodeJS.ErrnoException {
  const error: NodeJS.ErrnoException = new Error(`Spinbot does not connect to ${hostname}.`);
  error.code = "ENOTFOUND";
  error.syscall = "getaddrinfo";
  return Object.assign(error, { hostname });
}

// 1. fetch
const originalFetch = globalThis.fetch;
async function guardedFetchCall(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
): Promise<Response> {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (isSpinbotBlockedUrl(url)) throw new TypeError("fetch failed", { cause: refusal(new URL(url).hostname) });
  return originalFetch(input, init);
}
globalThis.fetch = Object.assign(guardedFetchCall, { preconnect: originalFetch.preconnect });

// 2. Host name lookups. `net` (and so http, https, tls and WebSocket clients) reads `dns.lookup` at call time.
type LookupCallback = (error: NodeJS.ErrnoException | null) => void;
function isLookupCallback(value: unknown): value is LookupCallback {
  return typeof value === "function";
}
/** The two lookups as this guard calls them: a host name, then the caller's own arguments unchanged. */
interface HostLookups {
  lookup(hostname: string, ...rest: unknown[]): void;
  promisesLookup(hostname: string, ...rest: unknown[]): Promise<LookupAddress | LookupAddress[]>;
}
const originals: HostLookups = { lookup: dns.lookup, promisesLookup: dns.promises.lookup };
function guardedLookup(hostname: string, ...rest: unknown[]): void {
  if (isSpinbotBlockedHost(String(hostname))) {
    const callback = rest.findLast(isLookupCallback);
    if (callback) process.nextTick(() => callback(refusal(hostname)));
    return;
  }
  originals.lookup(hostname, ...rest);
}
async function guardedPromisesLookup(hostname: string, ...rest: unknown[]): Promise<LookupAddress | LookupAddress[]> {
  if (isSpinbotBlockedHost(String(hostname))) throw refusal(hostname);
  return originals.promisesLookup(hostname, ...rest);
}
const writable = { writable: true, configurable: true, enumerable: true };
Object.defineProperty(dns, "lookup", { value: guardedLookup, ...writable });
Object.defineProperty(dns.promises, "lookup", { value: guardedPromisesLookup, ...writable });
syncBuiltinESMExports();

// 3. Chromium sessions. A session has one onBeforeRequest listener; a later one replaces this one.
const guarded = new WeakSet<Session>();
function guardSession(target: Session): void {
  if (guarded.has(target)) return;
  guarded.add(target);
  target.webRequest.onBeforeRequest({ urls: [...SPINBOT_BLOCKED_URL_PATTERNS] }, (details, callback) => {
    callback({ cancel: isSpinbotBlockedUrl(details.url) });
  });
}
app.on("session-created", guardSession);
void app.whenReady().then(() => guardSession(session.defaultSession));

// 4. Links opened in the user's browser
const originalOpenExternal = shell.openExternal.bind(shell);
const guardedOpenExternal: typeof shell.openExternal = (url, options) =>
  isSpinbotBlockedUrl(url) ? Promise.resolve() : originalOpenExternal(url, options);
shell.openExternal = guardedOpenExternal;
