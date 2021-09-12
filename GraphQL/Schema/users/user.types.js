const gql = require("graphql-tag");

const typeDefs = gql`

  type User {
    _id: ID!
    name: String!
    bio: String
    email: String!
    password: String
    date: String!
  }

  input UserInput {
    name: String! @constraint(maxLength: 5)
    bio: String
    email: String! @constraint(minLength: 5, format: "email")
    password: String!
    date: String
  }

  type apiResponse {
    message: String!
    isSuccess: Boolean!
    data: User
  }

  type apiResponseWithoutData {
    message: String!
    isSuccess: Boolean!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  type Mutation {
    createUser(userInput: UserInput): apiResponse!
    updateUser(id: ID!, userInput: UserInput): User
  }

  type Query {
    users: [User!]!
    login(email: String!, password: String!): AuthData!
    getSpecificUser(id: ID!): apiResponse!
    deleteUser(id: ID!): apiResponseWithoutData!
  }
`;

module.exports = typeDefs;
