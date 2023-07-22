"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
module.exports = (app) => {
    const posts = require("../controllers/posts.ts");
    var router = require("express").Router();
    router.post("/", auth_1.default, posts.createPost);
    router.get("/", auth_1.default, posts.getJoinedPosts);
    router.delete("/:postId", auth_1.default, posts.deletePost);
    router.get("/:postId", posts.getPostDetails);
    app.use("/api/post", router);
};
//# sourceMappingURL=posts.js.map