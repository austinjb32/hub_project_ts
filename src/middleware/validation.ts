import Joi from 'joi';
import { Post, User } from '../../__generated__/resolvers-types';

export const loginValidation=(login:{email:string,password:string})=>{

    const loginSchema=Joi.object({
      email:Joi.string().email().required(),
      password:Joi.string().min(8).max(30).required()
    });

    return loginSchema.validate(login);
}

export const userCreationValidation=(user:Object)=>{

  const userCreateSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9@#]{3,30}$')).min(8).max(30).required(),
    confirmPassword:Joi.ref('password'),
    name:Joi.string().min(3).required()
  });

  return userCreateSchema.validate(user);
}

export const postCreationValidation=(post:Post)=>{

  const postCreateSchema=Joi.object({
    title:Joi.string().min(3).max(30).required(),
    content:Joi.string().min(8).max(30).required(),
    imageUrl:Joi.string().min(3)
  });

  return postCreateSchema.validate(post);
}