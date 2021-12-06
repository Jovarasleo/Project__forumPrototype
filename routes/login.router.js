import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
const connect = process.env.MONGO_CONNECTION_STRING;
const mongoClient = new MongoClient(connect);
const router = new Router();
const myToken = process.env.TOKEN_SECRET;
router.post("/", async (req, res) => {
  const body = req.body;
  try {
    const connection = await mongoClient.connect();
    const user = await connection
      .db("authentication")
      .collection("users")
      .findOne({ email: body.email.toLowerCase() });
    if (!user) {
      res.send({ success: false, error: "User not found" });
      return;
    }
    const doPasswordMatch = bcrypt.compareSync(body.password, user.password);
    if (doPasswordMatch) {
      const getToken = jwt.sign({ userId: user.id, name: user.name }, myToken, {
        expiresIn: 2000,
      });

      res.send({ success: true, tokenas: getToken });
    } else {
      res.send({ success: false, error: "incorrect password" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, error: "internal server error" });
    return;
  }
});
export default router;
