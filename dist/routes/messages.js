"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
module.exports = (app) => {
    const messages = require("../controllers/messages.ts");
    var router = require("express").Router();
    router.post("/", auth_1.default, messages.sendMessage);
    router.get("/", auth_1.default, messages.getMessages);
    router.get("/summary", auth_1.default, messages.getMessageSummary);
    app.use("/api/message", router);
};
//# sourceMappingURL=messages.js.map