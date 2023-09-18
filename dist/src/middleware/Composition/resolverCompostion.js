"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postComposedResolvers = exports.userComposedResolvers = void 0;
const tslib_1 = require("tslib");
const resolvers_composition_1 = require("@graphql-tools/resolvers-composition");
// Import your authentication functions
const auth_1 = require("../Authentication/auth");
const users_resolver_1 = tslib_1.__importDefault(require("../../modules/users/users.resolver"));
const posts_resolver_1 = tslib_1.__importDefault(require("../../modules/posts/posts.resolver"));
const redisCache_1 = require("../Cache/redisCache");
// Define your resolvers composition
const userResolversComposition = {
    Query: {
        viewUserById: [(0, auth_1.isAuthenticated)(), (0, redisCache_1.isUserDataCachedInRedis)()],
        users: [(0, redisCache_1.isUsersCachedInRedis)()],
        user: [(0, redisCache_1.isUsersCachedInRedis)()]
    },
    Mutation: {
        updateUser: [(0, auth_1.isAuthenticated)()],
        deleteUser: [(0, auth_1.isAuthenticated)()]
    }
};
const postResolversComposition = {
    Query: {
        viewPost: [(0, auth_1.isAuthenticated)(), (0, redisCache_1.isPostDataCachedInRedis)()],
        posts: [(0, redisCache_1.isPostsCachedInRedis)()],
        post: [(0, redisCache_1.isPostsCachedInRedis)()]
    },
    Mutation: {
        createPost: [(0, auth_1.isAuthenticated)(), (0, auth_1.isAdmin)()],
        updatePost: [(0, auth_1.isAuthenticated)()],
        deletePost: [(0, auth_1.isAuthenticated)()],
    }
};
// Compose your resolvers
const userComposedResolvers = (0, resolvers_composition_1.composeResolvers)(users_resolver_1.default, userResolversComposition);
exports.userComposedResolvers = userComposedResolvers;
const postComposedResolvers = (0, resolvers_composition_1.composeResolvers)(posts_resolver_1.default, postResolversComposition);
exports.postComposedResolvers = postComposedResolvers;
//# sourceMappingURL=resolverCompostion.js.map