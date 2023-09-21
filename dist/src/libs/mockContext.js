"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockUserContext = void 0;
const redisService_1 = require("../utils/redisService");
const modules_1 = require("../modules");
const users_dataLoader_1 = require("../modules/users/users.dataLoader");
const posts_dataLoaders_1 = require("../modules/posts/posts.dataLoaders");
const mockUserContext = () => {
  return {
    dataSource: modules_1.Modules.dataSource,
    accessToken: "hello",
    userLoaders: (0, users_dataLoader_1.getUserLoader)(),
    postLoaders: (0, posts_dataLoaders_1.getPostLoader)(),
    postfromIDLoaders: (0, posts_dataLoaders_1.getPostFromUserIDLoader)(),
    redisClient: redisService_1.CacheService,
  };
};
exports.mockUserContext = mockUserContext;
//# sourceMappingURL=mockContext.js.map
