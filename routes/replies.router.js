import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import shortuuid from "short-uuid";
import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";
const connect = process.env.MONGO_CONNECTION_STRING;
const mongoClient = new MongoClient(connect);

const router = new Router();

router.get("/:postId", auth, async (req, res) => {
  const postId = req.params.postId;
  console.log(postId);
  try {
    const connection = await mongoClient.connect();

    const post = await connection
      .db("authentication")
      .collection("posts")
      .aggregate([
        {
          $match: { postId: postId },
        },
        {
          $lookup: {
            from: "replies",
            localField: "postId",
            foreignField: "postId",
            as: "replies",
          },
        },
      ])
      .toArray();
    if (!post[0]) {
      res.send({ success: false, error: "post not found" });
      return;
    }
    res.send(post[0]);
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, error: "internal server error" });
    return;
  }
});
router.post("/:postId", auth, async (req, res) => {
  const body = req.body;
  const postId = req.params.postId;
  try {
    const connection = await mongoClient.connect();
    const id = shortuuid.generate();
    const post = await connection
      .db("authentication")
      .collection("posts")
      .findOne({ postId: postId });
    const user = await connection
      .db("authentication")
      .collection("users")
      .findOne({ id: req.userId });

    if (!user) {
      res.send({ success: false, error: "user not found" });
      return;
    }
    if (!post) {
      res.send({ success: false, error: "post not found" });
      return;
    }
    if (body.message.length > 0) {
      const reply = await connection
        .db("authentication")
        .collection("replies")
        .insertOne({
          message: body.message,
          userId: req.userId,
          userName: req.name,
          postId: postId,
          replyId: id,
        });
      res.send(reply);
    } else {
      res.send({ error: "reply didn't upload" });
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
