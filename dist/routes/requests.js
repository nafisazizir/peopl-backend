"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
module.exports = (app) => {
    const requests = require("../controllers/requests.ts");
    var router = require("express").Router();
    router.post("/", auth_1.default, requests.createRequest);
    router.get("/", auth_1.default, requests.getPendingRequests);
    router.put("/:requestId/accept", auth_1.default, requests.acceptChatRequest);
    router.put("/:requestId/reject", auth_1.default, requests.rejectChatRequest);
    app.use("/api/request", router);
};
//# sourceMappingURL=requests.js.map