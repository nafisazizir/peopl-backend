import { Express } from "express";
import verifyToken from "../middleware/auth";

module.exports = (app: Express) => {
  const requests = require("../controllers/requests.ts");
  var router = require("express").Router();

  router.post("/", verifyToken, requests.createRequest);
  router.get("/", verifyToken, requests.getPendingRequests);

  app.use("/api/request", router);
};
