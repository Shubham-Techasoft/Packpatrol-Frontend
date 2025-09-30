// start.js
import { spawn } from "child_process";
import os from "os";

const isLinux = os.platform() === "linux";

// Build the base command
const baseCommand = "vite";

// Add platform-specific env vars
const env = { ...process.env };
if (isLinux) {
  env.NODE_OPTIONS = "--max-old-space-size=4096";
  env.CHOKIDAR_USEPOLLING = "true";
  env.CHOKIDAR_INTERVAL = "500";
}

// Spawn the process
const child = spawn(baseCommand, process.argv.slice(2), {
  env,
  stdio: "inherit", // directly pipe logs to terminal
  shell: true,      // allow inline env vars on Windows too
});

// Handle exit
child.on("close", (code) => {
  console.log(`\n🛑 Vite process exited with code ${code}`);
});
