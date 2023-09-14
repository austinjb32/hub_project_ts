import { MongoDataSource } from "apollo-datasource-mongodb";
import { IUserSchemaDocument} from "./users.model"; // Import your User model here
import { AuthData, User } from "../../../__generated__/resolvers-types";
import bcrypt from "bcrypt"; // Import your types here
import jwt from "jsonwebtoken";
import { loginValidation, userCreationValidation } from "../../middleware/Validation/validation";


export default class UserDataSource extends MongoDataSource<IUserSchemaDocument> {
  async viewUser(userId: string,context:any) {
    const user = await context.userLoaders.load(userId);
    if (!user) {
      return null;
    }

 
    return {
      ...user._doc,
      _id:user._id.toString(),
      name:user.name.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      isAdmin:user.isAdmin,
    };
  }

  async getUserById(userId: string) {
    const user = await this.model.findById(userId).lean().exec();
    if (!user) {
      return null;
    }
 
    return {
      ...user,
      _id:user._id.toString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      isAdmin:user.isAdmin,
    };
  }

  async login({email,password}:any,context:AuthData) {
    const user = await this.model.findOne({ email: email }).exec();
    if (!user) {
      const error = new Error("User already exists");
      throw error;
    }
    
    const validLogin= loginValidation({email,password})

    if(validLogin.error){
      throw new Error(`${validLogin.error.name}${validLogin.error.message}`);
    }

    const hashedPassword = bcrypt.compareSync(
      password,
      user.password
    );
    if (!hashedPassword) {
      throw new Error("Wrong Password");
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    let refreshToken;

    if(user.isAdmin){
      refreshToken = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        "somesupersecretsecret",
        { expiresIn: "30d" }
        
      );
      context.refreshToken=refreshToken
      

    console.log(refreshToken);
    }

   

    context.token=token
    

    return { token: token, userId: user._id.toString(),refreshToken:refreshToken };
  }

  async createUser(userInput:any,context:any): Promise<User> {
  
    const validCreation= userCreationValidation(userInput)


    if(validCreation.error){
      throw new Error(`${validCreation.error.name}${validCreation.error.message}`);
    }

    const user = await this.model.findOne({ email: userInput.email });
    if (user) {
      const error = new Error("User already exists");
      throw error;
    }

    const hashedPassword = await bcrypt.hash(userInput.password!, 12);
    const newUser = new this.model({
      name: userInput.name,
      email: userInput.email,
      password: hashedPassword,
    });

    await newUser.save();

    let dataStore= await context.redisClient.HSET('post',`${userInput}`,JSON.stringify(newUser));

    return {
      ...newUser.toObject(),
      _id: newUser._id.toString(),
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };
  }

  // Add more user-related methods as needed
}
