import { MongoDataSource } from 'apollo-datasource-mongodb';
import { IUserSchemaDocument,IUserSchemaModel } from './users.model'; // Import your User model here
import { User } from '../../../__generated__/resolvers-types'; // Import your types here

export default class UserDataSource extends MongoDataSource<IUserSchemaDocument> {
    async getUserById(userId: string): Promise<User | null> {
        const user = await this.model.findById(userId).lean().exec();
      
        if (!user) {
            console.log("0");
          return null;
        }
      
        console.log(user);
        // Convert isAdmin to Maybe<string> or undefined
        const isAdmin: string | undefined =
          typeof user.isAdmin === 'boolean' ? (user.isAdmin ? 'true' : 'false') : user.isAdmin;
      
          console.log("1");
        // Map the Date fields to strings
        const userWithFormattedDates: User = {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
          isAdmin
        };
        console.log("2");
      
        return userWithFormattedDates;
      }
      
      

  async createUser(userInput: User): Promise<User> {
    const user = new this.model(userInput);
    await user.save();
    return user.toObject();
  }

  // Add more user-related methods as needed
}
