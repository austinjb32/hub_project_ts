import { Post, Resolvers, User } from "../../../__generated__/resolvers-types";
import { userContext } from "../../libs";
import Comment from "../../models/comment";
import Like from "../../models/like";


export default {
    Query: {
      post: async (_:any, args:any, context:any) => {
        // Call the getUserById method of the UserDataSource
        if(args.search){
          return context.dataSource.postModelDataSource.viewPostWithSearch(args,context)
        }
        
        return context.dataSource.postModelDataSource.viewPost(args,context)
    },
    posts: async (_:any,args:any,context:any)=>{
      if(args.search){
        return context.dataSource.postModelDataSource.viewPostsWithSearch(args,context)
      }else{
      return context.dataSource.postModelDataSource.viewPosts(args,context)
      }
    },

    postById: async (_:any,{postID},context:userContext)=>{ 
      return context.dataSource.postModelDataSource.viewPostById(postID,context)
    }
   
    },
    Mutation:{
            createPost: async (_:any,args:any,context:any) => {
                
              // Call the createUser method of the UserDataSource.
              return context.dataSource.postModelDataSource.createPost(args.data,context);
    },
    updatePost:async (_:any,{postID,data},context:userContext) => {
                
      // Call the createUser method of the UserDataSource.
      return context.dataSource.postModelDataSource.updatePost(postID,data,context)
},
    deletePost: async (_:any,{postID},context:userContext) => {
                
      // Call the createUser method of the UserDataSource.
      return context.dataSource.postModelDataSource.deletePost(postID,context);
},
},
 Post:{
    likesCount: async (parent:Post, args, context) => {// Replace with the correct argument name
        // You can now use userId in your resolver logic to fetch data
        const LikeCount = Like.count({
          typeID: parent._id, // Use userId here
        });
        return LikeCount;
      },
    commentCount: async (parent:Post, args, context) => {// Replace with the correct argument name
        // You can now use userId in your resolver logic to fetch data
        const commentCount = Comment.count({
          post: parent._id, // Use userId here
        });
        return commentCount;
      },
      isLiked: async (parent:Post, args, context) => {// Replace with the correct argument name
        // You can now use userId in your resolver logic to fetch data
        const userPost = await Like.findOne({
            $and:[{user: String(context.userId)},{typeID:parent._id},{type:'Post'}]
          });

        if(!userPost){
            return false
        }

        return true;
      },
 }}as Resolvers;