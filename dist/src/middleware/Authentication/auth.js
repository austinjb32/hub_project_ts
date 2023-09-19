"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const user_1 = tslib_1.__importDefault(require("../../models/user"));
const graphql_1 = require("graphql");
const isAuthenticated = () => (next) => async (root, args, context, info) => {
  let token = context.accessToken;
  if (!token) {
    throw new Error("No Token found");
  }
  const decodedToken = jsonwebtoken_1.default.verify(
    context.accessToken,
    "somesupersecretsecret",
  );
  const foundUser = await user_1.default.findById(decodedToken.userId);
  if (!foundUser) {
    throw new Error("No users found");
  }
  const receivedPosts = foundUser.posts.forEach((e) => {
    e._id.toString();
  });
  const formattedUser = {
    ...foundUser,
    _id: foundUser?._id.toString(),
    createdAt: foundUser?.createdAt.toISOString(),
    updatedAt: foundUser?.updatedAt.toISOString(),
    posts: receivedPosts,
  };
  context.userId = formattedUser._id.toString();
  return next(root, args, context, info);
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = () => (next) => async (root, args, context, info) => {
  if (!context.accessToken) {
    throw new graphql_1.GraphQLError(
      "You are not authorized to perform this action.",
      {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      },
    );
  }
  const decodedToken = jsonwebtoken_1.default.verify(
    context.accessToken,
    "somesupersecretsecret",
  );
  const foundUser = await user_1.default.findById(decodedToken.userId);
  if (!foundUser) {
    throw new Error("No User Found");
  }
  if (!(foundUser.isAdmin || args.dataID !== foundUser._id.toString())) {
    throw new graphql_1.GraphQLError(
      "You are not authorized to perform this action.",
      {
        extensions: {
          code: "FORBIDDEN",
        },
      },
    );
  }
  const receivedPosts = foundUser.posts.forEach((e) => {
    e._id.toString();
  });
  const formattedUser = {
    ...foundUser,
    _id: foundUser?._id.toString(),
    createdAt: foundUser?.createdAt.toISOString(),
    updatedAt: foundUser?.updatedAt.toISOString(),
    posts: receivedPosts,
  };
  context.userId = formattedUser._id.toString();
  return next(root, args, context, info);
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=auth.js.map
