import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../databaseSchemas/User";
import passportLocal from 'passport-local'

const LocalStrategy = passportLocal.Strategy;
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err: Error, user: any) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return done(err);
        }
        if (result === true) {
          return done(null, user);
        } else {
          return done(null, false, { message: "invalid password" });
        }
      });
    });
  })
);

passport.serializeUser((user: any, callback) => {
  callback(null, user.id);
});
passport.deserializeUser((id: string, callback) => {
  User.findOne({ _id: id }, (err: Error, user: any) => {
    const userInfo = {
      username: user.username,
      isAdmin: user.isAdmin,
    };
    callback(err, userInfo);
  });
});
