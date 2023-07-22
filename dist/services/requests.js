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
const requests_1 = __importDefault(require("../models/requests"));
class RequestService {
    create(senderId, recipientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield users_1.default.findOne({ username: senderId });
            const recipient = yield users_1.default.findOne({ username: recipientId });
            if (!sender || !recipient) {
                throw new Error("Sender or recipient not found");
            }
            const existingRequest = yield requests_1.default.findOne({
                sender: sender._id,
                recipient: recipient._id,
            });
            if (existingRequest) {
                throw new Error("Chat request already sent to this user");
            }
            const chatRequest = new requests_1.default({
                sender: sender._id,
                recipient: recipient._id,
                status: "pending",
            });
            yield chatRequest.save();
            return chatRequest;
        });
    }
    getPendingRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ username: userId });
            if (!user) {
                throw new Error("User does not exist");
            }
            const pendingRequests = yield requests_1.default.find({
                recipient: user._id,
                status: "pending",
            })
                .populate("sender", "username")
                .populate("recipient", "username");
            return pendingRequests;
        });
    }
    acceptChatRequest(username, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatRequest = yield requests_1.default.findById(requestId);
            if (!chatRequest) {
                throw new Error("Chat request not found");
            }
            const user = yield users_1.default.findOne({ username: username });
            if (!user) {
                throw new Error("User does not exist");
            }
            if (chatRequest.recipient.toString() !== user._id.toString()) {
                throw new Error("User is not the recipient");
            }
            if (chatRequest.status !== "pending") {
                throw new Error("Chat request has already been processed");
            }
            chatRequest.status = "accepted";
            yield chatRequest.save();
        });
    }
    rejecttChatRequest(username, requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatRequest = yield requests_1.default.findById(requestId);
            if (!chatRequest) {
                throw new Error("Chat request not found");
            }
            const user = yield users_1.default.findOne({ username: username });
            if (!user) {
                throw new Error("User does not exist");
            }
            if (chatRequest.recipient.toString() !== user._id.toString()) {
                throw new Error("User is not the recipient");
            }
            if (chatRequest.status !== "pending") {
                throw new Error("Chat request has already been processed");
            }
            chatRequest.status = "rejected";
            yield chatRequest.save();
        });
    }
}
exports.default = new RequestService();
//# sourceMappingURL=requests.js.map