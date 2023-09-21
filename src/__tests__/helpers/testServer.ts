import { ApolloServer } from "@apollo/server";
import RedisMemoryServer from "redis-memory-server";
import { CacheService } from "../../utils/redisService";
import { MockUserContext } from "../mock/mockContext";
import { Modules } from "../../modules";
import { testDB } from "./testDB";
export default class TestApolloServer {
  constructor(
    public readonly apollo = new ApolloServer<MockUserContext>({
      schema: Modules.schemas,
    }),
  ) {}

  async start() {
    await testDB.connectDB();
    await this.apollo.start();
  }

  async stop() {
    await this.apollo.stop();
  }

  async getCacheService(): Promise<CacheService> {
    const redisServer = new RedisMemoryServer();
    const redis_port = await redisServer.getPort();

    const redis_host = await redisServer.getHost();
    return CacheService.start({ redis_host, redis_port });
  }
}
