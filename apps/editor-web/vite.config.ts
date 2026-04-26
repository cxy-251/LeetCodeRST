import path from "node:path";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  server: {
    port: 3100,
    fs: {
      allow: [path.resolve(__dirname, "../..")],
    },
  },
  resolve: {
    alias: {
      "@paper-to-video/shared-types": path.resolve(__dirname, "../../packages/shared-types/src/index.ts"),
      "@paper-to-video/content-pipeline": path.resolve(
        __dirname,
        "../../packages/content-pipeline/src/index.ts",
      ),
    },
  },
});
