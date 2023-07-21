import { Express } from "express";
import verifyToken from "../middleware/auth";

module.exports = (app: Express) => {
  const comments = require("../controllers/comments.ts");
  var router = require("express").Router();

  router.post("/", verifyToken, comments.createComment);

  app.use("/api/comment", router);
};
