import {
  composeResolvers,
  ResolversComposerMapping,
} from "@graphql-tools/resolvers-composition";

// Import your resolvers and other relevant dependencies here
import { Resolvers } from "../../../__generated__/resolvers-types";

// Import your authentication functions
import { isAuthenticated, isAdmin } from "../Authentication/auth";
import userResolvers from "../../modules/users/users.resolver";
import postResolvers from "../../modules/posts/posts.resolver";
import {
  isPostDataCachedInRedis,
  isPostsCachedInRedis,
  isPostsCountCachedInRedis,
  isUserDataCachedInRedis,
  isUsersCachedInRedis,
  isUsersCountCachedInRedis,
} from "../Cache/redisCache";

// Define your resolvers composition
const userResolversComposition: ResolversComposerMapping<Resolvers> = {
  Query: {
    viewUserById: [isAuthenticated(), isUserDataCachedInRedis()],
    users: [isAuthenticated(), isUsersCachedInRedis()],
    user: [isAuthenticated(), isUsersCachedInRedis()],
    countUsers: [isAuthenticated(), isUsersCountCachedInRedis()],
  },
  Mutation: {
    updateUser: [isAuthenticated(), isAdmin()],
    deleteUser: [isAuthenticated(), isAdmin()],
  },
};

const postResolversComposition: ResolversComposerMapping<Resolvers> = {
  Query: {
    postById: [isAuthenticated(), isPostDataCachedInRedis()],
    posts: [isAuthenticated(), isPostsCachedInRedis()],
    post: [isAuthenticated(), isPostsCachedInRedis()],
    countPosts: [isAuthenticated(), isPostsCountCachedInRedis()],
  },
  Mutation: {
    createPost: [isAuthenticated()],
    updatePost: [isAuthenticated(), isAdmin()],
    deletePost: [isAuthenticated(), isAdmin()],
  },
};

// Compose your resolvers
const userComposedResolvers = composeResolvers(
  userResolvers,
  userResolversComposition,
);
const postComposedResolvers = composeResolvers(
  postResolvers,
  postResolversComposition,
);

export { userComposedResolvers, postComposedResolvers };
