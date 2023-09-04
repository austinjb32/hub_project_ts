import mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchema=new Schema({
    messageType:{
        type:String,
        enum:['Text','Image','File'],
        required:true,
        default:'Text'
    },
    content:{
        type:String,
        default:null,
    },
    status:{
        type:String,
        enum:['Sent', 'Received'],
        default:'Sent'
    },
    creator:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Users"
    },
    receiver:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Users"
    },
    attachment:{
        type:String,
        default:null
    }

},
{timestamps:true})

export default mongoose.model("Messages",messageSchema);