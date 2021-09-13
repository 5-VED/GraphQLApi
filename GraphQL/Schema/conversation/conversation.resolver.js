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
          throw new Error("Conversation Does not Exist");
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
    notification: async (parent, args) => {
      const conversation = await Conversation.findOne({ _id: args._id });
      if (!conversation) {
        return ReE("No such Conversation Exist", false);
      }
      let arr = conversation.messages;
      let receiverId = conversation.receiver_id.toString();
      let groupId = conversation.group_id;

      console.log(receiverId);
      console.log(groupId);
      console.log(arr[0].id);

      if (groupId === null) {
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id.toString() === receiverId && arr[i].isRead === false) {
            count = count + 1;
            arr[i].isRead = true;
          }
        }
        await conversation.save();
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

    pushMessage: async (parent, args) => {
      const conversation = await Conversation.findById({ _id: args._id });
      if (!conversation) {
        throw new Error("Conversation Does not Exist");
      }

      const id = args.messages._id;
      const message = args.messages.message;
      const arr = conversation.messages;

      const pushFxn = function () {
        let newMessage = {
          _id: id,
          message: message,
        };
        arr.push(newMessage);
      };

      const roomId = conversation.group_id;

      console.log(roomId === null);
      if (roomId === null) {
        const sender_id = conversation.sender_id.toString();
        const receiver_id = conversation.receiver_id.toString();
        if (sender_id === id || receiver_id === id) {
          pushFxn();
          await conversation.save();
          return conversation;
        }
      }

      if (roomId !== null) {
        const room = await Rooms.findOne({ _id: roomId });

        let requiredArr = [];
        for (let i = 0; i <= conversation.messages.length; i++) {
          let obj = {};
          obj._id = conversation.messages[i]._id.toString();
          requiredArr.push(obj);
        }

        for (let i = 0; i < room.members.length; i++) {
          if (requiredArr[i]._id === id) {
            pushFxn();
          }
        }
        await conversation.save();
        return conversation;
      }
      return;
    },

    deleteMessage: async (parent, args) => {
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
    broadcast: async (parent, args) => {
      const receivers = args.id;
      const sender_id = args._id;
      const message = args.message;

      console.log(receivers);
      console.log(message);
      const room = await new Rooms({});
      console.log(room);

      let brodcastMsg = {
        _id: message._id,
        message: message.message,
      };
    },
  },
};

module.exports = resolvers;
