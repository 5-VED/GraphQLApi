const User = require("../../../Models/Users");
const {
  encryptPassword,
  UeS,
  ReE,
  dateToString,
  userRegisterationRules,
} = require("../../../Helper/helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authFxn } = require("../../../config/passport");
const dotenv = require("dotenv");
dotenv.config();

const resolvers = {
  Query: {
    users: () => {
      return User.find()
        .then((users) => {
          console.log(users);
          return users.map((user) => {
            return {
              ...user._doc,
              _id: user._doc._id.toString(),
              password: null,
            };
          });
        })
        .catch((err) => {
          console.log(err);
          throw err;
        });
    },

    login: async (parent, args) => {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error("User Does Not Exist");
      }
      const isEqual = await bcrypt.compare(args.password, user.password);
      if (!isEqual) {
        throw new Error("Invalid Credentials");
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      return { userId: user.id, token: token, tokenExpiration: 1 };
    },

    getSpecificUser: async (parent, args) => {
      try {
        const user = await User.findById({ _id: args.id }).then((res) => {
          return res;
        });

        if (user) {
          console.log(user);
          return UeS(`${user.name} Exist in DataBase`, true, user);
        } else {
          return ReE("No such User Exist", false);
        }
        // return obj;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    deleteUser: async (parent, args) => {
     // app.use(authFxn(req));
      try {
        const user = await User.findById({ _id: args.id });
        if (!user) {
          throw new Error("No Such User Exist");
        }
        const result = await user.deleteOne({}).then((res) => {
          return res;
        });
        console.log(result);
        if (result) {
          var obj = {
            message: "User Deleted Succesfully",
            isSuccess: true,
          };
        } else {
          return ReE("Failed to delete User Please try again", false);
        }
        return obj;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },

  Mutation: {
    createUser: async (parent, args) => {
      //console.log(args);

      const existingUser = await User.findOne({
        email: args.userInput.email,
      });

      if (existingUser) {
        return ReE("User Already Exist", false);
      }

      // validateUser();
      // console.log(validateUser(args.userInput))

      const hashedPassword = await encryptPassword(args.userInput.password);

      const user = await new User({
        name: args.userInput.name,
        bio: args.userInput.bio,
        email: args.userInput.email,
        password: hashedPassword,
        date: dateToString(args.userInput.date),
      });

      await userRegisterationRules.validate(user, { abortEarly: false });

      const result = await user.save().then((res) => {
        return res;
      });

      if (result) {
        return UeS("User Created Succesfully", true, result);
      } else {
        return ReE("Can't create User", false);
      }
    },

    updateUser: async (parent, args) => {
      try {
        const user = await User.findById({ _id: args.id });
        if (!user) {
          throw new Error("User does not exist");
        }
        const hashedPassword = await encryptPassword(args.userInput.password);
        await user.updateOne({
          name: args.userInput.name,
          bio: args.userInput.bio,
          email: args.userInput.email,
          password: hashedPassword,
          date: dateToString(args.userInput.date),
        });
        const result = await user.save().then((res) => {
          return res;
        });
        console.log(result);
        if (result) {
          return UeS("User Record Updated Successfully", true, result);
        } else {
          return ReE("Some Error Occured", false);
        }
        //return obj;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};

module.exports = resolvers;
