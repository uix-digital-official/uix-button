import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    lib: {
      entry: {
        index: "src/index.ts",
        react: "src/react.tsx",
        vue: "src/vue.ts",
        angular: "src/angular.ts",
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "vue",
      ],
      output: {
        exports: "named",
        // Rollup strips module-level directives, so re-add "use client"
        // to the React entry for Next.js App Router compatibility.
        banner: (chunk) => (chunk.name === "react" ? '"use client";' : ""),
      },
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
    sourcemap: true,
    minify: "esbuild",
  },
});
