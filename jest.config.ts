import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
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
export default config;
