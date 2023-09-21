import { Modules } from "../modules";
import { getUserLoader } from "../modules/users/users.dataLoader";
import {
  getPostLoader,
  getPostFromUserIDLoader,
} from "../modules/posts/posts.dataLoaders";
import { TDataSourceContext } from ".";
import { CacheService } from "../utils/redisService";

export interface MockUserContext {
  dataSource: TDataSourceContext;
  accessToken: string;
  userLoaders: ReturnType<typeof getUserLoader>;
  postLoaders: ReturnType<typeof getPostLoader>; // Define DataLoader types as needed
  postfromIDLoaders: ReturnType<typeof getPostFromUserIDLoader>; // Define DataLoader types as needed
  redisClient: typeof CacheService;
}

export const mockUserContext: () => MockUserContext = () => {
  return {
    dataSource: Modules.dataSource,
    accessToken: "hello",
    userLoaders: getUserLoader(),
    postLoaders: getPostLoader(),
    postfromIDLoaders: getPostFromUserIDLoader(),
    redisClient: CacheService,
  };
};
