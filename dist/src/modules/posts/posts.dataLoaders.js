"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLoader = void 0;
const tslib_1 = require("tslib");
const dataloader_1 = tslib_1.__importDefault(require("dataloader"));
const posts_model_1 = tslib_1.__importDefault(require("./posts.model"));
exports.postLoader = new dataloader_1.default(async (ids) => {
    // Use `find` to retrieve posts by IDs
    const posts = await posts_model_1.default.find({ _id: { $in: ids } });
    // Ensure the order of posts matches the order of IDs
    const postMap = {};
    posts.forEach((post) => {
        postMap[post.id] = post;
    });
    // Map the IDs to posts, maintaining the order
    return ids.map((id) => postMap[id]);
});
//# sourceMappingURL=posts.dataLoaders.js.map