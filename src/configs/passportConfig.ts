import passport from "passport";
// import passportLocal from "passport-local";
import User from "../User";
// import bcrypt from "bcryptjs";
import passportJwt from "passport-jwt";

// const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

// passport.use(
//     new LocalStrategy((username, password, done) => {
//       User.findOne({ username: username }, (err: Error, user: any) => {
//         if (err) throw err;
//         if (!user) return done(null, false);
//         bcrypt.compare(password, user.password, (err, result) => {
//           if (err) {
//             return done(err);
//           }
//           if (result === true) {
//             return done(null, user);
//           } else {
//             return done(null, false, { message: "invalid password" });
//           }
//         });
//       });
//     })
//   );

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "mysecret",
  },(jwtPayload,callback)=>{
    return User.findOne({id:jwtPayload.id}).then(user=>{
      return callback(null,user)
    }).catch(err=>{
      return callback(err)
    })
  }))
// const jwtOptions = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: "mysecret",
// };

// passport.use(
//   new JwtStrategy(jwtOptions, (jwt_payload, done) => {
//     console.log(jwt_payload);
//     User.findOne({ where: { id: jwt_payload.id } })
//       .then((user) => {
//         console.log(user);
//         console.log(jwt_payload);
//         if (user) {
//           return done(null, user);
//         }
//         return done(null, false);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
// );

// async function login(req, res) {
//   const data = req.body;
//   const email = data.email;
//   const password = data.password;
//   const user = await models.User.findOne(
//     { where: { email: email } } //attributes:['firstname','lastname']
//   );
//   if (user) {
//     const checkPassword = bcrypt.compareSync(password, user.password);
//     if (!checkPassword) {
//       return res.json("Incorrect passsword");
//     } else {
//       const payload = {
//         id: user.id,
//       };
//       const token = jwt.sign(payload, "mySecret");
//       return res.json({ token: token, data: user, statusCode: 200 });
//     }
//   }
// }
// passport.use(
//   new LocalStrategy((username, password, done) => {
//     User.findOne({ username: username }, (err: Error, user: any) => {
//       if (err) throw err;
//       if (!user) return done(null, false);
//       bcrypt.compare(password, user.password, (err, result) => {
//         if (err) {
//           return done(err);
//         }
//         if (result === true) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: "invalid password" });
//         }
//       });
//     });
//   })
// );

// passport.serializeUser((user: any, callback) => {
//   callback(null, user.id);
// });
// passport.deserializeUser((id: string, callback) => {
//   User.findOne({ _id: id }, (err: Error, user: any) => {
//     const userInfo = {
//       username: user.username,
//       isAdmin: user.isAdmin,
//     };
//     callback(err, userInfo);
//   });
// });
