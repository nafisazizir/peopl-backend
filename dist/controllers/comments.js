"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comments_1 = __importDefault(require("../services/comments"));
exports.createComment = (req, res) => {
    const { parentId, parentType, content } = req.body;
    console.log(req.body);
    const email = req.email;
    comments_1.default.create(email, parentId, parentType, content)
        .then((comment) => {
        res.status(201).json(comment);
    })
        .catch((error) => res.status(400).json(error.message));
};
//# sourceMappingURL=comments.js.map