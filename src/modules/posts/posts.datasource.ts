import { IPostSchemaDocument,IPostSchemaModel } from "./posts.model";
import { MongoDataSource } from "apollo-datasource-mongodb";
import { Post } from "../../../__generated__/resolvers-types";
import post from "../../models/post";
import user from "../../models/user";
import { userContext } from "../../libs";

export default class PostDataSource extends MongoDataSource<IPostSchemaDocument>{
    async viewPost(args:string){
        if(!args){
            throw new Error('No input');
        }   

        const post= await this.model.findById(args);

        if(!post){
            throw new Error ('Post not Found');
        }

        



        const formattedPost:Post={
            ...post.toObject(),
            _id:post._id.toString(),
            createdAt:post.createdAt.toString(),
            updatedAt:post.updatedAt.toString(),
        }

        return formattedPost  
    }
    async createPost(postInput:Post,context:userContext){
        if(!postInput){
            throw new Error('No input');
        }   

        const creator = await user.findById(context.userId);

        console.log(context,"hello");

        if(!creator){
            throw new Error('No Creator Found')
        }


        const newPost= new this.model({
            title:postInput.title,
            content:postInput.content,
            imageUrl:postInput.imageUrl,
            creator:creator,
        })

        await newPost.save()

        const formattedPost:Post={
            ...newPost.toObject(),
            _id:newPost._id.toString(),
            createdAt:newPost.createdAt.toString(),
            updatedAt:newPost.updatedAt.toString(),
        }

        return formattedPost  
    }
    }
    