"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserDataCachedInRedis = exports.isPostDataCachedInRedis = exports.isUsersCachedInRedis = exports.isPostsCachedInRedis = void 0;
const tslib_1 = require("tslib");
const posts_model_1 = tslib_1.__importDefault(require("../../modules/posts/posts.model"));
const users_model_1 = tslib_1.__importDefault(require("../../modules/users/users.model"));
const CustomUtils_1 = require("../../utils/CustomUtils");
const isPostsCachedInRedis = () => (next) => async (root, args, context, info) => {
    try {
        const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
        const dataStore = await context.redisClient.client.HGET('postsSearch', encodedJSON);
        if (!dataStore) {
            return next(root, args, context, info);
        }
        console.log('redis');
        let data = JSON.parse(dataStore);
        const arrayPosts = Object.values(data);
        const formattedPost = arrayPosts.map((post) => {
            post = posts_model_1.default.hydrate(post);
            return { ...post._doc };
        });
        return formattedPost;
    }
    catch (error) {
        throw error;
    }
};
exports.isPostsCachedInRedis = isPostsCachedInRedis;
const isUsersCachedInRedis = () => (next) => async (root, args, context, info) => {
    try {
        const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
        const dataStore = await context.redisClient.client.HGET('usersSearch', encodedJSON);
        console.log(context.deviceClient);
        if (!dataStore) {
            return next(root, args, context, info);
        }
        console.log('redis');
        let data = JSON.parse(dataStore);
        const arrayUsers = Object.values(data);
        const formattedUser = arrayUsers.map((user) => {
            user = users_model_1.default.hydrate(user);
            return { ...user._doc };
        });
        return formattedUser;
    }
    catch (error) {
        throw error;
    }
};
exports.isUsersCachedInRedis = isUsersCachedInRedis;
const isPostDataCachedInRedis = () => (next) => async (root, args, context, info) => {
    try {
        const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
        const dataStore = await context.redisClient.client.HGET('posts', encodedJSON);
        if (!dataStore) {
            return next(root, args, context, info);
        }
        console.log('redis');
        let data = JSON.parse(dataStore);
        const arrayPosts = Object.values(data);
        const formattedPost = arrayPosts.map((post) => {
            post = posts_model_1.default.hydrate(post);
            return { ...post._doc };
        });
        return formattedPost;
    }
    catch (error) {
        throw error;
    }
};
exports.isPostDataCachedInRedis = isPostDataCachedInRedis;
const isUserDataCachedInRedis = () => (next) => async (root, args, context, info) => {
    try {
        const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
        const dataStore = await context.redisClient.client.HGET('users', encodedJSON);
        if (!dataStore) {
            return next(root, args, context, info);
        }
        console.log('redis');
        let data = JSON.parse(dataStore);
        const arrayPosts = Object.values(data);
        const formattedPost = arrayPosts.map((post) => {
            post = posts_model_1.default.hydrate(post);
            return { ...post._doc };
        });
        return formattedPost;
    }
    catch (error) {
        throw error;
    }
};
exports.isUserDataCachedInRedis = isUserDataCachedInRedis;
//# sourceMappingURL=redisCache.js.map