import { testDB } from "../../../__tests__/helpers/testDB";
import TestApolloServer from "../../../__tests__/helpers/testServer";
import { loginAdmin } from "./login.test.helper";
import { UserSeed } from "./seed";

describe("Authentication module", () => {
  it("hello", () => {
    const result = 4;
    expect(result).toBeLessThanOrEqual(4);
  });

  const server = new TestApolloServer();

  beforeAll(async () => {
    await server.start();
    await UserSeed.seedAdmin();
  });

  // afterAll(async () => {
  // 	await testDB.dropCollections();
  // 	await server.stop();
  // });

  // it("positive - QUERY: LOGIN ADMIN", async () => {
  // 	await loginAdmin(server);
  // }, 30000); // Increase the test timeout if necessary
});
