import { Document, Schema, Model, model } from "mongoose";

export interface IPostSchemaDocument extends Document{
    title: String;
    content: String;
    imageUrl: String;
    creator: Object;
    shareCount:Number;
    createdAt: String;
    updatedAt: String;
}

export type IPostDocument = Document<IPostSchemaDocument>;

export interface IPostSchemaModel
    extends Model<IPostSchemaDocument>{}

    const postSchema=new Schema<
    IPostSchemaDocument,
    IPostSchemaModel
    >({
        title:{
            type:String,
            default:null,
            required:true
        },
        content:{
            type:String,
            default:null,
            required:true
        },
        shareCount:{
            type:Number,
            default:0,
        },
        creator:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:"Users"
        },
        imageUrl:{
            type:String,
            default:null
        }
    
    },
    {timestamps:true})

    const postModel= model<
    IPostSchemaDocument,
    IPostSchemaModel
    >('Post',postSchema)

    export default postModel;