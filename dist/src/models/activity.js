"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const activitySchema = new mongoose_2.Schema({
    userId: {
        type: mongoose_2.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model("Activity", activitySchema);
//# sourceMappingURL=activity.js.map