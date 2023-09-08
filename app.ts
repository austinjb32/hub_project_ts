import express, { NextFunction } from "express";
import bodyParser from "body-parser";
import errorHandler from "./src/errorResponse";
import mongoose from "mongoose";
import { ApolloServer,AuthenticationError,SyntaxError,UserInputError, ValidationError} from "apollo-server-express";
import { Modules } from './src/modules';
import http from 'http';
import { error } from "console";

const app = express();
const httpServer = http.createServer(app);

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(errorHandler);



const server=new ApolloServer({
    schema:Modules.schemas,
    csrfPrevention:true,
    introspection:true,
    context: async ({req}) => ({ 
      dataSource:Modules.dataSource,
      accessToken:req.headers.authorization,
      loaders:true
     }),
     formatError: (error) => { // Use error as a parameter
      if (error instanceof UserInputError) { // Check if the error is an instance of UserInputError
        throw new Error('User Input error occurred'); // Throw a custom error message
      }
      if (error instanceof ValidationError) { // Check if the error is an instance of UserInputError
        throw new Error('Validation Failed'); // Throw a custom error message
      }
      if (error instanceof AuthenticationError) { // Check if the error is an instance of UserInputError
        throw new Error('Authentication Failed'); // Throw a custom error message
      }
      if (error instanceof SyntaxError) { // Check if the error is an instance of UserInputError
        throw new Error('Syntax Failed'); // Throw a custom error message
      }
      
      // Handle other errors here if needed
      return error; // Return the original error if it's not a UserInputError
    },
  });


  


const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.pubnynq.mongodb.net/${process.env.MONGO_DB}`;

const startServer= async function(){
  await server.start()
  server.applyMiddleware({app})
  mongoose
  .connect(MONGO_URI)
  .then((result) => {
    app.listen({port:4000}, () => {
      console.log("Server running on port 4000 http://localhost:4000/graphql");
    });
  })
  .catch((error) => {
    console.log(error);
  });

}

startServer();
