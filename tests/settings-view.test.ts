import { describe, expect, it } from "vitest";
import { describeRepositoryLoadIssue } from "../src/ui/settings-view";
import { buildHealthSummary } from "../src/ui/sync-status-copy";

describe("settings view helpers", () => {
  it("surfaces reconnect guidance for auth-related repository list failures", () => {
    expect(
      describeRepositoryLoadIssue(
        new Error("GitHub App authentication must be reconnected.")
      )
    ).toContain("Reconnect");
  });

  it("keeps transient repository list failures distinct from no-access states", () => {
    expect(describeRepositoryLoadIssue(new Error("GitHub API error 503: unavailable"))).toBe(
      "GitHub did not return the repository list. Refresh the list and try again."
    );
  });

  it("summarizes new sync-health fields for the settings surface", () => {
    const summary = buildHealthSummary({
      updatedAt: new Date().toISOString(),
      lastAction: "sync",
      lastResult: "success",
      lastMessage: "Sync completed.",
      owner: "o",
      repo: "r",
      branch: "main",
      rootPath: "",
      repoScopeMode: "fullRepo",
      repoSubfolder: "",
      baselineEntryCount: 1,
      previewApprovalRequired: false,
      previewApprovalKey: null,
      authStatus: "connected",
      diagnostics: [],
      rateLimit: null,
      lastAttemptCount: 2,
      blockedPathCount: 3,
      pendingSessionStage: null,
    });

    expect(summary).toContain("Attempts in last run: 2");
    expect(summary).toContain("Blocked local paths: 3");
  });
});
