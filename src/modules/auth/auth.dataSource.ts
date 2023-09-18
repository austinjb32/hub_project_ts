import { MongoDataSource } from "apollo-datasource-mongodb";
import { AuthData, User, UserCreateData } from "../../../__generated__/resolvers-types";
import { loginValidation, userCreationValidation } from "../../middleware/Validation/validation";
import activity from "../../models/activity";
import { IUserSchemaDocument } from "../users/users.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthDataSource extends MongoDataSource<IUserSchemaDocument> {

    async login({email,password}:any,context:AuthData) {
        const user = await this.model.findOne({ email: email }).exec();
        if (!user) {
          const error = new Error("No User Found");
          throw error;
        }

        console.log(user,email,password)
        
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
    
       const  lastData="User Logged In"
        
        const updateActivity= new activity({
          userId:user._id,
          track:[{activity:lastData}],
          lastActivity:lastData
        })
    
        updateActivity.save()
    
        return { token: token, userId: user._id.toString(),refreshToken:refreshToken };
      }
    

async createUser(userInput:UserCreateData,context:any): Promise<User> {
  
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

   await context.redisClient.client.HSET('users',`${userInput}`,JSON.stringify(newUser));

   const  lastData="User Created"
    
   const updateActivity= new activity({
     userId:newUser._id,
     track:[{activity:lastData}],
     lastActivity:lastData
   })

   updateActivity.save()

    return {
      ...newUser.toObject(),
      _id: newUser._id.toString(),
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
    };
  }
}