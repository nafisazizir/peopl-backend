import { Express } from "express";
import verifyToken from "../middleware/auth";

module.exports = (app: Express) => {
  const messages = require("../controllers/messages.ts");
  var router = require("express").Router();

  router.post("/", verifyToken, messages.sendMessage);
  router.get("/", verifyToken, messages.getMessages);

  app.use("/api/message", router);
};
