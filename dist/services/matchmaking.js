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
const users_1 = __importDefault(require("../models/users"));
const requests_1 = __importDefault(require("../models/requests"));
class MatchmakingService {
    findUsers(username, community) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ username: username });
            if (!user) {
                throw new Error("User does not exist");
            }
            if (community !== "") {
                const communityDocs = yield communities_1.default.findOne({
                    name: community,
                });
                const users = yield users_1.default.find({
                    _id: { $in: communityDocs === null || communityDocs === void 0 ? void 0 : communityDocs.members, $ne: user._id },
                });
                const response = yield Promise.all(users.map((userA) => __awaiter(this, void 0, void 0, function* () {
                    const mutualCommunities = this.countMutualFollowedCommunities(user, userA);
                    const callToAction = yield this.getStatusUsers(user, userA);
                    return {
                        username: userA.username,
                        mutualCommunities: mutualCommunities,
                        callToAction: callToAction,
                    };
                })));
                response.sort((a, b) => b.mutualCommunities - a.mutualCommunities);
                return response;
            }
            else {
                const users = yield users_1.default.find({ _id: { $ne: user._id } });
                const response = yield Promise.all(users.map((userA) => __awaiter(this, void 0, void 0, function* () {
                    const mutualCommunities = this.countMutualFollowedCommunities(user, userA);
                    const callToAction = yield this.getStatusUsers(user, userA);
                    return {
                        username: userA.username,
                        mutualCommunities: mutualCommunities,
                        callToAction: callToAction,
                    };
                })));
                response.sort((a, b) => b.mutualCommunities - a.mutualCommunities);
                return response;
            }
        });
    }
    countMutualFollowedCommunities(userA, userB) {
        let followedCommunitiesA = new Set(userA.followedCommunities.map((a) => {
            return a.toString();
        }));
        let followedCommunitiesB = new Set(userB.followedCommunities.map((b) => {
            return b.toString();
        }));
        const intersectionSet = new Set();
        for (const element of followedCommunitiesA) {
            if (followedCommunitiesB.has(element)) {
                intersectionSet.add(element);
            }
        }
        return intersectionSet.size;
    }
    getStatusUsers(userA, userB) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = yield requests_1.default.findOne({
                $or: [
                    { sender: userA._id, recipient: userB._id },
                    { sender: userB._id, recipient: userA._id },
                ],
            });
            if (!request) {
                return "connect";
            }
            if (request.status === "pending") {
                if (request.sender.toString() === userA._id.toString()) {
                    return "pending";
                }
                else {
                    return "accept";
                }
            }
            return "chat";
        });
    }
}
exports.default = new MatchmakingService();
//# sourceMappingURL=matchmaking.js.map