import { Post, Resolvers, User } from "../../../__generated__/resolvers-types";
import Relationship from "../../models/relationship";
import Activity from "../../models/activity";
import UserStatus from "../../models/userStatus";


export default {
  Query: {
    viewUser: async (_, args, context) => {
      // Access args.userID
      // Call the getUserById method of the UserDataSource
     
      return context.dataSource.userModelDataSource.viewUser(args.userID,context as any);
      
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
      return context.dataSource.userModelDataSource.createUser(userInput,context);
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
    posts: async(parent:User, args, context)=>{
      try{
    
        const posts= await context.postLoaders.load(parent._id!);
        const transformedPosts = posts.map((post:any) => ({
          ...post._doc,
          _id: post._id.toString(),
          shareCount:Number(post.shareCount),
          creator: parent,
        })) as Post[];
  
        return transformedPosts;

      }catch(err){
        throw new Error(err as string);
      }
        
        
  }
  },
} as Resolvers;
