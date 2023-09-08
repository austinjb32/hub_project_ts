import { AuthData, Post, Resolvers, User } from "../../../__generated__/resolvers-types";
import { Request } from "express";
import { composeResolvers } from "@graphql-tools/resolvers-composition";
import jwt from 'jsonwebtoken';
import Relationship from "../../models/relationship";
import Activity from "../../models/activity";
import UserStatus from "../../models/userStatus";
import { userLoader } from "./users.dataLoader";
import { IPostDocument } from "../posts/posts.model";
import { postLoader } from "../posts/posts.dataLoaders";


export default {
  Query: {
    viewUser: async (_, args, context) => {
      // Access args.userID
      // Call the getUserById method of the UserDataSource
      return context.dataSource.userModelDataSource.viewUser(args.userID);
      
    },
    login: async (_, args, context) => {
      // Access args
      // Call the getUserById method of the UserDataSource
      return context.dataSource.userModelDataSource.login(args as any, context as  any);
    },
    getUserById:async (_,args,context) => {
      
      return context.dataSource.userModelDataSource.getUserById(args.userId)
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
    following: async (parent:User, args, context) => {// Replace with the correct argument name
      // You can now use userId in your resolver logic to fetch data
      const followingCount = Relationship.count({
        following: parent._id, // Use userId here
      });
      return followingCount;
    },
    followers: async (parent:User, args, _context) => {// Replace with the correct argument name
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
    status: async (parent:User, args, context) => {// Replace with the correct argument name
      // You can now use userId in your resolver logic to fetch data
      const lateststatus = await UserStatus.findOne({
        userId: parent._id, // Replace 'userId' with the actual field name in your Activity model
      })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest one
        .exec();

      return lateststatus?.status;
    },
  //   posts: async(parent:User, args, context)=>{
  //     try{
  //   const postLoading= await postLoader.load(parent!._id as string);

  //   return postLoading
  //     }
  //   catch(e){
  //       // Handle any errors appropriately
  //       throw new Error('An error occurred while fetching posts.');
  //   }
  // }
  },
} as Resolvers;
