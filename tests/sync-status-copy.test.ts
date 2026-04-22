import { describe, expect, it } from "vitest";
import {
  buildHealthSummary,
  buildPreviewGuidance,
  describeSyncDiagnostic,
} from "../src/ui/sync-status-copy";

describe("sync status copy helpers", () => {
  it("explains blocked-path diagnostics in user-facing language", () => {
    expect(
      describeSyncDiagnostic({
        code: "local_scan_blocked",
        level: "warn",
        message: "Skipped 2 blocked local path(s).",
      })
    ).toContain("Blocked local files");
  });

  it("offers targeted preview guidance for blocked files and retries", () => {
    const guidance = buildPreviewGuidance({
      generatedAt: new Date().toISOString(),
      owner: "o",
      repo: "r",
      branch: "main",
      rootPath: "",
      repoScopeMode: "fullRepo",
      repoSubfolder: "",
      summary: {
        localFileCount: 1,
        remoteFileCount: 1,
        baselineFileCount: 1,
        conflictCount: 0,
        counts: {
          pullNew: 0,
          pullUpdate: 0,
          pullDelete: 0,
          pushNew: 0,
          pushUpdate: 0,
          pushDelete: 0,
          renameLocal: 0,
          renameRemote: 0,
        },
      },
      diagnostics: [
        { code: "local_scan_blocked", level: "warn", message: "Blocked path." },
        { code: "retry_replanned", level: "warn", message: "Replanned once." },
      ],
      ops: [],
      conflicts: [],
      approval: {
        required: false,
        key: null,
        reason: null,
        pullDeleteCount: 0,
        deleteRatio: 0,
        thresholdRatio: 0.5,
      },
    });

    expect(guidance.join(" ")).toContain("deferred");
    expect(guidance.join(" ")).toContain("rebuilt plan");
  });

  it("summarizes interrupted recovery and pending session state", () => {
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
      blockedPathCount: 1,
      interruptedRecovery: true,
      pendingSessionStage: "saving",
    });

    expect(summary.join(" ")).toContain("Attempts");
    expect(summary.join(" ")).toContain("recovery");
    expect(summary.join(" ")).toContain("saving");
  });
});
