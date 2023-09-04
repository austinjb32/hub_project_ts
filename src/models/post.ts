import mongoose from "mongoose";
import { Schema } from "mongoose";

const postSchema=new Schema({
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

export default mongoose.model("Posts",postSchema);