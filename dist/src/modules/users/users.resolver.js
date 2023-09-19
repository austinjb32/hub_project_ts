"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const relationship_1 = tslib_1.__importDefault(require("../../models/relationship"));
const activity_1 = tslib_1.__importDefault(require("../../models/activity"));
const userStatus_1 = tslib_1.__importDefault(require("../../models/userStatus"));
exports.default = {
    Query: {
        user: async (_, args, context) => {
            // Access args.dataID
            if (args.search) {
                return context.dataSource.userModelDataSource.viewUserWithSearch(args, context);
            }
            return context.dataSource.userModelDataSource.viewUser(args, context);
        },
        users: async (_, args, context) => {
            if (args.search) {
                return context.dataSource.userModelDataSource.viewUsersWithSearch(args, context);
            }
            return context.dataSource.userModelDataSource.viewUsers(args, context);
        },
        viewUserById: async (_, args, context) => {
            return context.dataSource.userModelDataSource.viewUserById(args, context);
        },
        countUsers: async (_, args, context) => {
            if (args.search) {
                return context.dataSource.userModelDataSource.countUsersWithSearch(args, context);
            }
            return context.dataSource.userModelDataSource.countUsers(args, context);
        },
    },
    Mutation: {
        updateUser: async (_, { dataID, userInfoData }, context) => {
            // Access args.userInput
            // Call the createUser method of the UserDataSource.
            return context.dataSource.userModelDataSource.updateUser(userInfoData, dataID, context);
        },
        deleteUser: async (_, { dataID }, context) => {
            // Access args.userInput
            // Call the createUser method of the UserDataSource.
            return context.dataSource.userModelDataSource.deleteUser(dataID, context);
        },
    },
    User: {
        following: async (parent, args, context) => {
            // You can now use dataID in your resolver logic to fetch data
            const followingCount = relationship_1.default.count({
                following: parent._id, // Use dataID here
            });
            return followingCount;
        },
        followers: async (parent, args, _context) => {
            // You can now use dataID in your resolver logic to fetch data
            const followerCount = relationship_1.default.count({
                user: parent._id, // Use dataID here
            });
            return followerCount;
        },
        lastActivity: async (parent, args, context) => {
            // You can now use dataID in your resolver logic to fetch data
            const latestActivity = await activity_1.default.findOne({
                dataID: parent._id, // Replace 'dataID' with the actual field name in your Activity model
            })
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest one
                .exec();
            return latestActivity?.lastActivity;
        },
        status: async (parent, args, context) => {
            // You can now use dataID in your resolver logic to fetch data
            const lateststatus = await userStatus_1.default.findOne({
                dataID: parent._id, // Replace 'dataID' with the actual field name in your Activity model
            })
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest one
                .exec();
            return lateststatus?.status;
        },
        posts: async (parent, args, context) => {
            try {
                const posts = await context.postfromIDLoaders.load(parent._id);
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