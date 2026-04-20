// @ts-check

import { existsSync } from "fs";
import { readFile } from "fs/promises";

/**
 * @template T
 * @param {string} path
 * @returns {Promise<T>}
 */
async function readJson(path) {
  return /** @type {T} */ (JSON.parse(await readFile(path, "utf8")));
}

/**
 * @param {unknown} repository
 * @returns {string}
 */
function extractGitHubRepoPath(repository) {
  /** @type {{ url?: unknown } | null} */
  const repositoryObject = typeof repository === "object" && repository !== null
    ? /** @type {{ url?: unknown }} */ (repository)
    : null;
  const raw = typeof repository === "string"
    ? repository
    : typeof repositoryObject?.url === "string"
      ? repositoryObject.url
      : "";

  const normalized = raw
    .replace(/^git\+/, "")
    .replace(/^git@github\.com:/, "https://github.com/")
    .replace(/\.git$/, "");
  const match = normalized.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)$/);
  return match ? match[1] : "";
}

const requiredFiles = ["README.md", "LICENSE", "manifest.json", "versions.json"];
const missingFiles = requiredFiles.filter((path) => !existsSync(path));
if (missingFiles.length > 0) {
  throw new Error(`Missing community-plugin submission files: ${missingFiles.join(", ")}`);
}

/** @type {{ id?: unknown, name?: unknown, author?: unknown, description?: unknown }} */
const manifest = await readJson("manifest.json");
/** @type {{ repository?: unknown }} */
const pkg = await readJson("package.json");

const id = typeof manifest.id === "string" ? manifest.id : "";
const name = typeof manifest.name === "string" ? manifest.name : "";
const author = typeof manifest.author === "string" ? manifest.author : "";
const description = typeof manifest.description === "string" ? manifest.description : "";
const repo = extractGitHubRepoPath(pkg.repository);

if (!id || !name || !author || !description) {
  throw new Error("manifest.json must include id, name, author, and description for community-plugin submission");
}

if (!repo) {
  throw new Error("package.json repository must point to a GitHub repository path for community-plugin submission");
}

const submissionEntry = {
  id,
  name,
  author,
  description,
  repo,
};

console.log("Community-plugin submission metadata OK");
console.log(JSON.stringify(submissionEntry, null, 2));
