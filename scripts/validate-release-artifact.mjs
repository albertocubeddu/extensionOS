import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const prodDir = join(root, "build", "chrome-mv3-prod");
const manifestPath = join(prodDir, "manifest.json");
const packagePath = join(root, "build", "chrome-mv3-prod.zip");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertFile(path, label = path) {
  assert(existsSync(path), `${label} is missing.`);
  assert(statSync(path).size > 0, `${label} is empty.`);
}

function assertManifestFile(manifest, fileName, label = fileName) {
  assertFile(join(prodDir, fileName), `${label} referenced by manifest`);
}

function parseEnvFile(contents) {
  const env = {};

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const normalized = line.startsWith("export ")
      ? line.slice("export ".length).trim()
      : line;
    const separatorIndex = normalized.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = normalized.slice(0, separatorIndex).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      continue;
    }

    let value = normalized.slice(separatorIndex + 1).trim();
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.endsWith(quote)) {
      value = value.slice(1, -1);
      if (quote === '"') {
        value = value.replace(/\\n/g, "\n").replace(/\\"/g, '"');
      }
    } else {
      const commentIndex = value.search(/\s#/);
      if (commentIndex !== -1) {
        value = value.slice(0, commentIndex).trim();
      }
    }

    env[key] = value;
  }

  return env;
}

function loadLocalReleaseEnv() {
  const env = { ...process.env };
  const envFiles = [
    ".env.chrome.local",
    ".env.prod.local",
    ".env.production.local",
    ".env.local",
    ".env.chrome",
    ".env.prod",
    ".env.production",
    ".env",
  ];

  for (const fileName of envFiles) {
    const path = join(root, fileName);
    if (!existsSync(path)) {
      continue;
    }

    for (const [key, value] of Object.entries(
      parseEnvFile(readFileSync(path, "utf8")),
    )) {
      if (env[key] === undefined) {
        env[key] = value;
      }
    }
  }

  return env;
}

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

function assertProvidedPublicEnvInlined(bundleText, name) {
  const value = buildEnv[name];
  if (!value) {
    return;
  }

  assert(
    bundleText.includes(value),
    `${name} was provided but was not inlined into the JavaScript bundle.`,
  );
}

assertFile(manifestPath, "production manifest");
assertFile(packagePath, "production package zip");
assert(
  statSync(packagePath).size > 10_000,
  "production package zip is unexpectedly small.",
);

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const manifestText = JSON.stringify(manifest);
const buildEnv = loadLocalReleaseEnv();
const expectedVersion = buildEnv.RELEASE_VERSION;
const requiredPublicBuildEnv = [
  "PLASMO_PUBLIC_EXTENSION_OS_API_ENDPOINT",
  "PLASMO_PUBLIC_WEBSITE_EXTENSION_OS",
];

for (const name of requiredPublicBuildEnv) {
  assert(buildEnv[name], `${name} is missing in the release build environment.`);
}

assert(manifest.manifest_version === 3, "manifest must be MV3.");
assert(
  manifest.name === "Extension-OS: Your AI Partner",
  "manifest name drifted.",
);
assert(manifest.version, "manifest version is missing.");
if (expectedVersion) {
  assert(
    manifest.version === expectedVersion,
    `manifest version ${manifest.version} does not match release version ${expectedVersion}.`,
  );
}
assert(
  !/\$[A-Z0-9_]+/.test(manifestText),
  "manifest contains unresolved environment placeholders.",
);

const jsBundleText = listFiles(prodDir)
  .filter((path) => path.endsWith(".js"))
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");

assert(
  !/process\.env\.PLASMO_PUBLIC_[A-Z0-9_]+/.test(jsBundleText),
  "JavaScript bundle contains unresolved Plasmo public env references.",
);

for (const name of [
  ...requiredPublicBuildEnv,
  "PLASMO_PUBLIC_SUPABASE_URL",
  "PLASMO_PUBLIC_SUPABASE_ANON_KEY",
]) {
  assertProvidedPublicEnvInlined(jsBundleText, name);
}

assert(manifest.background?.service_worker, "service worker is missing.");
assertManifestFile(
  manifest,
  manifest.background.service_worker,
  "service worker",
);

assert(
  manifest.action?.default_popup === "popup.html",
  "popup entrypoint drifted.",
);
assert(
  manifest.options_ui?.page === "options.html",
  "options entrypoint drifted.",
);
assert(
  manifest.side_panel?.default_path === "sidepanel.html",
  "sidepanel drifted.",
);
assertManifestFile(manifest, "popup.html", "popup.html");
assertManifestFile(manifest, "options.html", "options.html");
assertManifestFile(manifest, "sidepanel.html", "sidepanel.html");

for (const permission of [
  "storage",
  "sidePanel",
  "contextMenus",
  "clipboard",
  "identity",
  "identity.email",
]) {
  assert(
    manifest.permissions?.includes(permission),
    `manifest permission ${permission} is missing.`,
  );
}

assert(
  manifest.host_permissions?.includes("http://*/*"),
  "http host permission is missing.",
);

const contentScripts = manifest.content_scripts ?? [];
assert(
  contentScripts.length >= 2,
  "expected SelectionMenu and core content scripts.",
);
for (const script of contentScripts.flatMap((entry) => entry.js ?? [])) {
  assertManifestFile(manifest, script, `content script ${script}`);
}

assert(
  manifest.key && !manifest.key.includes("$"),
  "extension key is missing.",
);
assert(
  manifest.oauth2?.client_id && !manifest.oauth2.client_id.includes("$"),
  "OAuth client id is missing.",
);
assert(
  manifest.oauth2?.scopes?.includes(
    "https://www.googleapis.com/auth/userinfo.email",
  ),
  "OAuth email scope is missing.",
);

for (const size of ["16", "32", "48", "64", "128"]) {
  const icon = manifest.icons?.[size];
  assert(icon, `icon ${size} is missing from manifest.`);
  assertManifestFile(manifest, icon, `icon ${size}`);
}

console.log("Release artifact validation passed.");
