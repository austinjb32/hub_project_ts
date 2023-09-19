/* eslint-disable @typescript-eslint/ban-types */
import {
	GraphQLResolveInfo,
	GraphQLScalarType,
	GraphQLScalarTypeConfig,
} from "graphql";
import { userContext } from "../src/libs/index";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  JSON: { input: any; output: any };
};

export type Activity = {
  __typename?: "Activity";
  _id?: Maybe<Scalars["ID"]["output"]>;
  track: Scalars["String"]["output"];
  user: Scalars["ID"]["output"];
};

export type AuthData = {
  __typename?: "AuthData";
  refreshToken?: Maybe<Scalars["String"]["output"]>;
  token: Scalars["String"]["output"];
  userId: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  createPost: Post;
  createUser: User;
  deletePost?: Maybe<Scalars["JSON"]["output"]>;
  deleteUser?: Maybe<Scalars["JSON"]["output"]>;
  updatePost: Post;
  updateUser: User;
};

export type MutationCreatePostArgs = {
  data: PostInputData;
};

export type MutationCreateUserArgs = {
  userInput?: InputMaybe<UserCreateData>;
};

export type MutationDeletePostArgs = {
  dataID: Scalars["ID"]["input"];
};

export type MutationDeleteUserArgs = {
  dataID: Scalars["ID"]["input"];
};

export type MutationUpdatePostArgs = {
  data: PostInputData;
  dataID: Scalars["ID"]["input"];
};

export type MutationUpdateUserArgs = {
  dataID: Scalars["ID"]["input"];
  userInfoData?: InputMaybe<UserInputData>;
};

export type Post = {
  __typename?: "Post";
  _id?: Maybe<Scalars["ID"]["output"]>;
  commentCount?: Maybe<Scalars["Int"]["output"]>;
  content: Scalars["String"]["output"];
  createdAt?: Maybe<Scalars["String"]["output"]>;
  creator?: Maybe<User>;
  imageUrl?: Maybe<Scalars["String"]["output"]>;
  isLiked?: Maybe<Scalars["Boolean"]["output"]>;
  likesCount?: Maybe<Scalars["Int"]["output"]>;
  shareCount?: Maybe<Scalars["Int"]["output"]>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["String"]["output"]>;
};

export type Query = {
  __typename?: "Query";
  countPosts?: Maybe<Scalars["Int"]["output"]>;
  countUsers?: Maybe<Scalars["Int"]["output"]>;
  login: AuthData;
  post?: Maybe<Array<Maybe<Post>>>;
  postById?: Maybe<Post>;
  posts?: Maybe<Array<Maybe<Post>>>;
  user?: Maybe<Array<Maybe<User>>>;
  users?: Maybe<Array<Maybe<User>>>;
  viewUserById: User;
};

