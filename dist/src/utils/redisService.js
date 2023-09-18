"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
/* eslint-disable @typescript-eslint/restrict-template-expressions */
const lodash_1 = require("lodash");
const redis_1 = require("redis");
class CacheService {
    settings;
    client;
    constructor(settings) {
        this.settings = settings;
    }
    static async start(settings) {
        const service = new CacheService(settings);
        await service.connectRedis();
        return service;
    }
    async connectRedis() {
        try {
            this.client = (0, redis_1.createClient)({
                socket: {
                    host: this.settings.redis_host,
                    port: this.settings.redis_port,
                },
                username: "default",
                password: "redispw",
            });
            await this.client.connect();
            console.log(`Cache: ${this.settings.redis_host}:${this.settings.redis_port} (connected)`);
        }
        catch (err) {
            console.log("error Cache Connection: ", err);
        }
    }
    generateKey(items) {
        return items.join(":");
    }
    genGetOneQueryCacheKey(args) {
        return this.generateKey([JSON.stringify(args.filter)]);
    }
    genListQueryCacheKey(args) {
        return this.generateKey([
            JSON.stringify(args.filter),
            JSON.stringify(args.sort),
            args.search,
            `${args.offset}`,
            `${args.limit}`,
        ]);
    }
    async deleteByPrefix(prefix) {
        const keys = [];
        const scanIterator = this.client.scanIterator({
            MATCH: `${prefix}*`,
            COUNT: 2000,
        });
        for await (const key of scanIterator)
            keys.push(this.client.del(key));
        return keys.length > 0 && (await Promise.all(keys));
    }
    async hDeleteCache(cacheKey) {
        const keys = await this.client?.hKeys(cacheKey);
        !(0, lodash_1.isEmpty)(keys) && (await this.client?.hDel(cacheKey, keys));
    }
}
exports.CacheService = CacheService;
//# sourceMappingURL=redisService.js.map