"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modules = void 0;
const tslib_1 = require("tslib");
const subgraph_1 = require("@apollo/subgraph");
const graphql_scalars_1 = require("graphql-scalars");
const path_1 = tslib_1.__importDefault(require("path"));
const load_files_1 = require("@graphql-tools/load-files");
const merge_1 = require("@graphql-tools/merge");
const users_model_1 = tslib_1.__importDefault(require("../modules/users/users.model"));
const users_datasource_1 = tslib_1.__importDefault(require("./users/users.datasource"));
const typeDefs = (0, merge_1.mergeTypeDefs)((0, load_files_1.loadFilesSync)(path_1.default.resolve(__dirname + "/**/*.graphql"), {
    extensions: ["graphql"],
}));
const resolvers = (0, merge_1.mergeResolvers)((0, load_files_1.loadFilesSync)(path_1.default.resolve(__dirname + "/**/*.resolver.{ts,js}"), {
    extensions: ["ts", "js"],
}));
exports.Modules = {
    models: {
        userModel: users_model_1.default
    },
    schemas: (0, subgraph_1.buildSubgraphSchema)({
        typeDefs: typeDefs,
        resolvers: {
            ...resolvers,
            ...{ JSON: graphql_scalars_1.GraphQLJSON },
            ...{ DateTime: graphql_scalars_1.GraphQLDateTime },
        },
    }),
    dataSource: {
        userModelDataSource: new users_datasource_1.default(users_model_1.default)
    }
};
//# sourceMappingURL=index.js.map