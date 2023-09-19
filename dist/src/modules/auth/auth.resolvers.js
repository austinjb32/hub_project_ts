"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
  Query: {
    login: async (_, args, context) => {
      // Access args
      // Call the getUserById method of the UserDataSource
      return context.dataSource.authModelDataSource.login(args, context);
    },
  },
  Mutation: {
    createUser: async (_, args, context) => {
      // Call the createUser method of the UserDataSource.
      return context.dataSource.authModelDataSource.createUser(
        args.userInput,
        context,
      );
    },
  },
};
//# sourceMappingURL=auth.resolvers.js.map
