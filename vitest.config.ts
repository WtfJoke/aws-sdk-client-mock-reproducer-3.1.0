import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["aws-sdk-client-mock-jest"],
  },
});
