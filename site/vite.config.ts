import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// Preact runs the same React code at a fraction of the size: react and react-dom are aliased to preact/compat.
export default defineConfig({
  plugins: [preact()],
  server: { port: 5180, fs: { allow: [".."] } }, // the mini tools' formula files live in ../mini-tools
  build: { target: "es2020", modulePreload: { polyfill: false }, cssCodeSplit: true },
});
