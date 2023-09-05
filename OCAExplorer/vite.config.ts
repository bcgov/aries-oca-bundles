import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/aries-oca-explorer/",
  resolve: {
    alias: {
      "react-native": path.join(
        __dirname,
        "node_modules",
        "react-native-web",
        "dist"
      ),
      "@digitalbazaar/security-context": path.join(
        __dirname,
        "node_modules",
        "@digitalbazaar",
        "security-context",
        "dist",
        "context.js"
      ),
    },
  },
  // This is only required for serving packages from the aries-bifold submodule
  server: {
    fs: {
      allow: [".."],
    },
  },
});
