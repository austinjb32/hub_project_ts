import { IPostSchemaDocument, IPostSchemaModel } from "./posts.model";
import { MongoDataSource } from "apollo-datasource-mongodb";
import { Post, PostInputData } from "../../../__generated__/resolvers-types";
import user from "../../models/user";
import { userContext } from "../../libs";

import UserModel from "../users/users.model";
import _ from "lodash";
import { postCreationValidation, postUpdationValidation } from "../../middleware/Validation/validation";
import { encodetoJSON } from "../../utils/CustomUtils";


export default class PostDataSource extends MongoDataSource<IPostSchemaDocument> {

   ////////*************Query*****************//////////////////

  ///////////////********* VIEW POST BY ID ***************/////////////////////////

  async viewPostById(args: string, context: userContext) {
    try{
    if (!args) {
      throw new Error("No input");
    }

      let post:any = await context.postLoaders.load(args);

      if (!post) {
        throw new Error("Post not Found");
      }

      const encodedJSON= encodetoJSON(args)

      await context.redisClient.client.HSET(
        'posts',
        `${encodedJSON}`,
        JSON.stringify(post),
      );


      const formattedPost = post.map((post: any) => {
        post=this.model.hydrate(post);
        return { ...post._doc };
      });

    return formattedPost[0];
  }catch(e){
    return e
  }
  }

    ///////////////********* VIEW POST ***************/////////////////////////

  async viewPost(args: any,context:userContext) {

    const encodedJSON=encodetoJSON(args)

    let dataStore = await context.redisClient.client.HGET("postsSearch", `${encodedJSON}`);

    let post:any;


    if (!dataStore) {
      post = await this.model
      .find({ ...args.filter })
      .skip(args.skip || 0)
      .sort(args.sort || 0)
      .limit(args.limit||1);

      console.log('database')

      await context.redisClient.client.HSET('postsSearch',`${encodedJSON}`,  JSON.stringify(post));
    } else{
      post = this.model.hydrate(JSON.parse(dataStore!));
      console.log('redis')
    }


    if (!post) {
      throw new Error("No Post Found");
    }


    const formattedPost = post.map((post: any) => {
      return { ...post._doc, title: post.title.toString() };
    });
    return formattedPost;
  }



