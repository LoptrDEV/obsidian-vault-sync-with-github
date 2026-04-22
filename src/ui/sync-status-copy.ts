import type { SyncDiagnosticEntry, SyncHealthState, SyncPreview } from "../types/sync-types";

export const describeSyncDiagnostic = (entry: SyncDiagnosticEntry): string => {
  switch (entry.code) {
    case "local_scan_blocked":
      return `Blocked local files: ${entry.message}`;
    case "retry_replanned":
      return `Remote changed during sync: ${entry.message}`;
    case "interrupted_sync_recovered":
      return `Recovered interrupted sync: ${entry.message}`;
    case "remote_history_rewritten":
      return `Remote history changed: ${entry.message}`;
    case "remote_compare_failed":
      return `Remote compare fallback: ${entry.message}`;
    case "remote_compare_paged":
    case "remote_compare_file_cap":
      return `Incremental compare fallback: ${entry.message}`;
    case "remote_tree_truncated":
    case "remote_tree_truncated_walk":
      return `Remote tree fallback: ${entry.message}`;
    case "mass_remote_delete_conflict":
      return `Remote delete safety: ${entry.message}`;
    case "mass_delete_approval_required":
      return `Approval required: ${entry.message}`;
    case "preview_generated":
      return `Preview generated: ${entry.message}`;
    case "baseline_repaired":
      return `Baseline repaired: ${entry.message}`;
    default:
      return `[${entry.level}] ${entry.message}`;
  }
};

export const buildPreviewGuidance = (preview: SyncPreview): string[] => {
  const guidance: string[] = [];

  if (preview.approval.required) {
    guidance.push("Review the delete set carefully before approving this sync.");
  }
  if (preview.diagnostics.some((entry) => entry.code === "local_scan_blocked")) {
    guidance.push("Blocked local files were deferred and will sync only after they become scannable again.");
  }
  if (preview.diagnostics.some((entry) => entry.code === "retry_replanned")) {
    guidance.push("The branch changed during an earlier attempt; this preview already reflects the rebuilt plan.");
  }
  if (preview.diagnostics.some((entry) => entry.code === "remote_history_rewritten")) {
    guidance.push("The remote branch was likely force-pushed or reset, so the plugin rebuilt its remote view from scratch.");
  }
  if (preview.summary.conflictCount > 0) {
    guidance.push("Resolve remaining conflicts before expecting the next sync to become fully quiet.");
  }

  return guidance;
};

export const buildHealthSummary = (health: SyncHealthState): string[] => {
  const summary = [
    `Last result: ${health.lastResult}`,
    `Attempts in last run: ${health.lastAttemptCount ?? 1}`,
    `Blocked local paths: ${health.blockedPathCount ?? 0}`,
  ];

  if (health.interruptedRecovery) {
    summary.push("Interrupted session recovery was used before the last run completed.");
  }
  if (health.pendingSessionStage) {
    summary.push(`A sync session is still marked in stage: ${health.pendingSessionStage}.`);
  }

  return summary;
};
