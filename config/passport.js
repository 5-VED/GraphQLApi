const User = require("../Models/Users"),
  Strategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();

module.exports = function () {
  //console.log("OVer Here")
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_SECRET,
  };

  //console.log("Obviously control comes here");
  passport.use(
    new Strategy(opts, function (jwt_payload, done) {
      console.log("Obviously control comes here");
      User.findOne({ _id: jwt_payload.id }, function (err, user,) {
        console.log(" comes here");
        if (err) {
          return done(err, false);
        }
        if (user) {
          console.log("gives the user");
          done(null, user);
        } else {
          console.log("gives error");
          done(null, false);
        }
      });
    })
  );
};

module.exports.authFxn = function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    //console.log("overHEre");
    // if (err) {
    //   console.log("there is error");
    //   throw new Error(err);
    // }
    // if (user) {
    //   console.log("got he user");

    //   req.user = user;
    // }
    // console.log("now here");
    // next();
    if (err) {
      console.log("In error Block");
      console.log(err);
      res.json(err);
    }
    if (!user) {
      console.log("didnt got the user")
      return res.json(err);
    }
    console.log(user)
    req.user = user;
    return next();
    })(req, res, next);
};
