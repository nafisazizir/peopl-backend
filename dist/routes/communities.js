"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
module.exports = (app) => {
    const communities = require("../controllers/communities");
    var router = require("express").Router();
    router.post("/", communities.createCommunity);
    router.get("/", communities.getCommunities);
    router.get("/joined-communities", auth_1.default, communities.getJoinedCommunities);
    router.get("/:name", auth_1.default, communities.getCommunityDetails);
    router.post("/:name/join", auth_1.default, communities.joinCommunity);
    router.post("/:name/leave", auth_1.default, communities.leaveCommunity);
    app.use("/api/community", router);
};
//# sourceMappingURL=communities.js.map