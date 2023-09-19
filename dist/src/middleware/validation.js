"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUpdationValidation =
  exports.postCreationValidation =
  exports.userCreationValidation =
  exports.loginValidation =
    void 0;
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const loginValidation = (login) => {
  const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).max(30).required(),
  });
  return loginSchema.validate(login);
};
exports.loginValidation = loginValidation;
const userCreationValidation = (user) => {
  const userCreateSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9@#]{3,30}$"))
      .min(8)
      .max(30)
      .required(),
    confirmPassword: joi_1.default.ref("password"),
    name: joi_1.default.string().min(3).required(),
  });
  return userCreateSchema.validate(user);
};
exports.userCreationValidation = userCreationValidation;
const postCreationValidation = (post) => {
  const postCreateSchema = joi_1.default.object({
    title: joi_1.default.string().min(3).max(30).required(),
    content: joi_1.default.string().min(8).max(30).required(),
    imageUrl: joi_1.default.string().min(3),
  });
  return postCreateSchema.validate(post);
};
exports.postCreationValidation = postCreationValidation;
const postUpdationValidation = (postEdit) => {
  const postUpdateSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    title: joi_1.default.string().min(3).max(30).required(),
    content: joi_1.default.string().min(8).max(30).required(),
    imageUrl: joi_1.default.string().min(3),
  });
  return postUpdateSchema.validate(postEdit);
};
exports.postUpdationValidation = postUpdationValidation;
//# sourceMappingURL=validation.js.map
