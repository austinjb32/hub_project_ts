import { AuthData, Resolvers, User } from "../../../__generated__/resolvers-types";
import { Request } from "express";
import { composeResolvers } from "@graphql-tools/resolvers-composition";
import jwt from 'jsonwebtoken';
import Relationship from "../../models/relationship";
import Activity from "../../models/activity";


export default {
  Query: {
    viewUser: async (_, args, context, req) => {
      // Access args.userID
      // Call the getUserById method of the UserDataSource
      return context.dataSource.userModelDataSource.viewUser(args.userID);
    },
    login: async (_, args, context) => {
      // Access args
      const user = args as User;
      // Call the getUserById method of the UserDataSource
      return context.dataSource.userModelDataSource.login(user, context as  any);
    },
    hello: () => {
      return { hello: "Hi" };
    },
  },
  Mutation: {
    createUser: async (_, args, context) => {
      // Access args.userInput
      const userInput = args.userInput;
      // Call the createUser method of the UserDataSource.
      return context.dataSource.userModelDataSource.createUser(userInput);
    },
  },
  Hello: {
    resolverHit: () => {
      return "Hello";
    },
  },
  User: {
    following: async (parent:User, args, context) => {// Replace with the correct argument name
      // You can now use userId in your resolver logic to fetch data
      const followingCount = Relationship.count({
        following: parent._id, // Use userId here
      });
      return followingCount;
    },
    followers: async (parent:User, args, context) => {// Replace with the correct argument name
      // You can now use userId in your resolver logic to fetch data
      const followerCount = Relationship.count({
        user: parent._id, // Use userId here
      });
      return followerCount;
    },
    lastActivity: async (parent:User, args, context) => {// Replace with the correct argument name
      // You can now use userId in your resolver logic to fetch data
      const latestActivity = await Activity.findOne({
        userId: parent._id, // Replace 'userId' with the actual field name in your Activity model
      })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest one
        .exec();

      return latestActivity?.track?.activity;
    },

  },
} as Resolvers;
