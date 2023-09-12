"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apollo_datasource_mongodb_1 = require("apollo-datasource-mongodb");
const user_1 = tslib_1.__importDefault(require("../../models/user"));
const validation_1 = require("../../middleware/validation");
const ioredis_1 = tslib_1.__importDefault(require("ioredis"));
const users_model_1 = tslib_1.__importDefault(require("../users/users.model"));
class PostDataSource extends apollo_datasource_mongodb_1.MongoDataSource {
    async viewPost(args) {
        if (!args) {
            throw new Error("No input");
        }
        const redis = new ioredis_1.default({ port: 8080 });
        // Sample data to be stored in Redis
        const sampleData = [
            {
                id: 1,
                name: "Austin",
            },
            {
                id: 2,
                name: "Ameen",
            },
            {
                id: 3,
                name: "Aravind",
            },
        ];
        let dataStore = await redis.get("mydata").then((res) => {
            return res;
        });
        // const dataCheck = await redis.hget("id", "id", (err, result) => {
        //   if (err) {
        //     console.log(err);
        //   }
        //   return result;
        // });
        // console.log("result:", dataCheck);
        if (dataStore) {
            console.log("get:", dataStore);
        }
        if (!dataStore) {
            dataStore = await redis.set("mydata", JSON.stringify(sampleData));
            console.log("set:", dataStore);
        }
        const post = await this.model.findById(args);
        if (!post) {
            throw new Error("Post not Found");
        }
        const formattedPost = {
            ...post.toObject(),
            _id: post._id.toString(),
            createdAt: post.createdAt.toString(),
            updatedAt: post.updatedAt.toString(),
        };
        return formattedPost;
    }
    async viewPostsbyUserID(args) {
        const user = await users_model_1.default.findById(args.userID);
        if (!user) {
            throw new Error('No User found');
        }
        console.log(args);
        const posts = await this.model.find({ creator: args.userID })
            .skip(args.skip || 0)
            .sort({ createdAt: (args.filter || 0) })
            .limit(args.limit);
        if (!posts) {
            return "No Posts Available";
        }
        console.log(posts);
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
                    query: `{\"title\":{$eq:\`${args.search}\`}}`,
                    path: {
                        wildcard: "*"
                    }
                }
            }
        });
        pipeline.push({ $sort: { ...({ updatedDate: args.sort || -1 }) } }, { $skip: args.offset || 0 }, { $limit: args.limit || 10 });
        const postSearch = await this.model.aggregate(pipeline);
        if (!postSearch) {
            return "No Posts Available";
        }
        console.log(postSearch);
        const formattedPost = postSearch.map((post) => {
            return { ...post._doc, title: post.title.toString() };
        });
        return formattedPost;
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
        return formattedPost;
    }
}
exports.default = PostDataSource;
//# sourceMappingURL=posts.datasource.js.map