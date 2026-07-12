import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    // In CI the build is already done before this step; just start preview.
    // Locally, build first so there is always a fresh output to test against.
    command: process.env.CI
      ? "npm run preview"
      : "npm run build && npm run preview",
    port: 4173,
  },
  testMatch: "**/*.e2e.{ts,js}",
});
