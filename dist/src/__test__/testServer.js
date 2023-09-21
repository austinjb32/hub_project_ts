"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const server_1 = require("@apollo/server");
const redis_memory_server_1 = tslib_1.__importDefault(
  require("redis-memory-server"),
);
const redisService_1 = require("../utils/redisService");
const modules_1 = require("../modules");
const testDB_1 = require("./testDB");
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
    await testDB_1.testDB.connectDB();
    await this.apollo.start();
  }
  async stop() {
    await this.apollo.stop();
  }
  async getCacheService() {
    const redisServer = new redis_memory_server_1.default();
    const redis_port = await redisServer.getPort();
    const redis_host = await redisServer.getHost();
    return redisService_1.CacheService.start({ redis_host, redis_port });
  }
}
exports.default = TestApolloServer;
//# sourceMappingURL=testServer.js.map
