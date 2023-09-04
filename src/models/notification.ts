import mongoose from "mongoose";
import { Schema } from "mongoose";

const notificationSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    content:{
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export default mongoose.model("Notifications",notificationSchema);