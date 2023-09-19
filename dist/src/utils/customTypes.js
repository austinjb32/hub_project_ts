"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodetoJSON = exports.typeJSON = void 0;
const definition_1 = require("graphql/type/definition");
exports.typeJSON = new definition_1.GraphQLScalarType({
  name: "JSON",
  description: "A JSON Scalar",
  serialize: (value) => {
    return typeof value === "object";
  },
});
function encodetoJSON(search, filter, skip, sort, limit) {
  const OptionsJSON = {
    search: search || null,
    filter: filter,
    skip: skip || 0,
    sort: sort || 0,
    limit: limit || 5,
  };
  const encodeJSON = btoa(JSON.stringify(OptionsJSON));
  return encodeJSON;
}
exports.encodetoJSON = encodetoJSON;
//# sourceMappingURL=customTypes.js.map
