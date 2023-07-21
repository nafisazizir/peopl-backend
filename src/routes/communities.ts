import { Express } from "express";
import verifyToken from "../middleware/auth";

module.exports = (app: Express) => {
  const communities = require("../controllers/communities.ts");
  var router = require("express").Router();

  router.post("/", communities.createCommunity);
  router.get("/", communities.getCommunities);
  router.get("/:name", verifyToken, communities.getCommunityDetails);
  router.post("/:name/join", verifyToken, communities.joinCommunity);
  router.post("/:name/leave", verifyToken, communities.leaveCommunity);

  app.use("/api/community", router);
};
