import { Post, Resolvers, User } from "../../../__generated__/resolvers-types";
import Relationship from "../../models/relationship";
import Activity from "../../models/activity";
import UserStatus from "../../models/userStatus";
import { userContext } from "../../libs";


export default {
  Query: {
    user: async (_:any, args:any, context:any) => {
      // Access args.userID
      if(args.search){
        return context.dataSource.userModelDataSource.viewUserWithSearch(args,context);
      }

      return context.dataSource.userModelDataSource.viewUser(args,context);
      
    },
    users :async (_:any,args:any,context:userContext) => {

      if(args.search){
        return context.dataSource.userModelDataSource.viewUsersWithSearch(args,context);
      }
      
      return context.dataSource.userModelDataSource.viewUsers(args,context);

    },
    viewUserById: async (_:any,args:any,context:any)=>{
      return context.dataSource.userModelDataSource.viewUserById(args.userID,context)
    }
  },
  Mutation: {

    updateUser: async (_:any,{userID,userInfoData}, context:userContext) => {
      // Access args.userInput
      // Call the createUser method of the UserDataSource.
      return context.dataSource.userModelDataSource.updateUser(userInfoData as any,userID,context)
    },
    deleteUser: async (_:any, {userID}, context:userContext) => {
      // Access args.userInput
      // Call the createUser method of the UserDataSource.
      return context.dataSource.userModelDataSource.deleteUser(userID,context);
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

      return latestActivity?.lastActivity;
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
