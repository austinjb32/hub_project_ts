import { Resolvers } from "../../../__generated__/resolvers-types";

export default {
    Query: {
      viewUser: async (_, args, context) => {
        // Call the getUserById method of the UserDataSource
        return context.dataSource.userDataSource.getUserById(args.userID);
      },
    },
    Mutation: {
      createUser: async (_, { userInput }, { dataSources }) => {
        // Call the createUser method of the UserDataSource
        return dataSources.userDataSource.createUser(userInput);
      },
    },
  } as Resolvers;
  
