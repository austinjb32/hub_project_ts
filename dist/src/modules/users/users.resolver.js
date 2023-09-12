"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const relationship_1 = tslib_1.__importDefault(require("../../models/relationship"));
const activity_1 = tslib_1.__importDefault(require("../../models/activity"));
const userStatus_1 = tslib_1.__importDefault(require("../../models/userStatus"));
exports.default = {
    Query: {
        viewUser: async (_, args, context) => {
            // Access args.userID
            // Call the getUserById method of the UserDataSource
            return context.dataSource.userModelDataSource.viewUser(args.userID, context);
        },
        login: async (_, args, context) => {
            // Access args
            // Call the getUserById method of the UserDataSource
            return context.dataSource.userModelDataSource.login(args, context);
        },
        getUserById: async (_, args, context) => {
            return context.dataSource.userModelDataSource.getUserById(args.userId);
        }
    },
    Mutation: {
        createUser: async (_, args, context) => {
            // Access args.userInput
            const userInput = args.userInput;
            // Call the createUser method of the UserDataSource.
            return context.dataSource.userModelDataSource.createUser(userInput);
        },
    },
    User: {
        following: async (parent, args, context) => {
            // You can now use userId in your resolver logic to fetch data
            const followingCount = relationship_1.default.count({
                following: parent._id, // Use userId here
            });
            return followingCount;
        },
        followers: async (parent, args, _context) => {
            // You can now use userId in your resolver logic to fetch data
            const followerCount = relationship_1.default.count({
                user: parent._id, // Use userId here
            });
            return followerCount;
        },
        lastActivity: async (parent, args, context) => {
            // You can now use userId in your resolver logic to fetch data
            const latestActivity = await activity_1.default.findOne({
                userId: parent._id, // Replace 'userId' with the actual field name in your Activity model
            })
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest one
                .exec();
            return latestActivity?.track?.activity;
        },
        status: async (parent, args, context) => {
            // You can now use userId in your resolver logic to fetch data
            const lateststatus = await userStatus_1.default.findOne({
                userId: parent._id, // Replace 'userId' with the actual field name in your Activity model
            })
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest one
                .exec();
            return lateststatus?.status;
        },
        posts: async (parent, args, context) => {
            try {
                const posts = await context.postLoaders.load(parent._id);
                const transformedPosts = posts.map((post) => ({
                    ...post._doc,
                    _id: post._id.toString(),
                    shareCount: Number(post.shareCount),
                    creator: parent,
                }));
                return transformedPosts;
            }
            catch (err) {
                throw new Error(err);
            }
        }
    },
};
//# sourceMappingURL=users.resolver.js.map