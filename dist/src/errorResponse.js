"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  const errorResponse = {
    message: message,
  };
  if (data) {
    errorResponse.data = data;
  }
  res.status(status).json(errorResponse);
};
exports.default = errorHandler;
//# sourceMappingURL=errorResponse.js.map
