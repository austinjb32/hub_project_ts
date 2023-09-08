"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const statusSchema = new mongoose_2.Schema({
    userId: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "Users",
        required: true, // Set to true if 'user' is a required field
    },
    status: {
        type: String,
        required: true, // Set to true if 'activity' is a required field
    },
}, { timestamps: true, expires: 86400 });
exports.default = mongoose_1.default.model("User Status", statusSchema);
//# sourceMappingURL=userStatus.js.map