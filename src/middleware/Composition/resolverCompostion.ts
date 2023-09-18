import { NextFunction } from "express";
import { composeResolvers, ResolversComposerMapping } from "@graphql-tools/resolvers-composition";

// Import your resolvers and other relevant dependencies here
import { AuthData, Resolvers, User } from "../../../__generated__/resolvers-types";

// Import your authentication functions
import { isAuthenticated, isAdmin} from "../Authentication/auth";
import userResolvers from "../../modules/users/users.resolver";
import postResolvers from "../../modules/posts/posts.resolver";
import {isPostDataCachedInRedis, isPostsCachedInRedis, isUserDataCachedInRedis, isUsersCachedInRedis } from "../Cache/redisCache";

// Define your resolvers composition
const userResolversComposition: ResolversComposerMapping<Resolvers> = {
  Query: {
    viewUserById: [isAuthenticated(),isUserDataCachedInRedis()],
    users:[isUsersCachedInRedis()],
    user:[isUsersCachedInRedis()]
    
  },
  Mutation:{
    updateUser:[isAuthenticated()],
    deleteUser:[isAuthenticated()]
  }
};


const postResolversComposition: ResolversComposerMapping<Resolvers> = {
    Query: {
        viewPost:[isAuthenticated(),isPostDataCachedInRedis()],
        posts:[isPostsCachedInRedis()],
        post:[isPostsCachedInRedis()]
      
    },
    Mutation:{
        createPost:[isAuthenticated(),isAdmin()],
        updatePost:[isAuthenticated()],
        deletePost:[isAuthenticated()],
    }
  };

// Compose your resolvers
const userComposedResolvers = composeResolvers(userResolvers, userResolversComposition);
const postComposedResolvers = composeResolvers(postResolvers, postResolversComposition);

export {userComposedResolvers,postComposedResolvers};

