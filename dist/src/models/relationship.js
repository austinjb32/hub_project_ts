"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const relationshipSchema = new mongoose_2.Schema({
    user: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    following: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "Users",
        default: null
    },
    follower: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "Users",
        default: null
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Relationships", relationshipSchema);
//# sourceMappingURL=relationship.js.map