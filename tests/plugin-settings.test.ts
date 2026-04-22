import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  extractPluginSettings,
  normalizeMaxFileSizeMB,
  normalizeSyncIntervalMinutes,
  sanitizeSettingsForPersistence,
} from "../src/types/plugin-settings";

describe("plugin settings", () => {
  it("persists settings without adding auth secrets to top-level settings", () => {
    const sanitized = sanitizeSettingsForPersistence({
      ...DEFAULT_SETTINGS,
    });

    expect(sanitized).toEqual(DEFAULT_SETTINGS);
  });

  it("extracts plugin settings without leaking unrelated state into settings", () => {
    const extracted = extractPluginSettings({
      owner: "tim",
      repo: "repo",
      auth: {
        provider: "githubApp",
      },
      baseline: {
        commitSha: "base",
      },
    });

    expect(extracted).toMatchObject({
      owner: "tim",
      repo: "repo",
    });
    expect(extracted).not.toHaveProperty("auth");
    expect(extracted).not.toHaveProperty("baseline");
  });

  it("ignores legacy auth fields that should no longer affect settings", () => {
    const extracted = extractPluginSettings({
      authMode: "pat",
      token: "legacy-token",
      persistToken: true,
      githubAppClientId: "custom-client-id",
      githubAppInstallUrl: "https://example.com/custom-install",
      owner: "tim",
    });

    expect(extracted).toMatchObject({
      owner: "tim",
      branch: DEFAULT_SETTINGS.branch,
      repoScopeMode: DEFAULT_SETTINGS.repoScopeMode,
    });
    expect(extracted).not.toHaveProperty("authMode");
    expect(extracted).not.toHaveProperty("token");
    expect(extracted).not.toHaveProperty("persistToken");
    expect(extracted).not.toHaveProperty("githubAppClientId");
    expect(extracted).not.toHaveProperty("githubAppInstallUrl");
  });

  it("normalizes invalid persisted numeric settings", () => {
    const extracted = extractPluginSettings({
      owner: " tim ",
      repo: " repo ",
      branch: "   ",
      syncIntervalMinutes: Number.NaN,
      maxFileSizeMB: -5,
      ignorePatterns: ["  .git/ ", "", ".git/", 123],
    });

    expect(extracted).toMatchObject({
      owner: "tim",
      repo: "repo",
      branch: DEFAULT_SETTINGS.branch,
      syncIntervalMinutes: null,
      maxFileSizeMB: DEFAULT_SETTINGS.maxFileSizeMB,
      ignorePatterns: [".git/"],
    });
  });

  it("sanitizes invalid numeric settings before persistence", () => {
    const sanitized = sanitizeSettingsForPersistence({
      ...DEFAULT_SETTINGS,
      owner: " tim ",
      repo: " repo ",
      branch: "   ",
      syncIntervalMinutes: -10,
      maxFileSizeMB: 500,
      ignorePatterns: ["  .git/ ", "", ".git/"],
    });

    expect(sanitized).toMatchObject({
      owner: "tim",
      repo: "repo",
      branch: DEFAULT_SETTINGS.branch,
      syncIntervalMinutes: null,
      maxFileSizeMB: 100,
      ignorePatterns: [".git/"],
    });
  });

  it("normalizes helper values for interval and max file size", () => {
    expect(normalizeSyncIntervalMinutes(Number.NaN)).toBeNull();
    expect(normalizeSyncIntervalMinutes(-1)).toBeNull();
    expect(normalizeSyncIntervalMinutes(15)).toBe(15);
    expect(normalizeMaxFileSizeMB(Number.NaN)).toBe(DEFAULT_SETTINGS.maxFileSizeMB);
    expect(normalizeMaxFileSizeMB(-1)).toBe(DEFAULT_SETTINGS.maxFileSizeMB);
    expect(normalizeMaxFileSizeMB(150)).toBe(100);
  });
});
