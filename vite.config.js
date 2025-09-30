// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Explicitly include these as importable assets
  assetsInclude: [
    "**/*.png", "**/*.PNG",
    "**/*.jpg", "**/*.jpeg",
    "**/*.bmp",
    "**/*.json"
  ],

  server: {
    watch: {
      // 🚫 Ignore everything inside /public (so Vite doesn’t watch thousands of files)
      ignored: ["**/public/**"],
    },
    fs: {
      strict: false, // allow serving files outside root if needed
    },
  },
});
