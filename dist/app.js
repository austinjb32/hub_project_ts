"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const errorResponse_1 = tslib_1.__importDefault(require("./src/errorResponse"));
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const apollo_server_express_1 = require("apollo-server-express");
const modules_1 = require("./src/modules");
const http_1 = tslib_1.__importDefault(require("http"));
const posts_dataLoaders_1 = require("./src/modules/posts/posts.dataLoaders");
const users_dataLoader_1 = require("./src/modules/users/users.dataLoader");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
app.use(errorResponse_1.default);
const server = new apollo_server_express_1.ApolloServer({
    schema: modules_1.Modules.schemas,
    csrfPrevention: true,
    introspection: true,
    context: async ({ req }) => ({
        dataSource: modules_1.Modules.dataSource,
        accessToken: req.headers.authorization,
        userLoaders: (0, users_dataLoader_1.getUserLoader)(),
        postLoaders: (0, posts_dataLoaders_1.getPostLoader)()
    }),
    formatError: (error) => {
        if (error instanceof apollo_server_express_1.UserInputError) { // Check if the error is an instance of UserInputError
            throw new Error('User Input error occurred'); // Throw a custom error message
        }
        if (error instanceof apollo_server_express_1.ValidationError) { // Check if the error is an instance of UserInputError
            throw new Error('Validation Failed'); // Throw a custom error message
        }
        if (error instanceof apollo_server_express_1.AuthenticationError) { // Check if the error is an instance of UserInputError
            throw new Error('Authentication Failed'); // Throw a custom error message
        }
        if (error instanceof apollo_server_express_1.SyntaxError) { // Check if the error is an instance of UserInputError
            throw new Error('Syntax Failed'); // Throw a custom error message
        }
        return error; // Return the original error if it's not a UserInputError
    },
});
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.pubnynq.mongodb.net/${process.env.MONGO_DB}`;
const startServer = async function () {
    await server.start();
    server.applyMiddleware({ app });
    mongoose_1.default
        .connect(MONGO_URI)
        .then((result) => {
        app.listen({ port: 4000 }, () => {
            console.log("Server running on port 4000 http://localhost:4000/graphql");
        });
    })
        .catch((error) => {
        console.log(error);
    });
};
startServer();
//# sourceMappingURL=app.js.map