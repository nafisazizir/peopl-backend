"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const requests_1 = __importDefault(require("../services/requests"));
exports.createRequest = (req, res) => {
    const { recipient } = req.body;
    const username = req.username;
    requests_1.default.create(username, recipient)
        .then((request) => {
        res.status(201).json(request);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.getPendingRequests = (req, res) => {
    const username = req.username;
    requests_1.default.getPendingRequests(username)
        .then((request) => {
        res.status(200).json(request);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.acceptChatRequest = (req, res) => {
    const requestId = req.params.requestId;
    const username = req.username;
    requests_1.default.acceptChatRequest(username, requestId)
        .then(() => {
        res.status(200).json("Request successfully acepted");
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.rejectChatRequest = (req, res) => {
    const requestId = req.params.requestId;
    const username = req.username;
    requests_1.default.rejecttChatRequest(username, requestId)
        .then(() => {
        res.status(200).json("Request successfully rejected");
    })
        .catch((error) => res.status(400).json(error.message));
};
//# sourceMappingURL=requests.js.map