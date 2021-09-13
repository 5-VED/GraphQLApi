const gql = require("graphql-tag");

const typeDefs = gql`
  type Conversation {
    _id: ID!
    sender_id: String!
    receiver_id: String!
    group_id: String
    isArchived: Boolean!
    messages: [message!]
  }

  type message {
    _id: String!
    isRead: Boolean
    message: String!
    date: String!
  }

  input messageInput {
    _id: String!
    isRead: Boolean!
    message: String!
    date: String!
  }

  input messageApi {
    _id: String!
    message: String!
  }

  input conversationInput {
    sender_id: String
    receiver_id: String
    group_id: String
    isArchived: Boolean
    messages: messageInput!
  }

  type Mutation {
    createConversation(conversationInput: conversationInput): Conversation!
    pushMessage(_id: ID!, messages: messageApi): Conversation!
    deleteMessage(_id: ID!, messages: [messageApi!]!): Conversation!
    broadcast(id: [ID!], message: messageApi): Conversation!
  }

  type Query {
    deleteConversation(_id: ID!): Conversation!
    getConverstions: [Conversation!]!
    archiveConversation(_id: ID!): Conversation!
    clearChat(_id: ID!): Conversation!
    getSpecificConversation(_id: ID!): Conversation!
    notification(_id: ID!): Conversation!
  }
`;

module.exports = typeDefs;
