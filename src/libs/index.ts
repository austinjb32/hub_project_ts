
import { getPostFromUserIDLoader, getPostLoader} from "../modules/posts/posts.dataLoaders";
import PostDataSource from "../modules/posts/posts.datasource";
import { IPostSchemaModel } from "../modules/posts/posts.model";
import { getUserLoader } from "../modules/users/users.dataLoader";
import UserDataSource from "../modules/users/users.datasource";
import { IUserSchemaModel } from "../modules/users/users.model";
import { GraphQLSchema } from "graphql";
import { CacheService } from "../utils/redisService";
import AuthDataSource from "../modules/auth/auth.dataSource";


export type TModelContext = {
    userModel:IUserSchemaModel
    postModel:IPostSchemaModel

  };
  export type TDataSourceContext = {
    userModelDataSource:UserDataSource
    postModelDataSource:PostDataSource
    authModelDataSource:AuthDataSource
  };



  export interface userContext {
    accessToken: string | undefined;
    userId:string| undefined;
    userLoaders:ReturnType<typeof getUserLoader>;
    postfromIDLoaders:ReturnType<typeof getPostLoader>;
    postLoaders:ReturnType<typeof getPostFromUserIDLoader>;
    redisClient:any;
    deviceClient:any;
    // me: Nullable<JWTPayload>;
    models: TModelContext;
    dataSource: TDataSourceContext;
  }


  export type TModule = {
    models: TModelContext;
    dataSource: TDataSourceContext;
    schemas: GraphQLSchema;
  };