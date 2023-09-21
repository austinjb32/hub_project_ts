import { ApolloServer } from "@apollo/server";
// import RedisMemoryServer from "redis-memory-server";
import { Modules } from "../../modules";
// import {TestDB} from "./testDB";
import { userContext } from "../../libs";
export default class TestApolloServer {
  constructor(
    public readonly apollo = new ApolloServer<userContext>({
      schema: Modules.schemas,
    }),
  ) {}

  async start() {
    await this.apollo.start();
  }

  async stop() {
    await this.apollo.stop();
  }

  // async getCacheService(): Promise<CacheService> {
  //   const redisServer = new RedisMemoryServer();
  //   const redis_port = await redisServer.getPort();

  //   const redis_host = await redisServer.getHost();
  //   return CacheService.start({ redis_host, redis_port });
  // }
}
