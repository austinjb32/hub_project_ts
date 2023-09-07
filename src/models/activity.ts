import mongoose from "mongoose";
import { Schema } from "mongoose";

const activitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true, // Set to true if 'user' is a required field
  },
  track: {
    activity: {
      type: String,
      required: true, // Set to true if 'activity' is a required field
    },
  },
}, { timestamps: true });

export default mongoose.model("Activity", activitySchema);
