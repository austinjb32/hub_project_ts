"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostLoader = void 0;
const tslib_1 = require("tslib");
const dataloader_1 = tslib_1.__importDefault(require("dataloader"));
const posts_model_1 = tslib_1.__importDefault(require("./posts.model"));
// Define a function to fetch posts by an array of user IDs
const getPostsByUserId = async (userId) => {
    const posts = await posts_model_1.default.find({ creator: userId });
    return posts;
};
const getPostLoader = () => new dataloader_1.default(async (userIds) => {
    // Since you have only one user, you can fetch posts for that user
    const userPosts = await getPostsByUserId(userIds[0]);
    // Return the posts directly as an array
    return [userPosts];
});
exports.getPostLoader = getPostLoader;
//# sourceMappingURL=posts.dataLoaders.js.map