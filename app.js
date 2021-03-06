const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { schema } = require("./GraphQL/Schema/index");
const authFxn = require("../ChitChat/config/passport");
const bodyParser = require("body-parser");
const passportManager = require("../ChitChat/config/passport");
const passport = require("passport");
require("./db/mongoose");
//srequire("../ChitChat/config/passport")(passport);

const app = express();

app.use(express.json());


// app.use(passport.initialize());

const server = new ApolloServer({
  schema: schema,
  playground: true,
});

//app.use(passportManager.initialize());

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000/graphql`)
);
