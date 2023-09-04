"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const likeSchema = new mongoose_2.Schema({
    type: {
        enum: ['Post', 'Comment'],
        type: String,
        default: 'Post'
    },
    typeID: {
        type: mongoose_2.Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
}, { timestamps: true });
likeSchema.index({ typeID: 1, user: 1 }, { unique: true });
exports.default = mongoose_1.default.model("Likes", likeSchema);
//# sourceMappingURL=like.js.map