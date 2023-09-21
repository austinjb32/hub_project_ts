import mongoose from "mongoose";
import TestApolloServer from "../../../__tests__/helpers/testServer";
import { expect } from "chai";
import { get } from "lodash";
import { mockUserContext } from "../../../__tests__/mock/mockContext";

export const loginAdmin = async (server: TestApolloServer) => {
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

  const refinedResult = get(result, "data.login");
  const refinedError = get(result, "errors");

  // Assuming "jobs" is the collection where you want to insert the result
  const { collections } = mongoose.connection;
  const refreshCollection = collections["users"];
  await refreshCollection.insertOne(refinedResult!);

  expect(refinedError).to.be.undefined;
  expect(refinedResult).to.have.property("token");
  expect(refinedResult).to.have.property("refreshToken");

  return;
};
