import { Express } from "express";
import verifyToken from "../middleware/auth";

module.exports = (app: Express) => {
  const matchmaking = require("../controllers/matchmaking.ts");
  var router = require("express").Router();

  router.get("/", verifyToken, matchmaking.findUsers);

  app.use("/api/matchmaking", router);
};
