import type {
  LocalIndex,
  RemoteIndex,
  SyncBaseline,
  SyncOp,
} from "../types/sync-types";
import type { SyncPlanner } from "../types/interfaces";

export class DefaultSyncPlanner implements SyncPlanner {
  plan(
    local: LocalIndex,
    remote: RemoteIndex,
    baseline: SyncBaseline | null
  ): { ops: SyncOp[]; conflicts: SyncOp[] } {
    const ops: SyncOp[] = [];
    const conflicts: SyncOp[] = [];
    const baselineEntries = baseline?.entries ?? {};

    const renameLocal = this.detectLocalRenames(local, remote, baselineEntries);
    const renameRemote = this.detectRemoteRenames(local, remote, baselineEntries);

    const handledPaths = new Set<string>();

    for (const rename of renameLocal) {
      ops.push({ type: "rename_local", from: rename.from, to: rename.to });
      handledPaths.add(rename.from);
      handledPaths.add(rename.to);
    }

    for (const rename of renameRemote) {
      ops.push({ type: "rename_remote", from: rename.from, to: rename.to });
      handledPaths.add(rename.from);
      handledPaths.add(rename.to);
    }

    const allPaths = new Set<string>([
      ...Object.keys(local),
      ...Object.keys(remote),
      ...Object.keys(baselineEntries),
    ]);

    for (const path of allPaths) {
      if (handledPaths.has(path)) {
        continue;
      }

      const localEntry = local[path];
      const remoteEntry = remote[path];
      const baseEntry = baselineEntries[path];

      if (!baseEntry) {
        if (localEntry && !remoteEntry) {
          ops.push({ type: "push_new", path });
        } else if (!localEntry && remoteEntry) {
          ops.push({ type: "pull_new", path });
        } else if (localEntry && remoteEntry) {
          conflicts.push({ type: "conflict", path, reason: "modify-modify" });
        }
        continue;
      }

      if (localEntry && remoteEntry) {
        const localChanged = this.hasLocalChanged(localEntry, baseEntry);
        const remoteChanged = this.hasRemoteChanged(remoteEntry, baseEntry);

        if (localChanged && remoteChanged) {
          conflicts.push({ type: "conflict", path, reason: "modify-modify" });
        } else if (localChanged) {
          ops.push({ type: "push_update", path });
        } else if (remoteChanged) {
          ops.push({ type: "pull_update", path });
        }
        continue;
      }

      if (localEntry && !remoteEntry) {
        const baseHadRemote = Boolean(baseEntry.sha);
        const localChanged = this.hasLocalChanged(localEntry, baseEntry);
        if (!baseHadRemote) {
          if (localChanged) {
            ops.push({ type: "push_new", path });
          }
          continue;
        }

        if (localChanged) {
          conflicts.push({ type: "conflict", path, reason: "delete-modify-remote" });
        } else {
          ops.push({ type: "pull_delete", path });
        }
        continue;
      }

      if (!localEntry && remoteEntry) {
        const baseHadLocal = Boolean(baseEntry.hash);
        const remoteChanged = this.hasRemoteChanged(remoteEntry, baseEntry);
        if (!baseHadLocal) {
          if (remoteChanged) {
            ops.push({ type: "pull_new", path });
          }
          continue;
        }

        if (remoteChanged) {
          conflicts.push({ type: "conflict", path, reason: "delete-modify-local" });
        } else {
          ops.push({ type: "push_delete", path });
        }
      }
    }

    return { ops, conflicts };
  }

  private hasLocalChanged(
    localEntry: LocalIndex[string],
    baseEntry: SyncBaseline["entries"][string]
  ): boolean {
    if (baseEntry.hash && baseEntry.hash !== localEntry.hash) {
      return true;
    }

    if (baseEntry.mtime && baseEntry.mtime !== localEntry.mtime) {
      return true;
    }

    return false;
  }

  private hasRemoteChanged(
    remoteEntry: RemoteIndex[string],
    baseEntry: SyncBaseline["entries"][string]
  ): boolean {
    if (baseEntry.sha && baseEntry.sha !== remoteEntry.sha) {
      return true;
    }

    if (
      baseEntry.lastCommitTime &&
      baseEntry.lastCommitTime !== remoteEntry.lastCommitTime
    ) {
      return true;
    }

    return false;
  }

  private detectLocalRenames(
    local: LocalIndex,
    remote: RemoteIndex,
    baselineEntries: SyncBaseline["entries"]
  ): Array<{ from: string; to: string }> {
    const deleted: Array<{ path: string; hash: string }> = [];
    const added: Array<{ path: string; hash: string }> = [];

    // Find files that existed in baseline but not in local anymore
    for (const [path, entry] of Object.entries(baselineEntries)) {
      if (!local[path] && entry.hash) {
        // File was in baseline with a hash, but now gone from local
        // This could be a delete or rename (if remote still has it, it's likely a local rename)
        if (remote[path] && entry.sha === remote[path].sha) {
          // Remote still has the old file, so this is likely a local rename
          deleted.push({ path, hash: entry.hash });
        }
      }
    }

    // Find files that are new in local (not in baseline)
    for (const [path, entry] of Object.entries(local)) {
      if (!baselineEntries[path]) {
        // New file in local, could be added or renamed
        added.push({ path, hash: entry.hash });
      }
    }

    return this.matchRenamesByUniqueKey(deleted, added, (entry) => entry.hash);
  }

  private detectRemoteRenames(
    local: LocalIndex,
    remote: RemoteIndex,
    baselineEntries: SyncBaseline["entries"]
  ): Array<{ from: string; to: string }> {
    const deleted: Array<{ path: string; sha: string }> = [];
    const added: Array<{ path: string; sha: string }> = [];

    for (const [path, entry] of Object.entries(baselineEntries)) {
      if (!remote[path] && local[path] && entry.hash === local[path].hash && entry.sha) {
        deleted.push({ path, sha: entry.sha });
      }
    }

    for (const [path, entry] of Object.entries(remote)) {
      if (!baselineEntries[path] && !local[path]) {
        added.push({ path, sha: entry.sha });
      }
    }

    return this.matchRenamesByUniqueKey(deleted, added, (entry) => entry.sha);
  }

  private matchRenamesByUniqueKey<T extends { path: string }>(
    deleted: Array<T>,
    added: Array<T>,
    getKey: (entry: T) => string | undefined
  ): Array<{ from: string; to: string }> {
    const renames: Array<{ from: string; to: string }> = [];
    const deletedByKey = this.groupPathsByKey(deleted, getKey);
    const addedByKey = this.groupPathsByKey(added, getKey);

    for (const [key, deletedPaths] of deletedByKey.entries()) {
      const addedPaths = addedByKey.get(key);
      if (!addedPaths || deletedPaths.length !== 1 || addedPaths.length !== 1) {
        continue;
      }

      const from = deletedPaths[0];
      const to = addedPaths[0];
      if (!from || !to) {
        continue;
      }

      renames.push({ from, to });
    }

    return renames;
  }

  private groupPathsByKey<T extends { path: string }>(
    entries: Array<T>,
    getKey: (entry: T) => string | undefined
  ): Map<string, string[]> {
    const grouped = new Map<string, string[]>();

    for (const entry of entries) {
      const key = getKey(entry);
      if (!key) {
        continue;
      }

      const paths = grouped.get(key);
      if (paths) {
        paths.push(entry.path);
        continue;
      }

      grouped.set(key, [entry.path]);
    }

    return grouped;
  }
}
