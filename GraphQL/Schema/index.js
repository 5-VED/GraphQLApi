const { makeExecutableSchema } = require("@graphql-tools/schema");
const {
  constraintDirective,
  constraintDirectiveTypeDefs,
} = require("graphql-constraint-directive");
const merge = require("lodash.merge");
const user = require("./users");
const room = require("./rooms");
const typeDefs = [user.typeDefs,room.typeDefs];
const resolvers = merge(user.resolvers,room.resolvers)

const schema = makeExecutableSchema({
  typeDefs: [constraintDirectiveTypeDefs, typeDefs],
  resolvers: resolvers,
  schemaTransforms: [constraintDirective()],
});

module.exports = { schema };
