import mongoose from "mongoose";
import { Schema } from "mongoose";

const statusSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true, // Set to true if 'user' is a required field
  },
  status: {
      type: String,
      required: true, // Set to true if 'activity' is a required field
  },
}, { timestamps: true, expires:86400 });

export default mongoose.model("User Status", statusSchema);
