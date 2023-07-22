"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../services/users"));
exports.register = (req, res) => {
    const { email, password } = req.body;
    users_1.default.register(email, password)
        .then((response) => {
        res.status(201).send(response);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.login = (req, res) => {
    const { email, password } = req.body;
    users_1.default.login(email, password)
        .then((response) => {
        res.status(200).send(response);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.getDetails = (req, res) => {
    const { username } = req.params;
    users_1.default.getDetails(username)
        .then((user) => {
        res.status(200).json(user);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.getRandomUsernameList = (req, res) => {
    users_1.default.getRandomUsernameList()
        .then((usernameArray) => {
        res.status(200).send(usernameArray);
    })
        .catch((error) => res.status(400).json(error.message));
};
exports.setUsername = (req, res) => {
    const { username } = req.params;
    const email = req.email;
    users_1.default.setUsername(email, username)
        .then((response) => {
        res.status(200).send(response);
    })
        .catch((error) => res.status(400).json(error.message));
};
//# sourceMappingURL=users.js.map