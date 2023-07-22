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
const communities_1 = __importDefault(require("../models/communities"));
const posts_1 = __importDefault(require("../models/posts"));
const posts_2 = __importDefault(require("./posts"));
class SearchService {
    search(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRegex = new RegExp(keyword, "i");
            const posts = yield posts_1.default.find({
                $or: [{ title: searchRegex }, { content: searchRegex }],
            })
                .populate("author", "username")
                .populate("community", "name");
            const postRes = yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                const comments = yield posts_2.default.getCommentsRecursive(post._id);
                return {
                    _id: post._id,
                    title: post.title,
                    content: post.content,
                    author: post.author.username,
                    community: post.community.name,
                    createdAt: post.createdAt,
                    totalComments: comments.totalComments,
                    __v: post.__v,
                };
            })));
            const communities = yield communities_1.default.find({
                $or: [{ name: searchRegex }, { description: searchRegex }],
            });
            const users = yield users_1.default.find({ username: searchRegex });
            return { posts: postRes, communities, users };
        });
    }
}
exports.default = new SearchService();
//# sourceMappingURL=search.js.map