import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs", "iife"],
  globalName: "typsy",
  outExtension({ format }) {
    if (format === "cjs") return { js: ".cjs" };
    if (format === "iife") return { js: ".global.js" };
    return { js: ".js" };
  },
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: "es2018",
  treeshake: true,
});
