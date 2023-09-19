"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const apollo_datasource_mongodb_1 = require("apollo-datasource-mongodb");
const user_1 = tslib_1.__importDefault(require("../../models/user"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const validation_1 = require("../../middleware/Validation/validation");
const CustomUtils_1 = require("../../utils/CustomUtils");
class PostDataSource extends apollo_datasource_mongodb_1.MongoDataSource {
  ////////*************Query*****************//////////////////
  ///////////////********* VIEW POST BY ID ***************/////////////////////////
  async viewPostById(args, context) {
    try {
      if (!args) {
        throw new Error("No input");
      }
      let post = await context.postLoaders.load(args);
      if (!post) {
        throw new Error("Post not Found");
      }
      const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
      await context.redisClient.client.HSET(
        "posts",
        `${encodedJSON}`,
        JSON.stringify(post),
      );
      const formattedPost = post.map((post) => {
        post = this.model.hydrate(post);
        return { ...post._doc };
      });
      return formattedPost[0];
    } catch (e) {
      return e;
    }
  }
  ///////////////********* VIEW POST ***************/////////////////////////
  async viewPost(args, context) {
    const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
    let dataStore = await context.redisClient.client.HGET(
      "postsSearch",
      `${encodedJSON}`,
    );
    let post;
    if (!dataStore) {
      post = await this.model
        .find({ ...args.filter })
        .skip(args.skip || 0)
        .sort(args.sort || 0)
        .limit(args.limit || 1);
      console.log("database");
      await context.redisClient.client.HSET(
        "postsSearch",
        `${encodedJSON}`,
        JSON.stringify(post),
      );
    } else {
      post = this.model.hydrate(JSON.parse(dataStore));
      console.log("redis");
    }
    if (!post) {
      throw new Error("No Post Found");
    }
    const formattedPost = post.map((post) => {
      return { ...post._doc, title: post.title.toString() };
    });
    return formattedPost;
  }
  async viewPostWithSearch(args, context) {
    async function saveInRedis(postSearch) {
      const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
      await context.redisClient.client.HSET(
        "postsSearch",
        `${encodedJSON}`,
        JSON.stringify(postSearch),
      );
    }
    let pipeline = [];
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
      { $project: { title: 1, content: 1 } },
    );
    const postSearch = await this.model.aggregate(pipeline);
    saveInRedis(postSearch);
    console.log("database");
    if (!postSearch) {
      return "No Posts Available";
    }
    const formattedPost = postSearch.map((post) => {
      return { ...post._doc, title: post.title.toString() };
    });
    return formattedPost;
  }
  ///////////////********* VIEW POSTS ***************/////////////////////////
  async viewPosts(args, context) {
    const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
    let dataStore = await context.redisClient.client.HGET(
      "postsSearch",
      `${encodedJSON}`,
    );
    let posts;
    if (!dataStore) {
      posts = await this.model
        .find({ ...args.filter })
        .skip(args.skip || 0)
        .sort(args.sort || 0)
        .limit(args.limit);
      console.log("database");
      await context.redisClient.client.HSET(
        "postsSearch",
        `${encodedJSON}`,
        JSON.stringify(posts),
      );
    } else {
      posts = JSON.parse(dataStore);
      console.log("redis");
    }
    if (!posts) {
      throw new Error("No Posts Found");
    }
    const arrayPosts = Object.values(posts);
    const formattedPost = arrayPosts.map((post) => {
      post = this.model.hydrate(post);
      return { ...post._doc };
    });
    return formattedPost;
  }
  async viewPostsWithSearch(args, context) {
    async function saveInRedis(postSearch) {
      const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
      await context.redisClient.client.HSET(
        "postsSearch",
        `${encodedJSON}`,
        JSON.stringify(postSearch),
      );
    }
    let pipeline = [];
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
      { $project: { title: 1, content: 1 } },
    );
    const postSearch = await this.model.aggregate(pipeline);
    saveInRedis(postSearch);
    console.log("database");
    if (!postSearch) {
      return "No Posts Available";
    }
    const formattedPost = postSearch.map((post) => {
      return {
        ...post._doc,
        _id: post._id.toString(),
        title: post.title.toString(),
      };
    });
    return formattedPost;
  }
  async countPosts(args, context) {
    const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
    const posts = await this.model
      .find({ ...args.filter })
      .skip(args.skip || 0)
      .sort(args.sort || 0)
      .limit(args.limit)
      .countDocuments();
    console.log("database");
    await context.redisClient.client.HSET(
      "postsSearch",
      `${encodedJSON}`,
      JSON.stringify(posts),
    );
    if (!posts) {
      throw new Error("No Posts Found");
    }
    return posts;
  }
  async countPostsWithSearch(args, context) {
    const encodedJSON = (0, CustomUtils_1.encodetoJSON)(args);
    let pipeline = [];
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
      { $project: { title: 1, content: 1 } },
    );
    const postSearch = await this.model.aggregate(pipeline);
    const postSearchCount = postSearch.length;
    await context.redisClient.client.hSet(
      "postsSearchCount",
      encodedJSON,
      postSearchCount,
    );
    console.log("database");
    if (!postSearch) {
      return "No Posts Available";
    }
    return postSearchCount;
  }
  ////////*************Mutations*****************//////////////////
  ///////////////********* CREATE POST ***************/////////////////////////
  async createPost(postInput, context) {
    const postCreateValidation = (0, validation_1.postCreationValidation)(
      postInput,
    );
    if (postCreateValidation.error) {
      throw new Error(
        `${postCreateValidation.error.name}${postCreateValidation.error.message}`,
      );
    }
    const creator = await user_1.default.findById(context.userId);
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
    const formattedPost = {
      ...newPost.toObject(),
      _id: newPost._id.toString(),
      createdAt: newPost.createdAt.toString(),
      updatedAt: newPost.updatedAt.toString(),
    };
    return formattedPost;
  }
  ///////////////********* UPDATE POST ***************/////////////////////////
  async updatePost(postID, data, context) {
    // const postUpdateValidation = postUpdationValidation(userInput);
    // if (postUpdateValidation.error) {
    //   throw new Error(
    //     `${postUpdateValidation.error.name},${postUpdateValidation.error.message}`
    //   );
    // }
    async function redisUpdateOperations(post) {
      await context.redisClient.hDeleteCache(postID);
      await context.redisClient.hDeleteCache("postsSearch");
      await context.redisClient.HSET(
        "posts",
        `${postID}`,
        JSON.stringify(post),
      );
    }
    const foundUser = await user_1.default.findById(context.userId);
    const post = await this.model.findById(postID);
    if (!post) {
      throw new Error("No Post Found");
    }
    // Check if the user is authorized to make the change
    if (foundUser._id.toString() !== post.creator.toString()) {
      throw new Error("You're not Authorized to make this Change");
    }
    // Create an object with the fields to be updated
    const editPost = {
      title: data.title.toLowerCase().trim(),
      content: data.content.toLowerCase().trim(),
      imageUrl: data.imageUrl.trim(),
    };
    // Use lodash to merge the changes into the post
    const updatedPost = lodash_1.default.merge(post, editPost);
    // Update and save the post
    Object.assign(post, updatedPost);
    await post.save();
    const formattedPost = post;
    await redisUpdateOperations(updatedPost);
    return { ...formattedPost._doc };
  }
  ///////////////********* DELETE POST ***************/////////////////////////
  async deletePost(postID, context) {
    async function redisDeleteOperations() {
      await context.redisClient.hDeleteCache(postID);
      await context.redisClient.hDeleteCache("postsSearch");
    }
    const foundUser = await user_1.default.findById(context.userId);
    const post = await this.model.findById(postID);
    if (!post) {
      throw new Error("No Post Found");
    }
    // Check if the user is authorized to make the change
    if (foundUser._id.toString() !== post.creator.toString()) {
      throw new Error("You're not Authorized to make this Change");
    }
    const deletePost = await this.model.findByIdAndDelete(postID);
    await redisDeleteOperations();
    return { success: true, data: deletePost };
  }
}
exports.default = PostDataSource;
//# sourceMappingURL=posts.datasource.js.map
