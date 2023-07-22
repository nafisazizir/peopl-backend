"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const posts_1 = __importDefault(require("../services/posts"));
exports.createPost = (req, res) => {
    const { title, content, community } = req.body;
    const username = req.username;
    posts_1.default.create(title, content, username, community)
        .then((post) => {
        res.status(201).json(post);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.getJoinedPosts = (req, res) => {
    const email = req.email;
    posts_1.default.getJoinedPosts(email)
        .then((posts) => {
        res.status(200).json(posts);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.deletePost = (req, res) => {
    const { postId } = req.params;
    const email = req.email;
    posts_1.default.deletePost(email, postId)
        .then(() => {
        res.status(200).json("Post successfully deleted");
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.getPostDetails = (req, res) => {
    const { postId } = req.params;
    posts_1.default.getPostDetails(postId)
        .then((post) => {
        res.status(200).json(post);
    })
        .catch((error) => res.status(400).json(error.message));
};
//# sourceMappingURL=posts.js.map