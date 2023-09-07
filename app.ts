import express, { NextFunction } from "express";
import bodyParser from "body-parser";
import errorHandler from "./src/errorResponse";
import mongoose from "mongoose";
import { ApolloServer} from "apollo-server-express";
import { Modules } from './src/modules';
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled";
import {ApolloServerPluginUsageReporting} from "@apollo/server/plugin/usageReporting"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { Module } from "module";
import { userContext } from "./src/libs";
import http from 'http';
import { Request } from "express";
import jwt from 'jsonwebtoken';

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
      accessToken:req.headers.authorization
     }),
})


  


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
