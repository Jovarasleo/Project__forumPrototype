import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
const connect = process.env.MONGO_CONNECTION_STRING;
const mongoClient = new MongoClient(connect);

const router = new Router();

router.get("/", auth, async (req, res) => {
  try {
    const connection = await mongoClient.connect();
    const user = await connection
      .db("authentication")
      .collection("users")
      .findOne({ id: req.userId });
    if (!user) {
      res.send({ success: false, error: "user not found" });
      return;
    }
    res.send({ name: user.name, id: user.id });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, error: "internal server error" });
    return;
  }
});
export default router;
