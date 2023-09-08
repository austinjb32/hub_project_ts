"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoader = void 0;
const tslib_1 = require("tslib");
const dataloader_1 = tslib_1.__importDefault(require("dataloader"));
const users_model_1 = tslib_1.__importDefault(require("./users.model"));
exports.userLoader = new dataloader_1.default(async (ids) => {
    const users = await users_model_1.default.find({ _id: { $in: ids } });
    // Create a map of user IDs to user documents
    const userMap = {};
    users.forEach((user) => {
        userMap[user._id] = user;
    });
    // Map the IDs to user documents, maintaining the order
    return ids.map((id) => userMap[id]);
});
//# sourceMappingURL=users.dataLoader.js.map