const Conversation = require("../../../Models/Conversations");
const User = require("../../../Models/Users");
const Rooms = require("../../../Models/Rooms");
const { ReE } = require("../../../Helper/helper");
const _ = require("lodash");
const resolvers = {
  Query: {
    deleteConversation: async (parent, args) => {
      try {
        const conversation = await Conversation.findById({ _id: args._id });

        if (!conversation) {
          throw new Error("No Such conversation Exist");
        }
        const result = await conversation.deleteOne({}).then((res) => {
          return res;
        });

        if (result) {
          var obj = {
            message: "User Deleted Succesfully",
            isSuccess: true,
          };
        }
        return obj;
      } catch (err) {
        throw new Error(err);
      }
    },

    getConverstions: async () => {
      try {
        const conversations = await Conversation.find({ isArchived: "false" });
        if (!conversations) {
          return ReE("No conversations Exist", false);
        }
        return conversations;
      } catch (err) {
        throw new Error(err);
      }
    },

    getSpecificConversation: async (parent, args) => {
      try {
        const conversation = await Conversation.findOne({ _id: args._id });
        console.log(conversation);
        if (!conversation) {
          throw new Error("No Such Conversation Exist");
        }
        return { ...conversation._doc };
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },

    archiveConversation: async (parent, args) => {
      try {
        const conversation = await Conversation.findById({ _id: args._id });
        if (!conversation) {
          return ReE("No conversations Exist", false);
        }
        console.log("got the conversation");
        console.log(conversation.isArchived);
        if (conversation.isArchived === false) {
          conversation.isArchived = true;
          await conversation.save();
          return { ...conversation._doc };
        } else {
          conversation.isArchived = false;
          await conversation.save();
          return { ...conversation._doc };
        }
      } catch (err) {
        throw new Error(err);
      }
    },

    clearChat: async (parent, args) => {
      try {
        const conversation = await Conversation.findById({ _id: args._id });
        if (!conversation) {
          return ReE("No conversations Exist", false);
        }
        while (conversation.messages.length > 0) {
          conversation.messages.pop();
        }
        await conversation.save();
        return { ...conversation._doc };
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
  },

  Mutation: {
    createConversation: async (parent, args) => {
      try {
        const conversation = await new Conversation({
          sender_id: args.conversationInput.sender_id,
          receiver_id: args.conversationInput.receiver_id,
          group_id: args.conversationInput.group_id,
          isArchived: args.conversationInput.isArchived,
          messages: args.conversationInput.messages,
        });
        console.log(conversation.messages);
        await conversation.save();
        return conversation;
      } catch (err) {
        console.log(err);
        throw new Error("Some Error Occured");
      }
    },

    deleteMessage: async (parent, args) => {
      //console.log(args);
      console.log(args.messages);

      const conversation = await Conversation.findOne({ _id: args._id });
      if (!conversation) {
        throw new Error("No Such Conversation Exist");
      }

      let temp = args.messages;
      let requiredArr = [];
      for (let i = 0; i < conversation.messages.length; i++) {
        let obj = {};
        obj._id = conversation.messages[i]._id.toString();
        obj.message = conversation.messages[i].message;
        requiredArr.push(obj);
      }

      conversation.messages = _.pullAllWith(requiredArr, temp, _.isEqual);

      console.log(requiredArr);
      await conversation.save();
      return;
    },
  },
};

module.exports = resolvers;
