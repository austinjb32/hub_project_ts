/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserLoader = void 0;
const tslib_1 = require("tslib");
const dataloader_1 = tslib_1.__importDefault(require("dataloader"));
const users_model_1 = tslib_1.__importDefault(require("./users.model"));
const getUserbyId = async (id) => {
  const user = await users_model_1.default.findById(id);
  return user;
};
const getUserLoader = () =>
  new dataloader_1.default(async (userIds) => {
    return userIds.map((id) => getUserbyId(id));
  });
exports.getUserLoader = getUserLoader;
//# sourceMappingURL=users.dataLoader.js.map
