import { Express } from "express";
import verifyToken from "../middleware/auth";

module.exports = (app: Express) => {
  const posts = require("../controllers/posts.ts");
  var router = require("express").Router();

  router.post("/", verifyToken, posts.createPost);
  router.get("/", verifyToken, posts.getJoinedPosts);
  router.delete("/:postId", verifyToken, posts.deletePost);
  router.get("/:postId", posts.getPostDetails);

  app.use("/api/post", router);
};
