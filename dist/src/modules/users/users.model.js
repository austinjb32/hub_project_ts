"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const isEmail_1 = tslib_1.__importDefault(require("validator/lib/isEmail"));
const userSchema = new mongoose_1.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: isEmail_1.default,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 30,
    },
    bio: {
      type: String,
      default: "No Bio",
      minlength: 5,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);
// Create the User model
const UserModel = (0, mongoose_1.model)("User", userSchema);
exports.default = UserModel;
//# sourceMappingURL=users.model.js.map
