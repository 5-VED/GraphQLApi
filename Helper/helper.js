const bcrypt = require("bcrypt");
const yup = require("yup");

module.exports.encryptPassword = function (password) {
  return bcrypt.hash(password, bcrypt.genSaltSync(10));
};

module.exports.dateToString = function (date) {
  return new Date(date).toLocaleDateString();
};

module.exports.ReS = function (message, isSuccess, data) {
  return {
    message: message,
    isSuccess: isSuccess,
    data: {
      ...data._doc,
      password: null,
      _id: data.id,
      date: data.date.toLocaleDateString(),
    },
  };
};

module.exports.ReE = function (message, isSuccess) {
  return {
    message: message,
    isSuccess: isSuccess,
  };
};

const name = yup
  .string()
  .required("Please enter yout Name")
  .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ", {
    excludeEmptyString: false,
  })
  .min(3, "Must be greater than or equal to 3 characters")
  .max(255, "Name to Long");

const bio = yup
  .string()
  .matches(
    /^[a-zA-z]+([\s][a-zA-Z]+)+$/,
    "Only alphabets are allowed for this field ",
    {
      excludeEmptyString: false,
    }
  )
  .max(255, "Bio to long");

const email = yup.string().required("Please enter your email").email();

const password = yup
  .string()
  .required("Please your password")
  // .matches(/^[a-zA-Z0-9]+$/, "Only alphabets are allowed for this field ", {
  //   excludeEmptyString: false,
  // })
  .min(6, "The Minimum length should be 6 characters")
    .max(255, "The Maximum length allowed is 255 characters");

const date = yup.string().required("Please enter the required field");

const userRegisterationRules = yup.object().shape({
name,
bio,
email,
password,
date
})

module.exports.userRegisterationRules = userRegisterationRules;
