/**
 * Persisted user-facing sync settings. Auth tokens and other volatile state
 * are intentionally stored elsewhere so settings remain safe to rewrite.
 */
export type PluginSettings = {
  owner: string;
  repo: string;
  branch: string;
  rootPath: string;
  repoScopeMode: "fullRepo" | "subfolder";
  repoSubfolder: string;
  ignorePatterns: string[];
  conflictPolicy: "preferLocal" | "preferRemote" | "keepBoth" | "manual";
  syncIntervalMinutes: number | null;
  maxFileSizeMB: number;
};

/**
 * Default sync settings for new installations and for missing legacy fields.
 */
export const DEFAULT_SETTINGS: PluginSettings = {
  owner: "",
  repo: "",
  branch: "main",
  rootPath: "",
  repoScopeMode: "fullRepo",
  repoSubfolder: "vault",
  ignorePatterns: [".git/"],
  conflictPolicy: "keepBoth",
  syncIntervalMinutes: null,
  maxFileSizeMB: 50, // GitHub API limit is 100MB, use 50MB as safe default
};

const GITHUB_API_MAX_FILE_SIZE_MB = 100;

/**
 * Returns the settings payload that is safe to persist back into plugin data.
 * This intentionally excludes auth/session state, previews, logs, and baseline
 * data because those live in separate storage surfaces.
 */
export const sanitizeSettingsForPersistence = (
  settings: PluginSettings
): PluginSettings => ({
  owner: settings.owner.trim(),
  repo: settings.repo.trim(),
  branch: settings.branch.trim() || DEFAULT_SETTINGS.branch,
  rootPath: settings.rootPath.trim(),
  repoScopeMode: isRepoScopeMode(settings.repoScopeMode)
    ? settings.repoScopeMode
    : DEFAULT_SETTINGS.repoScopeMode,
  repoSubfolder: settings.repoSubfolder.trim(),
  ignorePatterns: settings.ignorePatterns
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry, index, array) => entry.length > 0 && array.indexOf(entry) === index),
  conflictPolicy: isConflictPolicy(settings.conflictPolicy)
    ? settings.conflictPolicy
    : DEFAULT_SETTINGS.conflictPolicy,
  syncIntervalMinutes: normalizeSyncIntervalMinutes(settings.syncIntervalMinutes),
  maxFileSizeMB: normalizeMaxFileSizeMB(settings.maxFileSizeMB),
});

const isRepoScopeMode = (value: unknown): value is PluginSettings["repoScopeMode"] =>
  value === "fullRepo" || value === "subfolder";

const isConflictPolicy = (value: unknown): value is PluginSettings["conflictPolicy"] =>
  value === "preferLocal" || value === "preferRemote" || value === "keepBoth" || value === "manual";

export const normalizeSyncIntervalMinutes = (value: unknown): number | null => {
  if (value === null) {
    return null;
  }

  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return DEFAULT_SETTINGS.syncIntervalMinutes;
  }

  return value;
};

export const normalizeMaxFileSizeMB = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return DEFAULT_SETTINGS.maxFileSizeMB;
  }

  return Math.min(value, GITHUB_API_MAX_FILE_SIZE_MB);
};

/**
 * Extracts the supported settings shape from raw plugin storage while keeping
 * backwards compatibility with older PAT-era payloads.
 */
export const extractPluginSettings = (data: unknown): PluginSettings | undefined => {
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const obj = data as Record<string, unknown>;
  const hasSettings =
    "owner" in obj ||
    "repo" in obj ||
    "branch" in obj ||
    "rootPath" in obj ||
    "repoScopeMode" in obj ||
    "repoSubfolder" in obj ||
    "ignorePatterns" in obj ||
    "conflictPolicy" in obj ||
    "syncIntervalMinutes" in obj ||
    "maxFileSizeMB" in obj ||
    // Accept legacy auth fields so older plugin data still loads current defaults.
    "authMode" in obj ||
    "token" in obj ||
    "persistToken" in obj ||
    "githubAppClientId" in obj ||
    "githubAppInstallUrl" in obj;

  if (!hasSettings) {
    return undefined;
  }

  return {
    owner: typeof obj.owner === "string" ? obj.owner.trim() : DEFAULT_SETTINGS.owner,
    repo: typeof obj.repo === "string" ? obj.repo.trim() : DEFAULT_SETTINGS.repo,
    branch:
      typeof obj.branch === "string" ? obj.branch.trim() || DEFAULT_SETTINGS.branch : DEFAULT_SETTINGS.branch,
    rootPath: typeof obj.rootPath === "string" ? obj.rootPath.trim() : DEFAULT_SETTINGS.rootPath,
    repoScopeMode: isRepoScopeMode(obj.repoScopeMode) ? obj.repoScopeMode : DEFAULT_SETTINGS.repoScopeMode,
    repoSubfolder:
      typeof obj.repoSubfolder === "string" ? obj.repoSubfolder.trim() : DEFAULT_SETTINGS.repoSubfolder,
    ignorePatterns: Array.isArray(obj.ignorePatterns)
      ? obj.ignorePatterns
          .filter((entry): entry is string => typeof entry === "string")
          .map((entry) => entry.trim())
          .filter((entry, index, array) => entry.length > 0 && array.indexOf(entry) === index)
      : DEFAULT_SETTINGS.ignorePatterns,
    conflictPolicy: isConflictPolicy(obj.conflictPolicy) ? obj.conflictPolicy : DEFAULT_SETTINGS.conflictPolicy,
    syncIntervalMinutes: normalizeSyncIntervalMinutes(obj.syncIntervalMinutes),
    maxFileSizeMB: normalizeMaxFileSizeMB(obj.maxFileSizeMB),
  };
};
