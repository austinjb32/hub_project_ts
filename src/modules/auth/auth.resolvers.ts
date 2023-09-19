import { userContext } from "../../libs";

export default {
  Query: {
    login: async (_: any, args: any, context: userContext) => {
      // Access args
      // Call the getUserById method of the UserDataSource
      return context.dataSource.authModelDataSource.login(
        args as any,
        context as any,
      );
    },
  },
  Mutation: {
    createUser: async (_: any, args: any, context: userContext) => {
      // Call the createUser method of the UserDataSource.
      return context.dataSource.authModelDataSource.createUser(
        args.userInput as any,
        context,
      );
    },
  },
};
