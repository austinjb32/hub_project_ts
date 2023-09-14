"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apollo_datasource_mongodb_1 = require("apollo-datasource-mongodb");
const user_1 = tslib_1.__importDefault(require("../../models/user"));
const users_model_1 = tslib_1.__importDefault(require("../users/users.model"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const validation_1 = require("../../middleware/Validation/validation");
class PostDataSource extends apollo_datasource_mongodb_1.MongoDataSource {
    async postById(args, context) {
        if (!args) {
            throw new Error("No input");
        }
        await context.redisClient.connect();
        let dataStore = await context.redisClient.HGET("post", `${args}`);
        if (!dataStore) {
            const post = await this.model.findById(args);
            if (!post) {
                throw new Error("Post not Found");
            }
            dataStore = await context.redisClient.HSET("post", `${args}`, JSON.stringify(post));
        }
        let post = JSON.parse(dataStore);
        context.redisClient.disconnect();
        const formattedPost = {
            ...post,
            _id: post._id,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        };
        return formattedPost;
    }
    async viewPostsbyUserID(args) {
        const user = await users_model_1.default.findById(args.userID);
        if (!user) {
            throw new Error("No User found");
        }
        const posts = await this.model
            .find({ ...args.filter })
            .skip(args.skip || 0)
            .sort(args.sort || 0)
            .limit(args.limit);
        if (!posts) {
            return "No Posts Available";
        }
        const formattedPost = posts.map((post) => {
            return { ...post._doc, title: post.title.toString() };
        });
        return formattedPost;
    }
    async viewPostsWithSearch(args) {
        let pipeline = [];
        pipeline.push({
            $search: {
                index: "searchPosts",
                text: {
                    query: args.search.trim() || "",
                    path: "title",
                    fuzzy: {
                        maxEdits: 2,
                    },
                },
            },
        });
        pipeline.push({ $sort: { ...(args.sort || { updatedDate: -1 }) } }, { $skip: args.offset || 0 }, { $limit: args.limit || 10 }, { $project: { title: 1, content: 1 } });
        const postSearch = await this.model.aggregate(pipeline);
        if (!postSearch) {
            return "No Posts Available";
        }
        const formattedPost = postSearch.map((post) => {
            return { ...post._doc, title: post.title.toString() };
        });
        return formattedPost;
    }
    async updatePost(userInput, context) {
        const postUpdateValidation = (0, validation_1.postUpdationValidation)(userInput);
        if (postUpdateValidation.error) {
            throw new Error(`${postUpdateValidation.error.name},${postUpdateValidation.error.message}`);
        }
        async function redisUpdateOperations() {
            await context.redisClient.HDEL("post", `${userInput.id}`);
            await context.redisClient.HSET("post", `${userInput}`, JSON.stringify(post));
            context.redisClient.disconnect();
        }
        const foundUser = await user_1.default.findById(context.userId);
        const post = await this.model.findById(userInput.id);
        // Check if the user is authorized to make the change
        if (foundUser._id.toString() !== post.creator.toString()) {
            throw new Error("You're not Authorized to make this Change");
        }
        // Create an object with the fields to be updated
        const editPost = {
            title: userInput.title.toLowerCase().trim(),
            content: userInput.content.toLowerCase().trim(),
            imageUrl: userInput.imageUrl.trim(),
        };
        // Use lodash to merge the changes into the post
        const updatedPost = lodash_1.default.merge(post, editPost);
        // Update and save the post
        Object.assign(post, updatedPost);
        await post.save();
        await redisUpdateOperations();
        return { ...updatedPost.toObject(), _id: updatedPost._id.toString() };
    }
    async createPost(postInput, context) {
        const postCreateValidation = (0, validation_1.postCreationValidation)(postInput);
        if (postCreateValidation.error) {
            throw new Error(`${postCreateValidation.error.name}${postCreateValidation.error.message}`);
        }
        const creator = await user_1.default.findById(context.userId);
        if (!creator) {
            throw new Error("No Creator Found");
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
        await context.redisClient.connect();
        await context.redisClient.HSET("post", `${formattedPost._id}`, JSON.stringify(formattedPost));
        return formattedPost;
    }
}
exports.default = PostDataSource;
//# sourceMappingURL=posts.datasource.js.map