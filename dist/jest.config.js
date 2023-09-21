"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  verbose: true,
  automock: true,
  testMatch: ["**/**/*.spec.js"],
  rootDir: "./dist",
  setupFiles: ["dotenv/config"],
  collectCoverage: true,
  moduleFileExtensions: ["ts", "js"],
  coverageDirectory: "coverage",
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map
