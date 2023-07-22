"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../models/users"));
const comments_1 = __importDefault(require("../models/comments"));
const posts_1 = __importDefault(require("../models/posts"));
class CommentService {
    create(email, parentId, parentType, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ email: email });
            if (!user) {
                throw new Error("User does not exist");
            }
            if (parentType.toString() == "0") {
                const postParent = yield posts_1.default.findById(parentId);
                if (!postParent) {
                    throw new Error("Post does not exist");
                }
            }
            else {
                const postComment = yield comments_1.default.findById(parentId);
                if (!postComment) {
                    throw new Error("Parent comment does not exist");
                }
            }
            const comment = yield comments_1.default.create({
                content: content,
                author: user._id,
                parentId: parentId,
                parentType: parentType,
            });
            return comment;
        });
    }
}
exports.default = new CommentService();
//# sourceMappingURL=comments.js.map