export type QueryCountPostsArgs = {
  filter?: InputMaybe<Scalars["JSON"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type QueryCountUsersArgs = {
  filter?: InputMaybe<Scalars["JSON"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type QueryLoginArgs = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type QueryPostArgs = {
  filter?: InputMaybe<Scalars["JSON"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type QueryPostByIdArgs = {
  dataID: Scalars["ID"]["input"];
};

export type QueryPostsArgs = {
  filter?: InputMaybe<Scalars["JSON"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type QueryUserArgs = {
  filter?: InputMaybe<Scalars["JSON"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type QueryUsersArgs = {
  filter?: InputMaybe<Scalars["JSON"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["JSON"]["input"]>;
};

export type QueryViewUserByIdArgs = {
  dataID: Scalars["ID"]["input"];
};

export type User = {
  __typename?: "User";
  _id?: Maybe<Scalars["ID"]["output"]>;
  bio?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  followers?: Maybe<Scalars["Int"]["output"]>;
  following?: Maybe<Scalars["Int"]["output"]>;
  imageUrl?: Maybe<Scalars["String"]["output"]>;
  isAdmin?: Maybe<Scalars["Boolean"]["output"]>;
  lastActivity?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  password?: Maybe<Scalars["String"]["output"]>;
  posts?: Maybe<Array<Maybe<Post>>>;
  status?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["String"]["output"]>;
};

export type UserPostsArgs = {
  filter?: InputMaybe<Scalars["String"]["input"]>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  search?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<Scalars["String"]["input"]>;
};

export type UserCreateData = {
  confirmPassword: Scalars["String"]["input"];
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type UserInputData = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  imageUrl?: InputMaybe<Scalars["String"]["input"]>;
  isAdmin?: InputMaybe<Scalars["Boolean"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<Scalars["String"]["input"]>;
};

export type PostInputData = {
  content: Scalars["String"]["input"];
  imageUrl?: InputMaybe<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Activity: ResolverTypeWrapper<Activity>;
  AuthData: ResolverTypeWrapper<AuthData>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  ID: ResolverTypeWrapper<Scalars["ID"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]["output"]>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  User: ResolverTypeWrapper<User>;
  UserCreateData: UserCreateData;
  UserInputData: UserInputData;
  postInputData: PostInputData;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Activity: Activity;
  AuthData: AuthData;
  Boolean: Scalars["Boolean"]["output"];
  ID: Scalars["ID"]["output"];
  Int: Scalars["Int"]["output"];
  JSON: Scalars["JSON"]["output"];
  Mutation: {};
  Post: Post;
  Query: {};
  String: Scalars["String"]["output"];
  User: User;
  UserCreateData: UserCreateData;
  UserInputData: UserInputData;
  postInputData: PostInputData;
}>;

export type ActivityResolvers<
  ContextType = userContext,
  ParentType extends
    ResolversParentTypes["Activity"] = ResolversParentTypes["Activity"],
> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  track?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthDataResolvers<
  ContextType = userContext,
  ParentType extends
    ResolversParentTypes["AuthData"] = ResolversParentTypes["AuthData"],
> = ResolversObject<{
  refreshToken?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface JsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["JSON"], any> {
  name: "JSON";
}

export type MutationResolvers<
  ContextType = userContext,
  ParentType extends
    ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = ResolversObject<{
  createPost?: Resolver<
    ResolversTypes["Post"],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePostArgs, "data">
  >;
  createUser?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    Partial<MutationCreateUserArgs>
  >;
  deletePost?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeletePostArgs, "dataID">
  >;
  deleteUser?: Resolver<
    Maybe<ResolversTypes["JSON"]>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserArgs, "dataID">
  >;
  updatePost?: Resolver<
    ResolversTypes["Post"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePostArgs, "data" | "dataID">
  >;
  updateUser?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, "dataID">
  >;
}>;

export type PostResolvers<
  ContextType = userContext,
  ParentType extends
    ResolversParentTypes["Post"] = ResolversParentTypes["Post"],
> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  commentCount?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType
  >;
  content?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  creator?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  isLiked?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  likesCount?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  shareCount?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = userContext,
  ParentType extends
    ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = ResolversObject<{
  countPosts?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType,
    Partial<QueryCountPostsArgs>
  >;
  countUsers?: Resolver<
    Maybe<ResolversTypes["Int"]>,
    ParentType,
    ContextType,
    Partial<QueryCountUsersArgs>
  >;
  login?: Resolver<
    ResolversTypes["AuthData"],
    ParentType,
    ContextType,
    RequireFields<QueryLoginArgs, "email" | "password">
  >;
  post?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Post"]>>>,
    ParentType,
    ContextType,
    Partial<QueryPostArgs>
  >;
  postById?: Resolver<
    Maybe<ResolversTypes["Post"]>,
    ParentType,
    ContextType,
    RequireFields<QueryPostByIdArgs, "dataID">
  >;
  posts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Post"]>>>,
    ParentType,
    ContextType,
    Partial<QueryPostsArgs>
  >;
  user?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType,
    Partial<QueryUserArgs>
  >;
  users?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType,
    Partial<QueryUsersArgs>
  >;
  viewUserById?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<QueryViewUserByIdArgs, "dataID">
  >;
}>;

export type UserResolvers<
  ContextType = userContext,
  ParentType extends
    ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes["ID"]>, ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  createdAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  followers?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  following?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  isAdmin?: Resolver<Maybe<ResolversTypes["Boolean"]>, ParentType, ContextType>;
  lastActivity?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  posts?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Post"]>>>,
    ParentType,
    ContextType,
    Partial<UserPostsArgs>
  >;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updatedAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = userContext> = ResolversObject<{
  Activity?: ActivityResolvers<ContextType>;
  AuthData?: AuthDataResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;
