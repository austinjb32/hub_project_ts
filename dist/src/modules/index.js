"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modules = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@graphql-tools/schema");
const graphql_scalars_1 = require("graphql-scalars");
const path_1 = tslib_1.__importDefault(require("path"));
const load_files_1 = require("@graphql-tools/load-files");
const merge_1 = require("@graphql-tools/merge");
const users_model_1 = tslib_1.__importDefault(
  require("../modules/users/users.model"),
);
const users_datasource_1 = tslib_1.__importDefault(
  require("./users/users.datasource"),
);
const posts_model_1 = tslib_1.__importDefault(require("./posts/posts.model"));
const posts_datasource_1 = tslib_1.__importDefault(
  require("./posts/posts.datasource"),
);
const resolverCompostion_1 = require("../middleware/Composition/resolverCompostion");
const auth_dataSource_1 = tslib_1.__importDefault(
  require("./auth/auth.dataSource"),
);
const auth_resolvers_1 = tslib_1.__importDefault(
  require("./auth/auth.resolvers"),
);
const typeDefs = (0, merge_1.mergeTypeDefs)(
  (0, load_files_1.loadFilesSync)(
    path_1.default.resolve(__dirname + "/**/*.graphql"),
    {
      extensions: ["graphql"],
    },
  ),
);
// const resolvers = mergeResolvers(
//   loadFilesSync(path.resolve(__dirname + "/**/*.resolver.{ts,js}"), {
//     extensions: ["ts", "js"],
//   }),
// );
const finalMergedResolvers = (0, merge_1.mergeResolvers)([
  resolverCompostion_1.userComposedResolvers,
  resolverCompostion_1.postComposedResolvers,
  auth_resolvers_1.default,
]);
exports.Modules = {
  models: {
    userModel: users_model_1.default,
    postModel: posts_model_1.default,
  },
  schemas: (0, schema_1.makeExecutableSchema)({
    typeDefs: typeDefs,
    resolvers: {
      ...finalMergedResolvers,
      ...{ JSON: graphql_scalars_1.GraphQLJSON },
      ...{ DateTime: graphql_scalars_1.GraphQLDateTime },
    },
  }),
  // buildSubgraphSchema({
  //   typeDefs: typeDefs,
  //   resolvers: {
  //     ...finalMergedResolvers,
  //     ...{ JSON: GraphQLJSON },
  //     ...{ DateTime: GraphQLDateTime },
  //   },
  // }),
  dataSource: {
    userModelDataSource: new users_datasource_1.default(users_model_1.default),
    postModelDataSource: new posts_datasource_1.default(posts_model_1.default),
    authModelDataSource: new auth_dataSource_1.default(users_model_1.default),
  },
};
//# sourceMappingURL=index.js.map
