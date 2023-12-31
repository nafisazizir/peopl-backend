import { Express } from "express";

module.exports = (app: Express) => {
  const search = require("../controllers/search");
  var router = require("express").Router();

  router.get("/", search.search);

  app.use("/api/search", router);
};
