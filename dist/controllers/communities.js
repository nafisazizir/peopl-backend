"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const communities_1 = __importDefault(require("../services/communities"));
exports.createCommunity = (req, res) => {
    const { name, description } = req.query ? req.query : req.body;
    communities_1.default.create(name, description)
        .then((community) => {
        res.status(201).json(community);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.getCommunities = (req, res) => {
    communities_1.default.getCommunities()
        .then((communities) => res.status(200).send(communities))
        .catch((error) => res.status(400).json(error.message));
};
exports.getCommunityDetails = (req, res) => {
    const { name } = req.params;
    const username = req.username;
    communities_1.default.getCommunityDetails(name, username)
        .then((community) => res.status(200).send(community))
        .catch((error) => res.status(400).json(error.message));
};
exports.joinCommunity = (req, res) => {
    const { name } = req.params;
    const username = req.username;
    communities_1.default.joinCommunity(name, username)
        .then((user) => res.status(200).send(user))
        .catch((error) => res.status(400).json(error.message));
};
exports.leaveCommunity = (req, res) => {
    const { name } = req.params;
    const username = req.username;
    communities_1.default.leaveCommunity(name, username)
        .then((user) => res.status(200).send(user))
        .catch((error) => res.status(400).json(error.message));
};
exports.getJoinedCommunities = (req, res) => {
    const username = req.username;
    communities_1.default.getJoinedCommunities(username)
        .then((communities) => res.status(200).send(communities))
        .catch((error) => res.status(400).json(error.message));
};
//# sourceMappingURL=communities.js.map