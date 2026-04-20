import { spawnSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npmCommand, ["outdated"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});

if (result.stdout) {
  process.stdout.write(result.stdout);

  const notes = [];
  if (result.stdout.includes("@types/node")) {
    notes.push(
      "- @types/node is intentionally kept on the Node 24 LTS line; npm outdated compares against the latest current major.",
    );
  }
  if (result.stdout.includes("@eslint/js") || result.stdout.includes("eslint")) {
    notes.push(
      "- ESLint 10 is currently blocked by eslint-plugin-obsidianmd peer requirements (`eslint >=9 <10`, `@eslint/js ^9.30.1`).",
    );
  }

  if (notes.length > 0) {
    process.stdout.write(`\nPolicy notes:\n${notes.join("\n")}\n`);
  }
}

if (result.stderr) {
  process.stderr.write(result.stderr);
}

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

// npm exits with code 1 when updates are available. That is review input,
// not a failure for the maintenance procedure by itself.
if (result.status === 0 || result.status === 1) {
  if (!result.stdout.trim()) {
    console.log("All dependencies are within the declared update policy.");
  }
  process.exit(0);
}

process.exit(result.status ?? 1);
