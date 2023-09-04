import UserDataSource from "../modules/users/users.datasource";
import { IUserSchemaModel } from "../modules/users/users.model";
import { GraphQLSchema } from "graphql";


export type TModelContext = {
    userModel:IUserSchemaModel
  };
  export type TDataSourceContext = {
    userModelDataSource:UserDataSource
  };

  export interface userContext {
    isMHAdmin: boolean;
    accessToken: string | undefined;
    // me: Nullable<JWTPayload>;
    models: TModelContext;
    dataSources: TDataSourceContext;
  }
  export type TModule = {
    models: TModelContext;
    dataSource: TDataSourceContext;
    schemas: GraphQLSchema;
  };