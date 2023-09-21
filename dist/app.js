"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnect = void 0;
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const body_parser_1 = require("body-parser");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const inlineTrace_1 = require("@apollo/server/plugin/inlineTrace");
const modules_1 = require("./src/modules");
const http_1 = tslib_1.__importDefault(require("http"));
const posts_dataLoaders_1 = require("./src/modules/posts/posts.dataLoaders");
const users_dataLoader_1 = require("./src/modules/users/users.dataLoader");
const redisService_1 = require("./src/utils/redisService");
// import { redisClient } from "./src/middleware/Cache/redisCache";
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
  schema: modules_1.Modules.schemas,
  csrfPrevention: true,
  introspection: true,
  status400ForVariableCoercionErrors: true,
  plugins: [
    (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
    (0, inlineTrace_1.ApolloServerPluginInlineTrace)(),
  ],
  formatError: (error) => {
    if (error instanceof SyntaxError) {
      // Check if the error is an instance of UserInputError
      throw new Error("Syntax Failed"); // Throw a custom error message
    }
    return error; // Return the original error if it's not a UserInputError
  },
});
const startServer = async (listenOptions) => {
  const redisClient = await redisService_1.CacheService.start({
    redis_port: 8080,
    redis_host: "localhost",
  });
  await server.start().then(() => {
    httpServer.listen({ port: listenOptions });
    console.log(`🚀 Server ready at http://localhost:${listenOptions}/graphql`);
  });
  app.use(
    "/graphql",
    (0, cors_1.default)(),
    (0, body_parser_1.json)(),
    (0, express4_1.expressMiddleware)(server, {
      context: async ({ req }) => ({
        dataSource: modules_1.Modules.dataSource,
        accessToken: req.headers.authorization,
        userLoaders: (0, users_dataLoader_1.getUserLoader)(),
        postLoaders: (0, posts_dataLoaders_1.getPostLoader)(),
        postfromIDLoaders: (0, posts_dataLoaders_1.getPostFromUserIDLoader)(),
        redisClient: redisClient,
        models: modules_1.Modules.models,
        userId: "",
        deviceClient: "",
      }),
    }),
  );
};
const MONGO_URI = `${process.env.MONGO_URI}`;
const mongoConnect = () => {
  mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
      startServer(4000);
    })
    .catch((error) => {
      console.log(error);
    });
};
exports.mongoConnect = mongoConnect;
(0, exports.mongoConnect)();
//# sourceMappingURL=app.js.map
