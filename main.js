import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
// import {port, MONGO_CONNECTION_STRING} from "./config.js";
import loginRouter from "./routes/login.router.js";
import postsRouter from "./routes/posts.router.js";
import registerRouter from "./routes/register.router.js";
import userInfo from "./routes/userInfo.router.js";
import repliesRouter from "./routes/replies.router.js";
import dotenv from "dotenv";
dotenv.config();

const connect = process.env.MONGO_CONNECTION_STRING;
const mongoClient = new MongoClient(connect);
const port = process.env.port;
const myToken = process.env.TOKEN_SECRET;
const app = express();
app.use(cors());
app.use(express.json());

app.use("/login", loginRouter);
app.use("/posts", postsRouter);
app.use("/post", repliesRouter);
app.use("/register", registerRouter);
app.use("/userInfo", userInfo);
app.use("*", (req, res) => {
  res.status(404).send({ success: false, error: "Not found" });
});

app.listen(port, () => {
  console.log(`App listen on port: ${port}`);
});
