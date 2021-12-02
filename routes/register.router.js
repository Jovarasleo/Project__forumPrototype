import joi from "joi";
import { Router } from "express";
import bcrypt from "bcrypt";
import shortuuid from "short-uuid";
import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
const connect = process.env.MONGO_CONNECTION_STRING;
const mongoClient = new MongoClient(connect);
const router = new Router();

router.post("/", async (req, res) => {
  const body = req.body;
  const id = shortuuid.generate();
  const bodySchema = joi.object({
    email: joi.string().email().required(),
    name: joi.string().required(),
    password: joi.string().min(8).required(),
  });
  const connection = await mongoClient.connect();
  //check if user email and password are valid
  try {
    await bodySchema.validateAsync(body);
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, error: e.details[0].message });
    return;
  }
  //check if user already exist
  try {
    const user = await connection
      .db("authentication")
      .collection("users")
      .findOne({ email: body.email });
    console.log(user);
    if (user) {
      res.status(400).send({
        success: false,
        error: "email taken",
      });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false });
    return;
  }
  const passwordHash = bcrypt.hashSync(body.password, 10);
  try {
    await connection.db("authentication").collection("users").insertOne({
      name: body.name,
      email: body.email,
      password: passwordHash,
      id: id,
    });
    await connection.close();
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, error: e.details[0].message });
    return;
  }
  res.send({ success: true });
});
export default router;
