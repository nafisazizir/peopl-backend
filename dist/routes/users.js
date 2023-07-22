"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
module.exports = (app) => {
    const users = require("../controllers/users.ts");
    var router = require("express").Router();
    router.post("/register", users.register);
    router.post("/login", users.login);
    router.get("/username", users.getRandomUsernameList);
    router.get("/:username", users.getDetails);
    router.post("/set-username/:username", auth_1.default, users.setUsername);
    app.use("/api/user", router);
};
//# sourceMappingURL=users.js.map