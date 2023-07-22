"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function verifyToken(req, res, next) {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    if (!token.startsWith("Bearer ")) {
        return res.status(401).send("Invalid Token");
    }
    token = token.substring(7, token.length);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY ? process.env.TOKEN_KEY : "");
        req.username = decoded.username;
        req.email = decoded.email;
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}
exports.default = verifyToken;
//# sourceMappingURL=auth.js.map