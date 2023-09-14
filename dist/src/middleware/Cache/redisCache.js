"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
exports.redisClient = (0, redis_1.createClient)({ url: "redis://localhost:8080/" });
function isInRedis() {
    return null;
}
exports.isInRedis = isInRedis;
//# sourceMappingURL=redisCache.js.map