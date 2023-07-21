import { Express } from "express";
import verifyToken from "../middleware/auth";

module.exports = (app: Express) => {
  const users = require("../controllers/users.ts");
  var router = require("express").Router();

  router.post("/register", users.register);
  router.post("/login", users.login);
  router.get("/username", users.getRandomUsernameList);
  router.get("/:username", users.getDetails);
  router.post("/set-username/:username", verifyToken, users.setUsername);

  app.use("/api/user", router);
};
