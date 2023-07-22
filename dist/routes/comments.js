"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
module.exports = (app) => {
    const comments = require("../controllers/comments");
    var router = require("express").Router();
    router.post("/", auth_1.default, comments.createComment);
    app.use("/api/comment", router);
};
//# sourceMappingURL=comments.js.map