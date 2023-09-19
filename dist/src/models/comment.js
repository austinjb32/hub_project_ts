"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const commentSchema = new mongoose_2.Schema(
  {
    content: {
      required: true,
      type: String,
      default: null,
    },
    post: {
      type: mongoose_2.Schema.Types.ObjectId,
      required: true,
      ref: "Posts",
    },
    user: {
      type: mongoose_2.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true },
);
exports.default = mongoose_1.default.model("Comments", commentSchema);
//# sourceMappingURL=comment.js.map
