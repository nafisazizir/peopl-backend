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
const communities_1 = __importDefault(require("../models/communities"));
const posts_1 = __importDefault(require("../models/posts"));
const users_1 = __importDefault(require("../models/users"));
const posts_2 = __importDefault(require("./posts"));
class CommunityService {
    create(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCommunity = yield communities_1.default.findOne({ name: name });
            if (existingCommunity) {
                throw new Error("Community already exist");
            }
            const community = yield communities_1.default.create({
                name: name,
                description: description,
            }).catch((error) => {
                throw new Error(error.message);
            });
            return community;
        });
    }
    getCommunities() {
        return __awaiter(this, void 0, void 0, function* () {
            const communities = yield communities_1.default.find();
            const communityNames = communities.map((community) => community.name);
            return communityNames;
        });
    }
    getCommunityDetails(name, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const community = yield communities_1.default.findOne({ name: name });
            if (!community) {
                throw new Error("Community does not exist");
            }
            const user = yield users_1.default.findOne({ username: username });
            const posts = yield posts_1.default.find({
                community: community._id,
            })
                .sort({ createdAt: -1 })
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
            const communityDetails = {
                name: community.name,
                description: community.description,
                createdAt: community.createdAt,
                isMember: user ? community.members.includes(user._id) : false,
                totalMembers: community.members.length,
                posts: postRes,
            };
            return communityDetails;
        });
    }
    joinCommunity(name, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ username: username });
            if (!user) {
                throw new Error("User does not exist");
            }
            const community = yield communities_1.default.findOne({ name: name });
            if (!community) {
                throw new Error("Community does not exist");
            }
            yield users_1.default.updateOne({ _id: user._id }, { $addToSet: { followedCommunities: community._id } });
            yield communities_1.default.updateOne({ _id: community._id }, { $addToSet: { members: user._id } });
            const updatedUser = yield users_1.default.findById(user._id);
            if (!updatedUser) {
                throw new Error("Failed to retrieve updated user");
            }
            return updatedUser;
        });
    }
    leaveCommunity(name, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ username: username });
            if (!user) {
                throw new Error("User does not exist");
            }
            const community = yield communities_1.default.findOne({ name: name });
            if (!community) {
                throw new Error("Community does not exist");
            }
            yield users_1.default.updateOne({ _id: user._id }, { $pull: { followedCommunities: community._id } });
            yield communities_1.default.updateOne({ _id: community._id }, { $pull: { members: user._id } });
            const updatedUser = yield users_1.default.findById(user._id);
            if (!updatedUser) {
                throw new Error("Failed to retrieve updated user");
            }
            return updatedUser;
        });
    }
    getJoinedCommunities(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ username: username }).populate("followedCommunities", "name");
            if (!user) {
                throw new Error("User does not exist");
            }
            return user.followedCommunities.map((community) => community.name);
        });
    }
}
exports.default = new CommunityService();
//# sourceMappingURL=communities.js.map