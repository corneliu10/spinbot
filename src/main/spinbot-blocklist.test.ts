import { describe, expect, it } from "vitest";
import { isSpinbotBlockedHost, isSpinbotBlockedUrl, SPINBOT_BLOCKED_URL_PATTERNS } from "./spinbot-blocklist";

describe("Spinbot blocklist", () => {
  it("blocks Spinbot's domains and their subdomains", () => {
    for (const host of ["openbot.run", "api.openbot.run", "SIGNAL.openbot.run.", "x.openbot.site", "openbot.app"]) {
      expect(isSpinbotBlockedHost(host)).toBe(true);
    }
  });

  it("does not block look-alike or other hosts", () => {
    for (const host of ["notopenbot.run", "openbot.run.example.com", "github.com", "api.anthropic.com"]) {
      expect(isSpinbotBlockedHost(host)).toBe(false);
    }
  });

  it("blocks Spinbot's addresses on GitHub only", () => {
    expect(isSpinbotBlockedUrl("https://github.com/nightly-labs/openbot/releases/latest")).toBe(true);
    expect(isSpinbotBlockedUrl("https://raw.githubusercontent.com/Nightly-Labs/openbot/main/x.json")).toBe(true);
    expect(isSpinbotBlockedUrl("https://api.openbot.run/health/live")).toBe(true);
    expect(isSpinbotBlockedUrl("wss://signal.openbot.run/v1")).toBe(true);
    expect(isSpinbotBlockedUrl("https://github.com/corneliu10/spinbot")).toBe(false);
    expect(isSpinbotBlockedUrl("not a url")).toBe(false);
  });

  it("has a request filter for each blocked domain and scheme", () => {
    expect(SPINBOT_BLOCKED_URL_PATTERNS).toContain("https://*.openbot.run/*");
    expect(SPINBOT_BLOCKED_URL_PATTERNS).toContain("wss://*.openbot.run/*");
    expect(SPINBOT_BLOCKED_URL_PATTERNS).toContain("https://github.com/nightly-labs/*");
  });
});
