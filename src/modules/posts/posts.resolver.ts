import { Post, Resolvers, User } from "../../../__generated__/resolvers-types";
import { userContext } from "../../libs";
import Comment from "../../models/comment";
import Like from "../../models/like";

export default {
  Query: {
    viewPost: async (_:any,args:any, context:userContext) => {
      // Call the getUserById method of the UserDataSource
      
      return context.dataSource.postModelDataSource.viewPost(args.postID,context);
    },
    viewPostsbyUserID: async (_: any, args: any, context: any) => {
      if (args.search) {
        return context.dataSource.postModelDataSource.viewPostsWithSearch(args);
      } else {
        return context.dataSource.postModelDataSource.viewPostsbyUserID(args);
      }
    },
  },
  Mutation: {
    createPost: async (_: any, args: { postInput: any; }, context:any ) => {
      // Call the createUser method of the UserDataSource.
      return context.dataSource.postModelDataSource.createPost(
        args.postInput,
        context
      );
    },
    updatePost: async (_: any, args: any, context: any) => {
      // Call the createUser method of the UserDataSource.
      return context.dataSource.postModelDataSource.updatePost(
        args.userInput,
        context
      );
    },
  },
  Post: {
    likesCount: async (parent: Post, args: any, context: any) => {
      // Replace with the correct argument name
      // You can now use userId in your resolver logic to fetch data
      const LikeCount = Like.count({
        typeID: parent._id, // Use userId here
      });
      return LikeCount;
    },
    commentCount: async (parent: Post, args: any, context: any) => {
      // Replace with the correct argument name
      // You can now use userId in your resolver logic to fetch data
      const commentCount = Comment.count({
        post: parent._id, // Use userId here
      });
      return commentCount;
    },
    isLiked: async (parent: Post, args: any, context:any) => {
      // Replace with the correct argument name
      // You can now use userId in your resolver logic to fetch data
      const userPost = await Like.findOne({
        $and: [
          { user: String(context.userId) },
          { typeID: parent._id },
          { type: "Post" },
        ],
      });

      if (!userPost) {
        return false;
      }

      return true;
    },
  },
} as unknown as Resolvers;
