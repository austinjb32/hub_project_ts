"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeJSON = void 0;
const definition_1 = require("graphql/type/definition");
exports.typeJSON = new definition_1.GraphQLScalarType({
    name: "JSON",
    description: "A JSON Scalar",
    serialize: value => { return typeof (value) === "object"; }
});
//# sourceMappingURL=customTypes.js.map