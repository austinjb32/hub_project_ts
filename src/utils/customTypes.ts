import { GraphQLScalarType } from "graphql/type/definition";


export const typeJSON = new GraphQLScalarType({
    name: "JSON",
    description: "A JSON Scalar",
    serialize: value => {return typeof(value)==="object"}
  });