  async viewPostWithSearch(args: any,context:userContext) {
    
    async function saveInRedis(postSearch:any){
      const encodedJSON=encodetoJSON(args)
  
      await context.redisClient.client.HSET('postsSearch',`${encodedJSON}`,  JSON.stringify(postSearch));
    }

    let pipeline: any[] = [];

    pipeline.push({
      $search: {
        index: "searchPosts",
        text: {
          query: args.search.trim() || "",
          path: "title",
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    });

    pipeline.push(
      { $sort: { ...(args.sort || { updatedDate: -1 }) } },
      { $skip: args.offset || 0 },
      { $limit: args.limit || 1 },
      { $project: { title: 1, content: 1 } }
    );

    const postSearch = await this.model.aggregate(pipeline);

    saveInRedis(postSearch);

    console.log('database')

    if (!postSearch) {
      return "No Posts Available";
    }

    const formattedPost = postSearch.map((post: any) => {
      return { ...post._doc, title: post.title.toString() };
    });

    return formattedPost;
  }

      ///////////////********* VIEW POSTS ***************/////////////////////////

  async viewPosts(args: any,context:userContext) {


    const encodedJSON=encodetoJSON(args)


    let dataStore = await context.redisClient.client.HGET("postsSearch", `${encodedJSON}`);

    let posts:any;


    if (!dataStore) {
      posts = await this.model
      .find({ ...args.filter })
      .skip(args.skip || 0)
      .sort(args.sort || 0)
      .limit(args.limit);

      console.log('database')

      await context.redisClient.client.HSET('postsSearch',`${encodedJSON}`,  JSON.stringify(posts));
    } else{
      posts = JSON.parse(dataStore!);
      console.log('redis')
    }


    if (!posts) {
      throw new Error("No Posts Found");
    }

    const arrayPosts = Object.values(posts);

    const formattedPost = arrayPosts.map((post: any) => {
      post=this.model.hydrate(post);
      return { ...post._doc };
    });

    return formattedPost;
  }



  async viewPostsWithSearch(args: any,context:userContext) {

    async function saveInRedis(postSearch:any){
    
      const encodedJSON=encodetoJSON(args)
      await context.redisClient.client.HSET('postsSearch',`${encodedJSON}`,  JSON.stringify(postSearch));

    }

    let pipeline: any[] = [];

    pipeline.push({
      $search: {
        index: "searchPosts",
        text: {
          query: args.search.trim() || "",
          path: "title",
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    });

    pipeline.push(
      { $sort: { ...(args.sort || { updatedDate: -1 }) } },
      { $skip: args.offset || 0 },
      { $limit: args.limit || 10 },
      { $project: { title: 1, content: 1 } }
    );


    const postSearch = await this.model.aggregate(pipeline);

    
    saveInRedis(postSearch);

    console.log('database');

    if (!postSearch) {
      return "No Posts Available";
    }

    const formattedPost = postSearch.map((post: any) => {
      return { ...post._doc, _id:post._id.toString(), title: post.title.toString() };
    });

    return formattedPost;
  }


  async countPosts(args: any,context:userContext) {


    const encodedJSON=encodetoJSON(args)

     const posts = await this.model
      .find({ ...args.filter })
      .skip(args.skip || 0)
      .sort(args.sort || 0)
      .limit(args.limit)
      .countDocuments();

      console.log('database')

      await context.redisClient.client.HSET('postsSearch',`${encodedJSON}`,  JSON.stringify(posts));


    if (!posts) {
      throw new Error("No Posts Found");
    }


    return posts;
  }



  async countPostsWithSearch(args: any,context:userContext) {

    const encodedJSON=encodetoJSON(args)

    let pipeline: any[] = [];

    pipeline.push({
      $search: {
        index: "searchPosts",
        text: {
          query: args.search.trim() || "",
          path: "title",
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    });

    pipeline.push(
      { $sort: { ...(args.sort || { updatedDate: -1 }) } },
      { $skip: args.offset || 0 },
      { $limit: args.limit || 10 },
      { $project: { title: 1, content: 1 } }
    );


    const postSearch = await this.model.aggregate(pipeline);

    const postSearchCount= postSearch.length

    
   await context.redisClient.client.hSet('postsSearchCount',encodedJSON,postSearchCount);

    console.log('database');

    if (!postSearch) {
      return "No Posts Available";
    }

return postSearchCount;
  
  }

  ////////*************Mutations*****************//////////////////


      ///////////////********* CREATE POST ***************/////////////////////////

  async createPost(postInput: Post, context: userContext) {
    const postCreateValidation = postCreationValidation(postInput);

    if (postCreateValidation.error) {
      throw new Error(
        `${postCreateValidation.error.name}${postCreateValidation.error.message}`
      );
    }

    const creator = await user.findById(context.userId);

    if (!creator) {
      throw new Error("No Creator Found");
    }

    const newPost = new this.model({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: creator,
    });

    await newPost.save();
    const formattedPost: Post = {
      ...newPost.toObject(),
      _id: newPost._id.toString(),
      createdAt: newPost.createdAt.toString(),
      updatedAt: newPost.updatedAt.toString(),
    };

    return formattedPost;
  }

  ///////////////********* UPDATE POST ***************/////////////////////////

  async updatePost(postID:string,data:PostInputData, context:userContext) {
    // const postUpdateValidation = postUpdationValidation(userInput);
    // if (postUpdateValidation.error) {
    //   throw new Error(
    //     `${postUpdateValidation.error.name},${postUpdateValidation.error.message}`
    //   );
    // }

    async function redisUpdateOperations(post:any) {
      await context.redisClient.hDeleteCache(postID);
      await context.redisClient.hDeleteCache('postsSearch');
      await context.redisClient.HSET(
        "posts",
        `${postID}`,
        JSON.stringify(post)
      );    }

    const foundUser = await user.findById(context.userId);

    const post = await this.model.findById(postID);

    if(!post){
      throw new Error ('No Post Found')
    }

    // Check if the user is authorized to make the change
    if (foundUser!._id.toString() !== post!.creator.toString()) {
      throw new Error("You're not Authorized to make this Change");
    }

    // Create an object with the fields to be updated
    const editPost = {
      title: data.title.toLowerCase().trim(),
      content: data.content.toLowerCase().trim(),
      imageUrl: data.imageUrl!.trim(),
    };

    // Use lodash to merge the changes into the post
    const updatedPost = _.merge(post, editPost);


    // Update and save the post
    Object.assign(post!, updatedPost);
    await post!.save();



    const formattedPost= post as any;

    await redisUpdateOperations(updatedPost);

    return {...formattedPost._doc} as any
  }

    ///////////////********* DELETE POST ***************/////////////////////////

  async deletePost(postID:string, context: userContext) {

    async function redisDeleteOperations() {
      await context.redisClient.hDeleteCache(postID);
      await context.redisClient.hDeleteCache('postsSearch');
    }

    const foundUser = await user.findById(context.userId);

    const post = await this.model.findById(postID);

    if(!post){
      throw new Error ('No Post Found')
    }

    // Check if the user is authorized to make the change
    if (foundUser!._id.toString() !== post!.creator.toString()) {
      throw new Error("You're not Authorized to make this Change");
    }

    const deletePost= await this.model.findByIdAndDelete(postID);

    await redisDeleteOperations();

    return {success:true, data:deletePost}
  }


}