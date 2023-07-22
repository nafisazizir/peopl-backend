"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = __importDefault(require("../services/messages"));
exports.sendMessage = (req, res) => {
    const { recipient, content } = req.body;
    const username = req.username;
    messages_1.default.create(username, recipient, content)
        .then((message) => {
        res.status(201).json(message);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.getMessages = (req, res) => {
    const { recipient } = req.query ? req.query : req.body;
    const username = req.username;
    messages_1.default.getMessages(username, recipient)
        .then((messages) => {
        res.status(200).send(messages);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.getMessageSummary = (req, res) => {
    const username = req.username;
    messages_1.default.getMessageSummary(username)
        .then((messages) => {
        res.status(200).send(messages);
    })
        .catch((error) => res.status(400).json(error.message));
};
//# sourceMappingURL=messages.js.map