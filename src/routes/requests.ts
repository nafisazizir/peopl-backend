import { Express } from "express";
import verifyToken from "../middleware/auth";

module.exports = (app: Express) => {
  const requests = require("../controllers/requests.ts");
  var router = require("express").Router();

  router.post("/", verifyToken, requests.createRequest);
  router.get("/", verifyToken, requests.getPendingRequests);
  router.put("/:requestId/accept", verifyToken, requests.acceptChatRequest);
  router.put("/:requestId/reject", verifyToken, requests.rejectChatRequest);

  app.use("/api/request", router);
};
