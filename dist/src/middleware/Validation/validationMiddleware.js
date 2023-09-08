"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(422)
            .send(error.details[0].message);
    }
    else {
        next();
    }
};
exports.validate = validate;
//# sourceMappingURL=validationMiddleware.js.map