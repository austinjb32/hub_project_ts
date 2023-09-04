"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const messageSchema = new mongoose_2.Schema({
    messageType: {
        type: String,
        enum: ['Text', 'Image', 'File'],
        required: true,
        default: 'Text'
    },
    content: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        enum: ['Sent', 'Received'],
        default: 'Sent'
    },
    creator: {
        type: mongoose_2.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    receiver: {
        type: mongoose_2.Schema.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    attachment: {
        type: String,
        default: null
    }
}, { timestamps: true });
exports.default = mongoose_1.default.model("Messages", messageSchema);
//# sourceMappingURL=message.js.map