import express, { Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import User from "./databaseSchemas/User";
import Role from "./databaseSchemas/Role";
import jsonwebtoken from "jsonwebtoken";
import { UserInterface } from "./Interfaces/UserInterface";
import morgan from 'morgan'
import {createProxyMiddleware} from "http-proxy-middleware"
require("./services/connectDatabase");


const API_SERVICE_URL = "https://jsonplaceholder.typicode.com";
const jwt = jsonwebtoken;
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan('dev'))
require("./configs/passportConfig");

app.post("/register", async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof role !== "string"
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
        role,
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
      const accessToken = jwt.sign(payload, "mysecret", { expiresIn: "1d" });
      const refreshToken = jwt.sign(payload, "forRefresh", { expiresIn: "1d" });
      return res.json({
        accessToken,
        refreshToken,
        data: user,
        statusCode: 200,
      });
    }
  }
  return res.sendStatus(200)
});
app.get(
  "/user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send("success get user");
  }
);

app.use('/json_placeholder',passport.authenticate("jwt", { session: false }), createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/json_placeholder`]: '',
  },
}));

async function initialRoleRecords() {
  return new Promise((resolve) => {
    const records = [
      { name: "accountance", createdDate: new Date() },
      { name: "chef", createdDate: new Date() },
      { name: "purchasing department", createdDate: new Date() },
      { name: "manager", createdDate: new Date() },
      { name: "employee", createdDate: new Date() }
    ];
    Role.find({}, function (err, results) {
      if (err) throw err;
      if (results.length === 0) {
        Role.insertMany(records, {}, function (error) {
          if (error) throw error;
        });
      }
      resolve(true)
    });
  });
}
app.listen(3000, async () => {
  console.log("initialize preprocessing sequences");
  await initialRoleRecords();
  console.log("server started");
});
