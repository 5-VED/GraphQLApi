const gql = require("graphql-tag");

const typeDefs = gql`
  type Room {
    _id: ID!
    name: String!
    password: String
    members: [member!]!
    isDelete: Boolean!
  }

  type member {
    _id: ID!
    isAdmin: Boolean!
    date: String!
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
    removeMember(id: ID!, _id: ID!): RoomApiResponse!
  }

  type Mutation {
    createRoom(roomInput: RoomInput): RoomApiResponse!
    updateRoom(id: ID!, roomInput: RoomInput): Room!
    addMember(id: ID!, _id: ID!): RoomApiResponse!
    addAdmin(id: ID!, createAdmin: createAdmin): RoomApiResponse!
    dismissAdmin(id: ID!, _id: ID!): RoomApiResponse!
  }
`;

module.exports = typeDefs;
