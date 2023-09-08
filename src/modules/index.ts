import { buildSubgraphSchema } from "@apollo/subgraph";
import { GraphQLDateTime, GraphQLJSON } from "graphql-scalars";

import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

import userModel from "../modules/users/users.model";
import UserDataSource from "./users/users.datasource";

import postModel from "./posts/posts.model";
import PostDataSource from "./posts/posts.datasource";

import { TModule, userContext } from "../libs";
import {userComposedResolvers,postComposedResolvers } from "../middleware/Composition/resolverCompostion";
const typeDefs = mergeTypeDefs(
    loadFilesSync(path.resolve(__dirname + "/**/*.graphql"), {
      extensions: ["graphql"],
    })
  );
  const resolvers = mergeResolvers(
    loadFilesSync(path.resolve(__dirname + "/**/*.resolver.{ts,js}"), {
      extensions: ["ts", "js"],
    })
  );


  const finalMergedResolvers = mergeResolvers([userComposedResolvers,postComposedResolvers]);
  


export const Modules:TModule = {
  models: {
    userModel: userModel,
    postModel: postModel
  },

  schemas: buildSubgraphSchema({
    typeDefs: typeDefs,
    resolvers: {
      ...finalMergedResolvers,
      ...{ JSON: GraphQLJSON },
      ...{ DateTime: GraphQLDateTime },
    },
  }),

  dataSource: {
    userModelDataSource: new UserDataSource(userModel),
    postModelDataSource: new PostDataSource(postModel),

  },

};
  