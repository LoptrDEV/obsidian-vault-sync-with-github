import { describe, expect, it, vi } from "vitest";
import { ConflictActionRunner } from "../src/core/conflict-action-runner";
import type { ConflictRecord, SyncConfig } from "../src/types/sync-types";
import { FakeApp, FakeVault } from "./helpers/fake-obsidian";

const makeConfig = (): SyncConfig => ({
  token: "t",
  owner: "o",
  repo: "r",
  branch: "main",
  rootPath: "",
  repoScopeMode: "fullRepo",
  repoSubfolder: "",
  ignorePatterns: [],
  conflictPolicy: "keepBoth",
});

describe("ConflictActionRunner", () => {
  it("creates merged text conflict artifacts for markdown keepBoth conflicts", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));

    const vault = new FakeVault();
    await vault.createBinary("note.md", new TextEncoder().encode("local text"));
    const app = new FakeApp(vault);
    const client = {
      getFile: vi.fn().mockResolvedValue({
        content: Buffer.from("remote text").toString("base64"),
        sha: "sha-1",
      }),
      putFile: vi.fn(),
      deleteFile: vi.fn(),
    };

    const runner = new ConflictActionRunner(app as any, client as any);
    const record: ConflictRecord = {
      path: "note.md",
      type: "modify-modify",
      reason: "modify-modify",
      policy: "manual",
      timestamp: new Date().toISOString(),
    };

    await runner.resolve(record, "keepBoth", makeConfig());

    const conflictPath = Array.from(vault.files.keys()).find(
      (path) => path !== "note.md" && path.includes("conflict-manual")
    );
    expect(conflictPath).toBeDefined();
    const conflictFile = vault.getAbstractFileByPath(conflictPath ?? "");
    const content = conflictFile ? await vault.readBinary(conflictFile as any) : new Uint8Array();
    const text = new TextDecoder().decode(content);
    expect(text).toContain("<<<<<<< LOCAL");
    expect(text).toContain("local text");
    expect(text).toContain("remote text");

    vi.useRealTimers();
  });

  it("keeps shared prefix and suffix outside the conflict block for text artifacts", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));

    const vault = new FakeVault();
    await vault.createBinary(
      "note.md",
      new TextEncoder().encode(["title", "local body", "shared end"].join("\n"))
    );
    const app = new FakeApp(vault);
    const client = {
      getFile: vi.fn().mockResolvedValue({
        content: Buffer.from(["title", "remote body", "shared end"].join("\n")).toString("base64"),
        sha: "sha-2",
      }),
      putFile: vi.fn(),
      deleteFile: vi.fn(),
    };

    const runner = new ConflictActionRunner(app as any, client as any);
    const record: ConflictRecord = {
      path: "note.md",
      type: "modify-modify",
      reason: "modify-modify",
      policy: "manual",
      timestamp: new Date().toISOString(),
    };

    await runner.resolve(record, "keepBoth", makeConfig());

    const conflictPath = Array.from(vault.files.keys()).find(
      (path) => path !== "note.md" && path.includes("conflict-manual")
    );
    const conflictFile = vault.getAbstractFileByPath(conflictPath ?? "");
    const content = conflictFile ? await vault.readBinary(conflictFile as any) : new Uint8Array();
    const text = new TextDecoder().decode(content);
    expect(text).toContain("title\n<<<<<<< LOCAL\nlocal body\n=======\nremote body\n>>>>>>> REMOTE\nshared end");

    vi.useRealTimers();
  });
});
