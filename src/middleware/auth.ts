import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../__generated__/resolvers-types";
import { userContext } from "../libs";
import Users from "../models/user";
import { Resolver } from "dns";

interface JWTPayload{
  userId:String,
  email:String,
}


export const isAuthenticated=  () => (next: (root: any,args: any,context: any,info: any) => any) => async (root: any, args: any, context: { accessToken: string, userId:String  }, info: any) => {
  if (!context.accessToken) {
    throw new Error('You are not authenticated!');
  }

  const decodedToken = jwt.verify(context.accessToken, 'somesupersecretsecret') as JWTPayload;

  const foundUser= await Users.findById(decodedToken.userId)

  if(!foundUser){
    throw new Error('No User Found');
  }

  const formattedUser:User= {...foundUser, _id:foundUser?._id.toString(), createdAt:foundUser?.createdAt.toISOString(),
  updatedAt:foundUser?.updatedAt.toISOString()}
 
  context.userId=formattedUser._id!.toString()

  return next(root,args,context,info);
};
 
export const isAdmin = () => (next: (root: any,args: any,context: any,info: any) => any) => async (root: any, args: any, context:{ accessToken: string, userId:String }, info: any) => {

  if (!context.accessToken) {
    throw new Error('You are not authenticated!');
  }

  const decodedToken = jwt.verify(context.accessToken, 'somesupersecretsecret') as JWTPayload;

  const foundUser= await Users.findById(decodedToken.userId)

  if(!foundUser){
    throw new Error('No User Found');
  }

  if(!foundUser.isAdmin){
    throw new Error('Need Admin Access')
  }

  const formattedUser:User= {...foundUser, _id:foundUser?._id.toString(), createdAt:foundUser?.createdAt.toISOString(),
    updatedAt:foundUser?.updatedAt.toISOString()}

    context.userId=formattedUser._id!.toString()

    return next(root,args,context,info);
};


