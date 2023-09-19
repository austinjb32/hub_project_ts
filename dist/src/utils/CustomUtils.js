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
function encodetoJSON(args) {
  const OptionsJSON = {
    ...args,
    search: args.search,
    filter: args.filter,
    skip: args.skip || 0,
    sort: args.sort || 0,
    limit: args.limit,
  };
  const encodeJSON = btoa(JSON.stringify(OptionsJSON));
  return encodeJSON;
}
exports.encodetoJSON = encodetoJSON;
//# sourceMappingURL=CustomUtils.js.map
