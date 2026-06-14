const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

module.exports = createJestConfig({
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterFramework: ["@testing-library/jest-dom"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testPathPattern: ["src/**/*.test.{js,jsx}"],
  collectCoverageFrom: ["src/**/*.{js,jsx}", "!src/app/layout.js"],
});
