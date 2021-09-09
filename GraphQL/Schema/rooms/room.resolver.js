const {
  encryptPassword,
  ReS,
  ReE,
  roomRegisteartionRules,
} = require("../../../Helper/helper");
const User = require("../../../Models/Users");
const Room = require("../../../Models/Rooms");
const _ = require("lodash");
const { getResolversFromSchema } = require("@graphql-tools/utils");
const resolvers = {
  Query: {
    getRooms: async () => {
      try {
        const rooms = await Room.find({});
        if (!rooms) {
          console.log("No rooms Found");
          return "No rooms Found";
        }
        return rooms.map((room) => {
          return {
            ...room._doc,
            password: null,
            _id: room.id,
          };
        });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    getSpecificRoom: async (parent, args) => {
      try {
        const room = await Room.findById({ _id: args.id });
        if (!room) {
          console.log("No room Found");
          return "No room Found";
        }
        console.log(room);
        return ReS("Room Fetched Succesfully", true, room);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    deleteRoom: async (parent, args) => {
      try {
        const room = await Room.findById({ _id: args.id });
        if (!room) {
          console.log("No room Found");
          return ReE("No room Found", false);
        }
        if (room.isDelete === false) {
          room.isDelete = true;
          await room.save();
          return {
            ...room._doc,
            password: null,
          };
        }
        throw new Error("Room Does not Exist");
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    removeMember: async (parent, args) => {
      console.log(args);
      const room = await Room.findById({ _id: args.id });
      if (!room) {
        throw new Error("Room does not exist");
      }
      for (let i = 0; i < room.members.length; i++) {
        if (args._id.toString() === room.members[i]._id.toString()) {
          room.members.splice(i, 1);
        }
      }
      await room.save();
      return ReS("Member Removed Succesfully", true, room);
    },
  },

  Mutation: {
    createRoom: async (parent, args) => {
      //Hashing the password
      const hashedpassword = await encryptPassword(args.roomInput.password);
      const room = await new Room({
        name: args.roomInput.name,
        password: hashedpassword,
        members: args.roomInput.members,
        isDelete: args.roomInput.isDelete,
      });

      await roomRegisteartionRules.validate(room, { abortEarly: false });

      const result = await room.save().then((res) => {
        return res;
      });
      if (result) {
        return ReS(" Room Created Succesfully", true, result);
      }
      return ReE("Cant Create a Room", false);
      // return {
      //   message: " Cant Create a Room",
      //   isSuccess: false,
      //   data: [],
      // };
    },

    updateRoom: async (parent, args) => {
      //Hashing the password
      try {
        const room = await Room.findById({ _id: args.id });
        if (!room) {
          throw new Error("Room does not exist");
        }

        //Hashing the Password
        const hashedpassword = await bcrypt.hash(args.roomInput.password, 10);

        await room.updateOne({
          name: args.roomInput.name,
          password: hashedpassword,
          members: args.roomInput.members,
          isDelete: args.roomInput.isDelete,
        });
        const result = await room.save();
        console.log(result);
        if (result) {
          return ReS(" Record Updated Succesfully", true, result);
        }
        return ReE("Record Can't be updated", false);
        // return {
        //   ...result._doc,
        //   password: null,
        //   _id: result.id,
        // };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    //APi endpoint to addMember
    addMember: async (parent, args) => {
      const user = await User.findOne({ _id: args.id });
      if (!user) {
        throw new Error("User does not Exist");
      }
      //console.log(user);
      const member = {
        _id: user._id.toString(),
        isAdmin: false,
        date: new Date().toLocaleDateString(),
      };

      console.log(member._id);
      const room = await Room.findById({ _id: args._id });
      let tempArr = [];

      for (let i = 0; i < room.members.length; i++) {
        tempArr.push(room.members[i]._id.toString());
      }

      for (let i = 0; i < room.members.length; i++) {
        if (member._id === tempArr[i]) {
          return new Error("User Already Exist");
        }
      }
      //console.log(tempArr);
      room.members.push(member);
      await room.save();
      return ReS("Member Added Succesfully", true, room);
    },

    addAdmin: async (parent, args) => {
      const room = await Room.findById({ _id: args.id });
      const newAdmin = args.createAdmin._id;

      for (let i = 0; i < room.members.length; i++) {
        if (room.members[i].id === newAdmin) {
          if (room.members[i].isAdmin === false) {
            room.members[i].isAdmin = true;
          }
        }
      }
      await room.save();
      return ReS("You are Admin now", true, room);
    },

    dismissAdmin: async (parent, args) => {
      const room = await Room.findById({ _id: args.id });
      const newAdmin = args._id;

      for (let i = 0; i < room.members.length; i++) {
        if (room.members[i].id === newAdmin) {
          if (room.members[i].isAdmin === true) {
            room.members[i].isAdmin = false;
          }
        }
      }
      await room.save();
      return ReS("You are No more Admin", true, room);
    },
  },
};

module.exports = resolvers;
