/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { isEmpty } from "lodash";
import { createClient, RedisClientType } from "redis";

type CacheServiceSettings = {
  redis_host: string;
  redis_port: number;
};

export class CacheService {
  public client!: RedisClientType;

  constructor(private readonly settings: CacheServiceSettings) {}

  static async start(settings: CacheServiceSettings) {
    const service = new CacheService(settings);
    await service.connectRedis();
    return service;
  }

  private async connectRedis() {
    try {
      this.client = createClient({
        socket: {
          host: this.settings.redis_host,
          port: this.settings.redis_port,
        },
        username: "default",
        password: "redispw",
      });

      await this.client.connect();
      console.log(
        `Cache: ${this.settings.redis_host}:${this.settings.redis_port} (connected)`,
      );
    } catch (err) {
      console.log("error Cache Connection: ", err);
    }
  }

  generateKey(items: string[]) {
    return items.join(":");
  }
  genGetOneQueryCacheKey(args: any) {
    return this.generateKey([JSON.stringify(args.filter)]);
  }

  genListQueryCacheKey(args: any) {
    return this.generateKey([
      JSON.stringify(args.filter),
      JSON.stringify(args.sort),
      args.search,
      `${args.offset}`,
      `${args.limit}`,
    ]);
  }

  async deleteByPrefix(prefix: string) {
    const keys: Promise<number>[] = [];
    const scanIterator = this.client.scanIterator({
      MATCH: `${prefix}*`,
      COUNT: 2000,
    });
    for await (const key of scanIterator) keys.push(this.client.del(key));
    return keys.length > 0 && (await Promise.all(keys));
  }

  async hDeleteCache(cacheKey: string) {
    const keys = await this.client?.hKeys(cacheKey);
    !isEmpty(keys) && (await this.client?.hDel(cacheKey, keys));
  }
}
