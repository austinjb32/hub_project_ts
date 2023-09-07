"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        default: null,
        required: true
    },
    content: {
        type: String,
        default: null,
        required: true
    },
    shareCount: {
        type: Number,
        default: 0,
    },
    creator: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    imageUrl: {
        type: String,
        default: null
    }
}, { timestamps: true });
const postModel = (0, mongoose_1.model)('Post', postSchema);
exports.default = postModel;
//# sourceMappingURL=posts.model.js.map