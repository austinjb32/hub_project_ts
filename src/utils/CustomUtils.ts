import { GraphQLScalarType } from "graphql/type/definition";


export const typeJSON = new GraphQLScalarType({
    name: "JSON",
    description: "A JSON Scalar",
    serialize: value => {return typeof(value)==="object"}
  });


export function encodetoJSON(args:any){
    const OptionsJSON={...args,
        search:args.search,
        filter:args.filter,
        skip:args.skip||0,
      sort:args.sort||0,
    limit:args.limit,}
    
    const encodeJSON= btoa(JSON.stringify(OptionsJSON))
    return encodeJSON
}
