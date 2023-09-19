import mongoose from "mongoose";
import { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      required: true,
      type: String,
      default: null,
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Posts",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Comments", commentSchema);
