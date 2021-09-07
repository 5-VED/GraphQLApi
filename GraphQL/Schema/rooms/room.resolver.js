const { encryptPassword, ReS, ReE } = require("../../../Helper/helper");
const Room = require("../../../Models/Rooms");
const _ = require("lodash");
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
          return "No room Found";
        }
        await room.deleteOne({});
        return {
          ...room._doc,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    createRoom: async (parent, args) => {
      try {
        //Hashing the password
        const hashedpassword = await encryptPassword(args.roomInput.password);
        const room = await new Room({
          name: args.roomInput.name,
          password: hashedpassword,
          members: args.roomInput.members,
          isDelete: args.roomInput.isDelete,
        });
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
      } catch (err) {
        console.log(err);
        throw err;
      }
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

    addMember: async (parent, args) => {
      const room = await Room.findById({ _id: args.id });
      if (!room) {
        return ReE("Room not found", false);
      }

      let newId = {
        _id: args.memberInput._id,
      };
      let arr = room.members.length;
      console.log(obj);
      for (let i = 0; i < room.members.length; i++) {
        if (room.members[i]._id !== newId._id) {
        }
      }
    },

    addAdmin: async (parent, args) => {
      const room = await Room.findById({ _id: args.id });

      if (!room) {
        return ReE(res, "No Such Group Exist", 400);
      }
      const id = args.memberInput._id;

      for (let i = 0; i < room.members.length; i++) {
        if (room.members[i]._id === id) {
          if (room.members[i].isAdmin === false) {
            room.members[i].isAdmin = true;
          }
        }
      }
      await room.save();
      return ReS("You are Now Admin", true, room);
    },
  },
};

module.exports = resolvers;
