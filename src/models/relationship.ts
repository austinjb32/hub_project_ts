import mongoose from "mongoose";
import { Schema } from "mongoose";

const relationshipSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    follower: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
  },
  { timestamps: true },
);

relationshipSchema.index({ user: 1, following: 1 }, { unique: true });

export default mongoose.model("Relationships", relationshipSchema);
