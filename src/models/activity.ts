import mongoose from "mongoose";
import { Schema } from "mongoose";

const activitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  track: [{
    activity: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Default value for createdAt
    },
  }],
  lastActivity: {
    type: String,
    required: true,
  },
  lastUpdated:{
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
