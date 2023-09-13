
import { getPostLoader} from "../modules/posts/posts.dataLoaders";
import PostDataSource from "../modules/posts/posts.datasource";
import { IPostSchemaModel } from "../modules/posts/posts.model";
import { getUserLoader } from "../modules/users/users.dataLoader";
import UserDataSource from "../modules/users/users.datasource";
import { IUserSchemaModel } from "../modules/users/users.model";
import { GraphQLSchema } from "graphql";


export type TModelContext = {
    userModel:IUserSchemaModel
    postModel:IPostSchemaModel

  };
  export type TDataSourceContext = {
    userModelDataSource:UserDataSource
    postModelDataSource:PostDataSource
  };



  export interface userContext {
    accessToken: string | undefined;
    userId:string| undefined;
    userLoaders:ReturnType<typeof getUserLoader>;
    postLoaders:ReturnType<typeof getPostLoader>;
    redisClient:any;
    // me: Nullable<JWTPayload>;
    models: TModelContext;
    dataSource: TDataSourceContext;
  }


  export type TModule = {
    models: TModelContext;
    dataSource: TDataSourceContext;
    schemas: GraphQLSchema;
  };