import { buildSubgraphSchema } from "@apollo/subgraph";
import { GraphQLDateTime, GraphQLJSON } from "graphql-scalars";

import path from "path";
import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import userModel from "../modules/users/users.model";
import UserDataSource from "./users/users.datasource";
import { TModule } from "../libs";
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



export const Modules:TModule = {
  
    models:{
      userModel:userModel
    },

    schemas:
          buildSubgraphSchema({
            typeDefs: typeDefs,
            resolvers: {
              ...resolvers,
              ...{ JSON: GraphQLJSON },
              ...{ DateTime: GraphQLDateTime },
            },
          }),
    
          dataSource:{
            userModelDataSource:new UserDataSource(userModel)
          }
        
      
 
  };
  