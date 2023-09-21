import { buildSubgraphSchema } from "@apollo/subgraph";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLDateTime, GraphQLJSON } from "graphql-scalars";

import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

import userModel from "../modules/users/users.model";
import UserDataSource from "./users/users.datasource";

import postModel from "./posts/posts.model";
import PostDataSource from "./posts/posts.datasource";

import { TModule } from "../libs";
import {
  userComposedResolvers,
  postComposedResolvers,
} from "../middleware/Composition/resolverCompostion";
import AuthDataSource from "./auth/auth.dataSource";
import authResolvers from "./auth/auth.resolvers";
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.resolve(__dirname + "/**/*.graphql"), {
    extensions: ["graphql"],
  }),
);
// const resolvers = mergeResolvers(
//   loadFilesSync(path.resolve(__dirname + "/**/*.resolver.{ts,js}"), {
//     extensions: ["ts", "js"],
//   }),
// );

const finalMergedResolvers = mergeResolvers([
  userComposedResolvers,
  postComposedResolvers,
  authResolvers,
]);

export const Modules: TModule = {
  models: {
    userModel: userModel,
    postModel: postModel,
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
    authModelDataSource: new AuthDataSource(userModel),
  },
};
