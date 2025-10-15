import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.spec.ts"],
    // Exclude patterns
    exclude: ["node_modules", "dist"],
    coverage: {
      all: true,
      exclude: [
        "node_modules/",
        "tests/",
        "dist/",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/index.ts",
      ],
      reporter: ["text", "html", "json"],
    },
    // Reporters
    reporters: ["default", "html"],
    // Output file for HTML report
    outputFile: {
      html: "./coverage/test-report.html",
    },
  },
});
