"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const user_1 = tslib_1.__importDefault(require("../models/user"));
const isAuthenticated = () => (next) => async (root, args, context, info) => {
  if (!context.accessToken) {
    throw new Error("You are not authenticated!");
  }
  const decodedToken = jsonwebtoken_1.default.verify(
    context.accessToken,
    "somesupersecretsecret",
  );
  const foundUser = await user_1.default.findById(decodedToken.userId);
  if (!foundUser) {
    throw new Error("No User Found");
  }
  const formattedUser = {
    ...foundUser,
    _id: foundUser?._id.toString(),
    createdAt: foundUser?.createdAt.toISOString(),
    updatedAt: foundUser?.updatedAt.toISOString(),
  };
  context.userId = formattedUser._id.toString();
  return next(root, args, context, info);
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = () => (next) => async (root, args, context, info) => {
  if (!context.accessToken) {
    throw new Error("You are not authenticated!");
  }
  const decodedToken = jsonwebtoken_1.default.verify(
    context.accessToken,
    "somesupersecretsecret",
  );
  const foundUser = await user_1.default.findById(decodedToken.userId);
  if (!foundUser) {
    throw new Error("No User Found");
  }
  if (!foundUser.isAdmin) {
    throw new Error("Need Admin Access");
  }
  const formattedUser = {
    ...foundUser,
    _id: foundUser?._id.toString(),
    createdAt: foundUser?.createdAt.toISOString(),
    updatedAt: foundUser?.updatedAt.toISOString(),
  };
  context.userId = formattedUser._id.toString();
  return next(root, args, context, info);
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=auth.js.map
