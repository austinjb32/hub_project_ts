"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apollo_datasource_mongodb_1 = require("apollo-datasource-mongodb");
const user_1 = tslib_1.__importDefault(require("../../models/user"));
class PostDataSource extends apollo_datasource_mongodb_1.MongoDataSource {
    async viewPost(args) {
        if (!args) {
            throw new Error('No input');
        }
        const post = await this.model.findById(args);
        if (!post) {
            throw new Error('Post not Found');
        }
        const formattedPost = {
            ...post.toObject(),
            _id: post._id.toString(),
            createdAt: post.createdAt.toString(),
            updatedAt: post.updatedAt.toString(),
        };
        return formattedPost;
    }
    async createPost(postInput, context) {
        if (!postInput) {
            throw new Error('No input');
        }
        const creator = await user_1.default.findById(context.userId);
        console.log(context, "hello");
        if (!creator) {
            throw new Error('No Creator Found');
        }
        const newPost = new this.model({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl,
            creator: creator,
        });
        await newPost.save();
        const formattedPost = {
            ...newPost.toObject(),
            _id: newPost._id.toString(),
            createdAt: newPost.createdAt.toString(),
            updatedAt: newPost.updatedAt.toString(),
        };
        return formattedPost;
    }
}
exports.default = PostDataSource;
//# sourceMappingURL=posts.datasource.js.map