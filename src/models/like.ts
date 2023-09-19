import mongoose from "mongoose";
import { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    type: {
      enum: ["Post", "Comment"],
      type: String,
      default: "Post",
    },
    typeID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true },
);

likeSchema.index({ typeID: 1, user: 1 }, { unique: true });

export default mongoose.model("Likes", likeSchema);
