"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import { TestDB } from "../../../__tests__/helpers/testDB";
const testServer_1 = tslib_1.__importDefault(
  require("../../../__tests__/helpers/testServer"),
);
// import Server from "../../../__tests__/helpers/testServer";
// import { loginAdmin } from "./login.test.helper";
// import { UserSeed } from "./seed";
describe("Authentication module", () => {
  it("hello", () => {
    const result = 4;
    expect(result).toBeLessThanOrEqual(4);
  });
  const server = new testServer_1.default();
  beforeAll(async () => {
    await server.start();
  });
  // afterAll(async () => {
  // 	await testDB.dropCollections();
  // 	await server.stop();
  // });
  // it("positive - QUERY: LOGIN ADMIN", async () => {
  // 	await loginAdmin(server);
  // }, 30000); // Increase the test timeout if necessary
});
//# sourceMappingURL=auth.spec.js.map
