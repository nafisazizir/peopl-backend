"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const matchmaking_1 = __importDefault(require("../services/matchmaking"));
exports.findUsers = (req, res) => {
    const username = req.username;
    const { community } = req.query ? req.query : req.body;
    matchmaking_1.default.findUsers(username, community)
        .then((response) => {
        res.status(200).send(response);
    })
        .catch((error) => res.status(400).json(error.message));
};
//# sourceMappingURL=matchmaking.js.map