"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
// import RedisMemoryServer from "redis-memory-server";
const modules_1 = require("../../modules");
class TestApolloServer {
  apollo;
  constructor(
    apollo = new server_1.ApolloServer({
      schema: modules_1.Modules.schemas,
    }),
  ) {
    this.apollo = apollo;
  }
  async start() {
    await this.apollo.start();
  }
  async stop() {
    await this.apollo.stop();
  }
}
exports.default = TestApolloServer;
//# sourceMappingURL=testServer.js.map
