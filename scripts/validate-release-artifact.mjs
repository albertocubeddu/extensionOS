import { existsSync, readFileSync, statSync } from "node:fs";
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

assertFile(manifestPath, "production manifest");
assertFile(packagePath, "production package zip");
assert(
  statSync(packagePath).size > 10_000,
  "production package zip is unexpectedly small.",
);

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const manifestText = JSON.stringify(manifest);
const expectedVersion = process.env.RELEASE_VERSION;

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
