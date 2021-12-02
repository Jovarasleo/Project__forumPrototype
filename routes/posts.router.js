import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import shortuuid from "short-uuid";
import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
const connect = process.env.MONGO_CONNECTION_STRING;
const mongoClient = new MongoClient(connect);

const router = new Router();

router.get("/", auth, async (req, res) => {
  try {
    const connection = await mongoClient.connect();
    const posts = await connection
      .db("authentication")
      .collection("posts")
      .find({})
      .toArray();
    const user = await connection
      .db("authentication")
      .collection("users")
      .findOne({ id: req.userId });
    if (!user) {
      res.send({ success: false, error: "user not found" });
      return;
    }
    res.send(posts);
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, error: "internal server error" });
    return;
  }
});
router.post("/", auth, async (req, res) => {
  const body = req.body;
  try {
    const connection = await mongoClient.connect();
    const id = shortuuid.generate();
    const user = await connection
      .db("authentication")
      .collection("users")
      .findOne({ id: req.userId });

    if (!user) {
      res.send({ success: false, error: "user not found" });
      return;
    }
    if (body.Title.length && body.postBody.length) {
      const posts = await connection
        .db("authentication")
        .collection("posts")
        .insertOne({
          title: body.Title,
          message: body.postBody,
          userId: req.userId,
          postId: id,
        });
      res.send(posts);
    } else {
      res.send({ error: "post didn't upload" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, error: "internal server error" });
    return;
  }
});

router.put("/", auth, async (req, res) => {
  const body = req.body;
  const fieldsToUpdate = {};
  if (body.message) {
    fieldsToUpdate["message"] = body.message;
  }
  if (body.title) {
    fieldsToUpdate["title"] = body.title;
  }
  try {
    const connection = await mongoClient.connect();
    const id = shortuuid.generate();
    const user = await connection
      .db("authentication")
      .collection("users")
      .findOne({ id: req.userId });
    const post = await connection
      .db("authentication")
      .collection("posts")
      .findOne({ postId: body.id });
    if (!user) {
      res.send({ success: false, error: "user not found" });
      return;
    }

    console.log(req.userId, post);
    if (req.userId === post.userId) {
      const posts = await connection
        .db("authentication")
        .collection("posts")
        .updateOne(
          { postId: body.id },
          {
            $set: fieldsToUpdate,
          }
        );
      res.send(posts);
    } else {
      res.status(403).send({ error: "error" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, error: "internal server error" });
    return;
  }
});

export default router;
