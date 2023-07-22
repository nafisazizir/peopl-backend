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
const posts_1 = __importDefault(require("../models/posts"));
const communities_1 = __importDefault(require("../models/communities"));
const users_1 = __importDefault(require("../models/users"));
const comments_1 = __importDefault(require("../models/comments"));
class PostService {
    create(title, content, username, community) {
        return __awaiter(this, void 0, void 0, function* () {
            const communityDoc = yield communities_1.default.findOne({ name: community });
            if (!communityDoc) {
                throw new Error("Community does not exist");
            }
            const userDoc = yield users_1.default.findOne({ username: username });
            if (!userDoc) {
                throw new Error("User does not exist");
            }
            const post = posts_1.default.create({
                title: title,
                content: content,
                author: userDoc._id,
                community: communityDoc._id,
            }).catch((error) => {
                throw new Error(error.message);
            });
            return post;
        });
    }
    getJoinedPosts(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ email: email });
            if (!user) {
                throw new Error("User does not exist");
            }
            const posts = yield posts_1.default.find({
                community: { $in: user.followedCommunities },
            })
                .sort({ createdAt: -1 })
                .populate("author", "username") // Populates author field with username
                .populate("community", "name"); // Populates community field with name
            const res = yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                const comments = yield this.getCommentsRecursive(post._id);
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
            return res;
        });
    }
    deletePost(email, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_1.default.findById(postId);
            if (!post) {
                throw new Error("Post does not exist");
            }
            const user = yield users_1.default.findOne({ email: email });
            if (!user) {
                throw new Error("User does not exist");
            }
            if (post.author.toString() !== user._id.toString()) {
                throw new Error("User is not the author of this post");
            }
            yield posts_1.default.findByIdAndDelete(post._id)
                .then(() => {
                return true;
            })
                .catch((error) => {
                throw new Error(error.message);
            });
            return true;
        });
    }
    getPostDetails(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield posts_1.default.findById(postId)
                .populate("author", "username")
                .populate("community", "name");
            if (!post) {
                throw new Error("Post does not exist");
            }
            const comments = yield this.getCommentsRecursive(postId);
            const postResponse = {
                _id: post._id,
                title: post.title,
                content: post.content,
                author: post.author.username,
                community: post.community.name,
                createdAt: post.createdAt,
                comments: comments.comments,
            };
            return postResponse;
        });
    }
    getCommentsRecursive(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield comments_1.default.find({ parentId: parentId })
                .populate("author", "username")
                .sort({
                createdAt: -1,
            });
            const nestedComments = [];
            let totalComments = comments.length;
            for (const comment of comments) {
                const nestedComment = {
                    _id: comment._id,
                    content: comment.content,
                    author: comment.author,
                    parentId: comment.parentId,
                    parentType: comment.parentType,
                    createdAt: comment.createdAt,
                    replies: [],
                };
                const subCommentsResult = yield this.getCommentsRecursive(comment._id);
                if (subCommentsResult.totalComments > 0) {
                    totalComments += subCommentsResult.totalComments;
                    nestedComment.replies = subCommentsResult.comments;
                }
                nestedComments.push(nestedComment);
            }
            return { comments: nestedComments, totalComments };
        });
    }
}
exports.default = new PostService();
//# sourceMappingURL=posts.js.map