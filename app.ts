import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ApolloServerPluginInlineTrace } from "@apollo/server/plugin/inlineTrace";
import { Modules } from "./src/modules";
import http from "http";
import {
  getPostFromUserIDLoader,
  getPostLoader,
} from "./src/modules/posts/posts.dataLoaders";
import { getUserLoader } from "./src/modules/users/users.dataLoader";
import { CacheService } from "./src/utils/redisService";
import { userContext } from "./src/libs";
// import { redisClient } from "./src/middleware/Cache/redisCache";

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<userContext>({
  schema: Modules.schemas,
  csrfPrevention: true,
  introspection: true,
  status400ForVariableCoercionErrors: true,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginInlineTrace(),
  ],
  formatError: (error) => {
    if (error instanceof SyntaxError) {
      // Check if the error is an instance of UserInputError
      throw new Error("Syntax Failed"); // Throw a custom error message
    }
    return error; // Return the original error if it's not a UserInputError
  },
});

const startServer = async (listenOptions: number) => {
  const redisClient = await CacheService.start({
    redis_port: 8080,
    redis_host: "localhost",
  });
  await server.start().then(() => {
    httpServer.listen({ port: listenOptions });
    console.log(`🚀 Server ready at http://localhost:${listenOptions}/graphql`);
  });
  app.use(
    "/graphql",
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<userContext> => ({
        dataSource: Modules.dataSource,
        accessToken: req.headers.authorization,
        userLoaders: getUserLoader(),
        postLoaders: getPostLoader(),
        postfromIDLoaders: getPostFromUserIDLoader(),
        redisClient: redisClient,
        models: Modules.models,
        userId: "",
        deviceClient: "",
      }),
    }),
  );
};

const MONGO_URI = `${process.env.MONGO_URI}`;

export const mongoConnect = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      startServer(4000);
    })
    .catch((error) => {
      console.log(error);
    });
};

mongoConnect();
