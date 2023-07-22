"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (app) => {
    const search = require("../controllers/search");
    var router = require("express").Router();
    router.get("/", search.search);
    app.use("/api/search", router);
};
//# sourceMappingURL=search.js.map