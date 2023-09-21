/* eslint-disable no-useless-catch */
import postModel from "../../modules/posts/posts.model";
import UserModel from "../../modules/users/users.model";
import { encodetoJSON } from "../../utils/CustomUtils";

export const isPostsCachedInRedis =
  () =>
  (next: (root: any, args: any, context: any, info: any) => any) =>
  async (root: any, args: any, context: { redisClient: any }, info: any) => {
    try {
      const encodedJSON = encodetoJSON(args);
      const dataStore = await context.redisClient.client.HGET(
        "postsSearch",
        encodedJSON,
      );
      if (!dataStore) {
        return next(root, args, context, info);
      }
      console.log("redis");
      const data = JSON.parse(dataStore!);
      const arrayPosts = Object.values(data);

      const formattedPost = arrayPosts.map((post: any) => {
        post = postModel.hydrate(post);
        return { ...post._doc };
      });
      return formattedPost;
    } catch (error) {
      throw error;
    }
  };

export const isPostsCountCachedInRedis =
  () =>
  (next: (root: any, args: any, context: any, info: any) => any) =>
  async (root: any, args: any, context: { redisClient: any }, info: any) => {
    try {
      const encodedJSON = encodetoJSON(args);
      const dataStore = await context.redisClient.client.HGET(
        "postsSearchCount",
        encodedJSON,
      );
      if (!dataStore) {
        return next(root, args, context, info);
      }
      console.log("redis");
      const data = JSON.parse(dataStore!);
      return data;
    } catch (error) {
      throw error;
    }
  };

export const isUsersCachedInRedis =
  () =>
  (next: (root: any, args: any, context: any, info: any) => any) =>
  async (
    root: any,
    args: any,
    context: { redisClient: any; deviceClient: any },
    info: any,
  ) => {
    try {
      const encodedJSON = encodetoJSON(args);
      const dataStore = await context.redisClient.client.HGET(
        "usersSearch",
        encodedJSON,
      );
      if (!dataStore) {
        return next(root, args, context, info);
      }
      console.log("redis");
      const data = JSON.parse(dataStore!);
      const arrayUsers = Object.values(data);

      const formattedUser = arrayUsers.map((user: any) => {
        user = UserModel.hydrate(user);
        return { ...user._doc };
      });
      return formattedUser;
    } catch (error) {
      throw error;
    }
  };

export const isUsersCountCachedInRedis =
  () =>
  (next: (root: any, args: any, context: any, info: any) => any) =>
  async (
    root: any,
    args: any,
    context: { redisClient: any; deviceClient: any },
    info: any,
  ) => {
    try {
      const encodedJSON = encodetoJSON(args);
      const dataStore = await context.redisClient.client.HGET(
        "usersSearchCount",
        encodedJSON,
      );
      if (!dataStore) {
        return next(root, args, context, info);
      }
      console.log("redis");
      const data = JSON.parse(dataStore!);
      return data;
    } catch (error) {
      throw error;
    }
  };

export const isPostDataCachedInRedis =
  () =>
  (next: (root: any, args: any, context: any, info: any) => any) =>
  async (
    root: any,
    args: { dataID: string },
    context: { redisClient: any },
    info: any,
  ) => {
    try {
      const dataStore = await context.redisClient.client.HGET(
        "posts",
        args.dataID,
      );
      if (!dataStore) {
        return next(root, args, context, info);
      }
      console.log("redis");
      const data = JSON.parse(dataStore!);
      const arrayPosts = Object.values(data);

      const formattedPost = arrayPosts.map((post: any) => {
        post = postModel.hydrate(post);
        return { ...post._doc };
      });
      return formattedPost[0];
    } catch (error) {
      throw error;
    }
  };

export const isUserDataCachedInRedis =
  () =>
  (next: (root: any, args: any, context: any, info: any) => any) =>
  async (root: any, args: any, context: { redisClient: any }, info: any) => {
    try {
      const encodedJSON = encodetoJSON(args);
      const dataStore = await context.redisClient.client.HGET(
        "users",
        encodedJSON,
      );
      if (!dataStore) {
        return next(root, args, context, info);
      }
      console.log("redis");
      const data = JSON.parse(dataStore!);
      const formattedPost = postModel.hydrate(data);
      return formattedPost;
    } catch (error) {
      throw error;
    }
  };
