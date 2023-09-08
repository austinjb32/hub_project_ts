"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
exports.person = joi_1.default.object()
    .keys({
    name: joi_1.default.string()
        .min(3)
        .max(40)
        .required(),
    age: joi_1.default.number()
        .integer()
        .min(16)
});
//# sourceMappingURL=validation.js.map