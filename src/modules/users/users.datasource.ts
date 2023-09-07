import { MongoDataSource } from "apollo-datasource-mongodb";
import { IUserSchemaDocument, IUserSchemaModel } from "./users.model"; // Import your User model here
import { AuthData, User } from "../../../__generated__/resolvers-types";
import bcrypt from "bcrypt"; // Import your types here
import jwt from "jsonwebtoken";
import { Request } from "express";



export default class UserDataSource extends MongoDataSource<IUserSchemaDocument> {
  async viewUser(userId: string) {
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

  async login({email,password}:User,context:AuthData) {
    const user = await this.model.findOne({ email: email });
    if (!user) {
      const error = new Error("User already exists");
      throw error;
    }
    if (
      email == null ||
      password == null
    ) {
      const error = new Error("No Input received");
      throw error;
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

    context.token=token

    return { token: token, userId: user._id.toString() };
  }

  async createUser(userInput: User): Promise<User> {
    const user = await this.model.findOne({ email: userInput.email });
    if (user) {
      const error = new Error("User already exists");
      throw error;
    }
    if (
      userInput.email == null ||
      userInput.name == null ||
      userInput.password == null
    ) {
      const error = new Error("No Input received");
      throw error;
    }

    const hashedPassword = await bcrypt.hash(userInput.password!, 12);
    const newUser = new this.model({
      name: userInput.name,
      email: userInput.email,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      ...newUser.toObject(),
      _id: newUser._id.toString(),
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };
  }

  // Add more user-related methods as needed
}
