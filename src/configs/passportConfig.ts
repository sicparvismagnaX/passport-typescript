import passport from "passport";
import User from "../databaseSchemas/User";
import passportJwt from "passport-jwt";
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const jwtStrategy = new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "mysecret",
},(jwtPayload,callback)=>{
  //check for expire if not then find in redis if valid for individual
  return User.findOne({id:jwtPayload.id}).then(user=>{
    //get only specific field
    return callback(null,user)
  }).catch(err=>{
    return callback(err)
  })
})

passport.use(jwtStrategy)