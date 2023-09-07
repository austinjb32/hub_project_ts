import { NextFunction } from "express";
import { composeResolvers, ResolversComposerMapping } from "@graphql-tools/resolvers-composition";

// Import your resolvers and other relevant dependencies here
import { AuthData, Resolvers, User } from "../../__generated__/resolvers-types";

// Import your authentication functions
import { isAuthenticated, isAdmin } from "./auth";
import userResolvers from "../modules/users/users.resolver";
import postResolvers from "../modules/posts/posts.resolver";

// Define your resolvers composition
const userResolversComposition: ResolversComposerMapping<Resolvers> = {
  Query: {
    viewUser: [isAuthenticated()],
    
  },
};


const postResolversComposition: ResolversComposerMapping<Resolvers> = {
    Query: {
        viewPost:[isAuthenticated()],
      
    },
    Mutation:{
        createPost:[isAuthenticated()]
    }
  };

// Compose your resolvers
const userComposedResolvers = composeResolvers(userResolvers, userResolversComposition);
const postComposedResolvers = composeResolvers(postResolvers, postResolversComposition);

export {userComposedResolvers,postComposedResolvers};
