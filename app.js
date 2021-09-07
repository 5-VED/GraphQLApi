const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { schema } = require("./GraphQL/Schema/index");
require("./db/mongoose");

const server = new ApolloServer({ schema: schema,playground:true});

const app = express();
app.use(express.json());
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000/graphql`)
);
