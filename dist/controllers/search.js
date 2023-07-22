"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = __importDefault(require("../services/search"));
exports.search = (req, res) => {
    let { keyword } = req.query ? req.query : req.body;
    search_1.default.search(keyword)
        .then((response) => {
        res.status(200).send(response);
    })
        .catch((error) => res.status(400).json(error.message));
};
//# sourceMappingURL=search.js.map