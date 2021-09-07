const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

module.exports = mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  })
  .then((res) => console.log("Succesfully Connected to DataBase"))
  .catch((error) => console.log("Can't connect to DataBase",error));
