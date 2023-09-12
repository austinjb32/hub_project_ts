"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const comment_1 = tslib_1.__importDefault(require("../../models/comment"));
const like_1 = tslib_1.__importDefault(require("../../models/like"));
exports.default = {
    Query: {
        viewPost: async (_, args, context) => {
            // Call the getUserById method of the UserDataSource
            return context.dataSource.postModelDataSource.viewPost(args.postID);
        },
        viewPostsbyUserID: async (_, args, context) => {
            if (args.search) {
                return context.dataSource.postModelDataSource.viewPostsWithSearch(args);
            }
            else {
                return context.dataSource.postModelDataSource.viewPostsbyUserID(args);
            }
        }
    },
    Mutation: {
        createPost: async (_, args, context) => {
            // Call the createUser method of the UserDataSource.
            return context.dataSource.postModelDataSource.createPost(args.postInput, context);
        },
    },
    Post: {
        likesCount: async (parent, args, context) => {
            // You can now use userId in your resolver logic to fetch data
            const LikeCount = like_1.default.count({
                typeID: parent._id, // Use userId here
            });
            return LikeCount;
        },
        commentCount: async (parent, args, context) => {
            // You can now use userId in your resolver logic to fetch data
            const commentCount = comment_1.default.count({
                post: parent._id, // Use userId here
            });
            return commentCount;
        },
        isLiked: async (parent, args, context) => {
            // You can now use userId in your resolver logic to fetch data
            const userPost = await like_1.default.findOne({
                $and: [{ user: String(context.userId) }, { typeID: parent._id }, { type: 'Post' }]
            });
            if (!userPost) {
                return false;
            }
            return true;
        },
    }
};
//# sourceMappingURL=posts.resolver.js.map