import { IPostSchemaDocument, IPostSchemaModel } from "./posts.model";
import { MongoDataSource } from "apollo-datasource-mongodb";
import { Post } from "../../../__generated__/resolvers-types";
import user from "../../models/user";
import { userContext } from "../../libs";

import UserModel from "../users/users.model";
import _ from "lodash";
import { postCreationValidation, postUpdationValidation } from "../../middleware/Validation/validation";

export default class PostDataSource extends MongoDataSource<IPostSchemaDocument> {

   ////////*************Query*****************//////////////////

       ///////////////********* VIEW POST BY ID ***************/////////////////////////

  async postById(args: string, context: userContext) {
    if (!args) {
      throw new Error("No input");
    }

    await context.redisClient.connect();

    let dataStore = await context.redisClient.HGET("post", `${args}`);

    if (!dataStore) {
      const post = await this.model.findById(args);

      if (!post) {
        throw new Error("Post not Found");
      }
      dataStore = await context.redisClient.HSET(
        "post",
        `${args}`,
        JSON.stringify(post)
      );
    }

    let post = JSON.parse(dataStore!);

    context.redisClient.disconnect();

    const formattedPost: Post = {
      ...post,
      _id: post._id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return formattedPost;
  }

    ///////////////********* VIEW POST ***************/////////////////////////

  async viewPost(args: any) {
    const post:any = await this.model
      .findOne({ ...args.filter })
      .skip(args.skip || 0)
      .sort(args.sort || 0)
      .limit(args.limit);

    if (!post) {
      return "No Posts Available";
    }

    const formattedPost = { ...post._doc, title: post.title.toString() };

    return formattedPost;
  }

  async viewPostWithSearch(args: any) {
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
    if (!postSearch) {
      return "No Posts Available";
    }

    const formattedPost = postSearch.map((post: any) => {
      return { ...post._doc, title: post.title.toString() };
    });

    return formattedPost;
  }

      ///////////////********* VIEW POSTS ***************/////////////////////////

  async viewPosts(args: any) {
    const posts = await this.model
      .find({ ...args.filter })
      .skip(args.skip || 0)
      .sort(args.sort || 0)
      .limit(args.limit);

    if (!posts) {
      return "No Posts Available";
    }

    const formattedPost = posts.map((post: any) => {
      return { ...post._doc, title: post.title.toString() };
    });

    return formattedPost;
  }



  async viewPostsWithSearch(args: any) {
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
    if (!postSearch) {
      return "No Posts Available";
    }

    const formattedPost = postSearch.map((post: any) => {
      return { ...post._doc, title: post.title.toString() };
    });

    return formattedPost;
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

    await context.redisClient.connect();
    await context.redisClient.HSET(
      "post",
      `${formattedPost._id}`,
      JSON.stringify(formattedPost)
    );

    return formattedPost;
  }

  ///////////////********* UPDATE POST ***************/////////////////////////

  async updatePost(userInput: any, context: userContext) {
    const postUpdateValidation = postUpdationValidation(userInput);
    if (postUpdateValidation.error) {
      throw new Error(
        `${postUpdateValidation.error.name},${postUpdateValidation.error.message}`
      );
    }

    async function redisUpdateOperations() {
      await context.redisClient.HDEL("post", `${userInput.id}`);
      await context.redisClient.HSET(
        "post",
        `${userInput}`,
        JSON.stringify(post)
      );
      context.redisClient.disconnect();
    }

    const foundUser = await user.findById(context.userId);

    const post = await this.model.findById(userInput.id);

    // Check if the user is authorized to make the change
    if (foundUser!._id.toString() !== post!.creator.toString()) {
      throw new Error("You're not Authorized to make this Change");
    }

    // Create an object with the fields to be updated
    const editPost = {
      title: userInput.title.toLowerCase().trim(),
      content: userInput.content.toLowerCase().trim(),
      imageUrl: userInput.imageUrl.trim(),
    };

    // Use lodash to merge the changes into the post
    const updatedPost = _.merge(post, editPost);

    // Update and save the post
    Object.assign(post!, updatedPost);
    await post!.save();

    await redisUpdateOperations();

    return { ...updatedPost.toObject(), _id: updatedPost._id.toString() };
  }

    ///////////////********* DELETE POST ***************/////////////////////////

  async deletePost(userInput: any, context: userContext) {

    async function redisDeleteOperations() {
      await context.redisClient.connect();
      await context.redisClient.HDEL("post", `${userInput.id}`);
      context.redisClient.disconnect();
    }

    const foundUser = await user.findById(context.userId);

    const post = await this.model.findById(userInput.id);

    // Check if the user is authorized to make the change
    if (foundUser!._id.toString() !== post!.creator.toString()) {
      throw new Error("You're not Authorized to make this Change");
    }

    const postDelete = await this.model.findByIdAndDelete(userInput.id);

    await redisDeleteOperations();

    return true;
  }


}
