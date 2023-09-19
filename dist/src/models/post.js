"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const postSchema = new mongoose_2.Schema(
  {
    title: {
      type: String,
      default: null,
      required: true,
    },
    content: {
      type: String,
      default: null,
      required: true,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    creator: {
      type: mongoose_2.Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    imageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);
exports.default = mongoose_1.default.model("Posts", postSchema);
//# sourceMappingURL=post.js.map
