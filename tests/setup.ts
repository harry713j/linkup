import { afterAll, beforeAll, afterEach, beforeEach, vi } from "vitest";

// Global test setup
beforeAll(() => {
  console.log("Starting test suite...");
  // Set test environment variables
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
});

afterAll(() => {
  console.log("Test suite completed");
  // Cleanup after all tests
});

beforeEach(() => {
  // Runs BEFORE EACH individual test
  // Reset everything to a clean state

  // Clear all mocks
  vi.clearAllMocks();

  // Reset mock call counts
  vi.resetModules();

  // Clear any in-memory data
  // mockDatabase.clear();

  // Reset timers
  vi.clearAllTimers();
});

//   afterEach(() => {
//     // Runs AFTER EACH individual test
//     // Clean up any side effects from that test

//     // Close database connections created during test
//     // mockDatabase.disconnect();

//     // Delete temporary files
//     // fs.rmSync('./temp', { recursive: true });

//     // Stop any running timers
//     // vi.useRealTimers();

//     // Clear environment variables set in test
//     delete process.env.CUSTOM_VAR;
//   });

// Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
