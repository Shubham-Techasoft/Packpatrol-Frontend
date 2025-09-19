// start.js
import { exec } from "child_process";
import os from "os";

const isLinux = os.platform() === "linux";

const command = isLinux
  ? "NODE_OPTIONS='--max-old-space-size=4096' CHOKIDAR_USEPOLLING=true CHOKIDAR_INTERVAL=500 vite"
  : "vite";

const child = exec(command);

child.stdout.on("data", (data) => process.stdout.write(data));
child.stderr.on("data", (data) => process.stderr.write(data));
child.on("close", (code) => console.log(`Process exited with code ${code}`));