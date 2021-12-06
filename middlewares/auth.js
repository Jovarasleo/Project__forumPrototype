import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const myToken = process.env.TOKEN_SECRET;
export const auth = (req, res, next) => {
  console.log(req.headers);
  if (!req.headers.authorization) {
    res
      .status(401)
      .send({ success: false, error: "Please provide authorization header" });
    return;
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    const isTokenValid = jwt.verify(token, myToken);
    if (isTokenValid) {
      const tokenData = jwt.decode(token);
      const tokenUserId = tokenData.userId;
      const tokenUserName = tokenData.name;
      req.userId = tokenUserId;
      req.name = tokenUserName;
      next();
      return;
    }
  } catch (e) {
    res.status(401).send({ success: false, error: "invalid token" });
  }
};
