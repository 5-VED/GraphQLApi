const gql = require("graphql-tag");

const typeDefs = gql`
  type member {
    _id: ID!
    isAdmin: Boolean!
    date: String!
  }

  type Room {
    _id: ID!
    name: String!
    password: String
    members: [member!]!
    isDelete: Boolean!
  }

  input MemberInput {
    _id: ID!
    isAdmin: Boolean!
    date: String!
  }

  input createAdmin {
    _id: ID!
  }

  input RoomInput {
    name: String!
    password: String
    members: MemberInput!
    isDelete: Boolean!
  }

  type RoomApiResponse {
    message: String!
    isSuccess: Boolean!
    data: Room
  }

  type Query {
    getRooms: [Room!]!
    getSpecificRoom(id: ID!): Room!
    deleteRoom(id: ID!): Room!
  }

  type Mutation {
    createRoom(roomInput: RoomInput): RoomApiResponse!
    updateRoom(id: ID!, roomInput: RoomInput): Room!
    addMember(id: ID!, memberInput: [MemberInput]): [member!]!
    addAdmin(id: ID!, createAdmin: createAdmin): RoomApiResponse
  }
`;

module.exports = typeDefs;
