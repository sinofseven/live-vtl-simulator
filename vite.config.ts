import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import ViteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteTsconfigPaths()],
  server: {
    port: 9999,
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
});
