// @ts-check

import { readFile } from "fs/promises";

const manifestPath = "manifest.json";
const raw = await readFile(manifestPath, "utf8");
/** @type {Record<string, unknown>} */
const manifest = JSON.parse(raw);
/** @type {{ name?: unknown }} */
const pkg = JSON.parse(await readFile("package.json", "utf8"));

const required = [
  "id",
  "name",
  "version",
  "minAppVersion",
  "description",
  "author",
  "isDesktopOnly",
];

const missing = required.filter((key) => !(key in manifest));
if (missing.length > 0) {
  throw new Error(`manifest.json missing fields: ${missing.join(", ")}`);
}

const id = typeof manifest.id === "string" ? manifest.id : "";
const version = typeof manifest.version === "string" ? manifest.version : "";
const minAppVersion = typeof manifest.minAppVersion === "string" ? manifest.minAppVersion : "";
const packageName = typeof pkg.name === "string" ? pkg.name : "";

if (!/^[a-z0-9-]+$/.test(id)) {
  throw new Error("manifest.json id should be lowercase alphanumeric with dashes");
}

if (id.includes("obsidian")) {
  throw new Error("manifest.json id must not contain 'obsidian' for community-plugin submission");
}

if (packageName !== id) {
  throw new Error(`package.json name (${packageName || "<missing>"}) must match manifest.json id (${id})`);
}

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error("manifest.json version should be semver (x.y.z)");
}

if (!/^\d+\.\d+\.\d+$/.test(minAppVersion)) {
  throw new Error("manifest.json minAppVersion should be semver (x.y.z)");
}

console.log("manifest.json validation OK");
