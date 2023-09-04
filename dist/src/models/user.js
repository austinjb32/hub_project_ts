"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    email: {
        required: true,
        type: String,
        unique: true,
        index: true,
    },
    password: {
        required: true,
        type: String,
    },
    name: {
        required: true,
        type: String,
        max: 30
    },
    bio: {
        type: String,
        default: "No Bio",
        min: 10
    },
    imageUrl: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    posts: [{
            type: Schema.Types.ObjectId,
            ref: "Post"
        }]
}, { timestamps: true });
exports.default = mongoose_1.default.model('Users', userSchema);
//# sourceMappingURL=user.js.map