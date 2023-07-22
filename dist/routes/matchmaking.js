"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
module.exports = (app) => {
    const matchmaking = require("../controllers/matchmaking");
    var router = require("express").Router();
    router.get("/", auth_1.default, matchmaking.findUsers);
    app.use("/api/matchmaking", router);
};
//# sourceMappingURL=matchmaking.js.map