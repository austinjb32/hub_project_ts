"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = tslib_1.__importDefault(require("mongoose"));
const chai_1 = require("chai");
const lodash_1 = require("lodash");
const loginAdmin = async (server) => {
  const LOGIN_QUERY = `
    query Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        refreshToken
        token
        userId
      }
    }
  `;
  const LOGIN_VARIABLES = {
    email: "admin@gmail.com",
    password: "123@Gmail",
  };
  const result = await server.apollo.executeOperation({
    query: LOGIN_QUERY,
    variables: LOGIN_VARIABLES,
  });
  const refinedResult = (0, lodash_1.get)(result, "data.login");
  const refinedError = (0, lodash_1.get)(result, "errors");
  // Assuming "jobs" is the collection where you want to insert the result
  const { collections } = mongoose_1.default.connection;
  const refreshCollection = collections["users"];
  await refreshCollection.insertOne(refinedResult);
  (0, chai_1.expect)(refinedError).to.be.undefined;
  (0, chai_1.expect)(refinedResult).to.have.property("token");
  (0, chai_1.expect)(refinedResult).to.have.property("refreshToken");
  return;
};
exports.loginAdmin = loginAdmin;
//# sourceMappingURL=login.test.helper.js.map
