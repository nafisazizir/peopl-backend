import { Express } from "express";
import verifyToken from "../middleware/auth";

module.exports = (app: Express) => {
  const messages = require("../controllers/messages");
  var router = require("express").Router();

  router.post("/", verifyToken, messages.sendMessage);
  router.get("/", verifyToken, messages.getMessages);
  router.get("/summary", verifyToken, messages.getMessageSummary);

  app.use("/api/message", router);
};
