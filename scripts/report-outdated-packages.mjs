import { spawnSync } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npmCommand, ["outdated"], {
  encoding: "utf8",
  shell: process.platform === "win32",
});

if (result.stdout) {
  process.stdout.write(result.stdout);
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
