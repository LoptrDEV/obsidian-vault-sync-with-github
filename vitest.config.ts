import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      obsidian: resolve(import.meta.dirname, "node_modules/obsidian/obsidian.d.ts"),
    },
  },
});
