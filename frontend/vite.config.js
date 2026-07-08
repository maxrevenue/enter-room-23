import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
    watch: {
      // The Fable compiler emits .fs.js files into /build — make sure Vite picks them up
      ignored: ["**/obj/**", "**/bin/**"],
    },
  },
  build: {
    outDir: "dist",
  },
  clearScreen: false,
});
