import express, { Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcryptjs";
import User from "./User";
import jsonwebtoken from "jsonwebtoken";
import { UserInterface } from "./Interfaces/UserInterface";
require("./services/connectDatabase");

// const LocalStrategy = passportLocal.Strategy;
const jwt = jsonwebtoken;
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
// app.use(passport.initialize());
// app.use(passport.session());
require("./configs/passportConfig");
//Passport

//Routes
app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    res.send("improper value");
    return;
  }
  User.findOne({ username }, async (err: Error, doc: UserInterface) => {
    if (err) throw err;
    if (doc) res.send("User already exists");
    if (!doc) {
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        password: hashPassword,
      });
      await newUser.save();
      res.send("success");
    }
  });
});

app.post("/login", async (req, res) => {
  const data = req.body;
  const email = data.email;
  const password = data.password;
  const user = await User.findOne(
    { where: { email: email } } //attributes:['firstname','lastname']
  );
  if (user) {
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) {
      return res.json("Incorrect passsword");
    } else {
      const payload = {
        id: user.id,
      };
      const token = jwt.sign(payload, "mysecret",{expiresIn:'1d'});
      return res.json({ token: "Bearer " +token, data: user, statusCode: 200 });
    }
  }
});
app.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send('success get user');
  }
);

app.listen(3000, () => {
  console.log("server started");
});
