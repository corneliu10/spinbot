// Deploys Spinbot's own account service (apps/auth-api) to the owner's Cloudflare account.
//
//   bun scripts/spinbot/deploy-account-service.ts [--dry-run]
//
// Private values stay outside the repository, in ~/.config/spinbot-relay/:
//   account.json  domains, D1 id, bucket names, SMTP host and user, the SMTP password file
//   secrets.env   ticket keys and shared secrets (also used by the relay server)
// The script writes a Spinbot config over apps/auth-api/wrangler.jsonc for the build and the deploy,
// and puts the original back at the end, also after a failure. Nothing private is written into git.
// No upstream analytics keys are set, so the service sends no account events anywhere.
import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "..");
const api = join(root, "apps", "auth-api");
const wrangler = join(root, "node_modules", ".bin", "wrangler");
const dir = join(homedir(), ".config", "spinbot-relay");
const dryRun = process.argv.includes("--dry-run");

type Settings = {
  name: string;
  apiDomain: string;
  signalDomain: string;
  d1DatabaseId: string;
  buckets: Record<"AVATARS" | "SKILLS" | "SITES", string>;
  smtp: { host: string; port: string; username: string; from: string };
  smtpPasswordFile: string;
};
const settings: Settings = JSON.parse(readFileSync(join(dir, "account.json"), "utf8"));

/** NAME=value lines; a value in single quotes loses them. */
function readEnvFile(path: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = /^([A-Z0-9_]+)=(.*)$/u.exec(line.trim());
    if (match?.[1] && match[2] !== undefined) out.set(match[1], match[2].replace(/^'(.*)'$/su, "$1"));
  }
  return out;
}
const secrets = readEnvFile(join(dir, "secrets.env"));

/** The parts of the Worker config that this script replaces; the rest is kept as it is. */
interface WorkerConfig {
  name?: string;
  routes?: unknown;
  vars?: unknown;
  services?: unknown;
  send_email?: unknown;
  d1_databases?: unknown;
  r2_buckets?: unknown;
}

/** JSONC to JSON: line comments outside strings, then trailing commas. */
function parseJsonc(text: string): WorkerConfig {
  let out = "";
  let inString = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inString) {
      out += char;
      if (char === "\\") out += text[++i] ?? "";
      else if (char === '"') inString = false;
    } else if (char === '"') {
      inString = true;
      out += char;
    } else if (char === "/" && text[i + 1] === "/") {
      while (i < text.length && text[i] !== "\n") i += 1;
      out += "\n";
    } else out += char;
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/gu, "$1"));
}

const configPath = join(api, "wrangler.jsonc");
const original = readFileSync(configPath, "utf8");
const config = parseJsonc(original);
const signal = settings.signalDomain;
config.name = settings.name;
config.routes = [{ pattern: settings.apiDomain, custom_domain: true }];
config.vars = {
  AUTH_EXPOSE_DEVELOPMENT_CODE: "false",
  EMAIL_SMTP_HOST: settings.smtp.host,
  EMAIL_SMTP_PORT: settings.smtp.port,
  EMAIL_SMTP_USERNAME: settings.smtp.username,
  EMAIL_FROM: settings.smtp.from,
  EMAIL_LICENSE_FROM: "",
  REMOTE_TICKET_KEY_ID: secrets.get("REMOTE_TICKET_KEY_ID"),
  REMOTE_SIGNAL_URL: `wss://${signal}/v1/signal`,
  REMOTE_AUTH_WEBHOOK_URL: `https://${signal}/internal/auth-events`,
  HOSTED_SERVERS_ENABLED: "false",
  GITHUB_APP_CLIENT_ID: "",
};
// No relay Worker or Cloudflare Email: mail goes through the owner's SMTP account.
delete config.services;
delete config.send_email;
config.d1_databases = [
  { binding: "DB", database_name: settings.name, database_id: settings.d1DatabaseId, migrations_dir: "migrations" },
];
config.r2_buckets = Object.entries(settings.buckets).map(([binding, bucket]) => ({ binding, bucket_name: bucket }));

function run(args: string[], options: { input?: string; cwd?: string } = {}): void {
  const label = args.slice(0, 3).join(" ");
  if (dryRun) {
    process.stdout.write(`(dry run) ${label}\n`);
    return;
  }
  const result = spawnSync(args[0] ?? "", args.slice(1), {
    cwd: options.cwd ?? api,
    input: options.input,
    stdio: options.input === undefined ? "inherit" : ["pipe", "inherit", "inherit"],
  });
  if (result.status !== 0) throw new Error(`${label} failed (${result.status}).`);
}

writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
try {
  const smtpPassword = readFileSync(settings.smtpPasswordFile, "utf8").replace(/\s+/gu, "");
  const put = {
    EMAIL_SMTP_PASSWORD: smtpPassword,
    SKILLS_ADMIN_TOKEN: secrets.get("SKILLS_ADMIN_TOKEN") ?? "",
    SITE_REPORT_HASH_SECRET: secrets.get("SITE_REPORT_HASH_SECRET") ?? "",
    REMOTE_TICKET_PRIVATE_JWK: secrets.get("REMOTE_TICKET_PRIVATE_JWK") ?? "",
    REMOTE_TICKET_PUBLIC_JWKS: secrets.get("REMOTE_TICKET_PUBLIC_JWKS") ?? "",
    REMOTE_AUTH_WEBHOOK_SECRET: secrets.get("REMOTE_AUTH_WEBHOOK_SECRET") ?? "",
  };
  for (const [name, value] of Object.entries(put)) {
    if (!value) throw new Error(`${name} is missing.`);
  }
  // The config requires the secrets at deploy time, so they go with the deploy in a private file that is
  // deleted at once (owner-only permissions, outside the repository).
  run([wrangler, "d1", "migrations", "apply", "DB", "--remote"]);
  run([process.execPath, "run", "build"]);
  const secretsFile = join(dir, "deploy-secrets.json");
  writeFileSync(secretsFile, JSON.stringify(put), { mode: 0o600 });
  try {
    run([wrangler, "deploy", "--keep-vars", "--secrets-file", secretsFile]);
  } finally {
    rmSync(secretsFile, { force: true });
  }
  process.stdout.write(`Deployed. Check: curl -fsS https://${settings.apiDomain}/health/live\n`);
} finally {
  writeFileSync(configPath, original);
}
