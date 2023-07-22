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
const messages_1 = __importDefault(require("../models/messages"));
const users_1 = __importDefault(require("../models/users"));
const requests_1 = __importDefault(require("../models/requests"));
class MessageService {
    create(senderId, recipientId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield users_1.default.findOne({ username: senderId });
            const recipient = yield users_1.default.findOne({ username: recipientId });
            const request = yield requests_1.default.findOne({
                $or: [
                    { sender: sender === null || sender === void 0 ? void 0 : sender.id, recipient: recipient === null || recipient === void 0 ? void 0 : recipient.id },
                    { sender: recipient === null || recipient === void 0 ? void 0 : recipient.id, recipient: sender === null || sender === void 0 ? void 0 : sender.id },
                ],
            });
            if (!request) {
                throw new Error("Request does not exist");
            }
            if (request.status !== "accepted") {
                throw new Error("Request is not accepted");
            }
            const chatMessage = new messages_1.default({
                sender: sender === null || sender === void 0 ? void 0 : sender._id,
                recipient: recipient === null || recipient === void 0 ? void 0 : recipient._id,
                content: content,
            });
            yield chatMessage.save();
            return chatMessage;
        });
    }
    getMessages(senderId, recipientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield users_1.default.findOne({ username: senderId });
            const recipient = yield users_1.default.findOne({ username: recipientId });
            const request = yield requests_1.default.findOne({
                $or: [
                    { sender: sender === null || sender === void 0 ? void 0 : sender.id, recipient: recipient === null || recipient === void 0 ? void 0 : recipient.id },
                    { sender: recipient === null || recipient === void 0 ? void 0 : recipient.id, recipient: sender === null || sender === void 0 ? void 0 : sender.id },
                ],
            });
            if (!request) {
                throw new Error("Request does not exist");
            }
            if (request.status !== "accepted") {
                throw new Error("Request is not accepted");
            }
            const messages = yield messages_1.default.find({
                $or: [
                    { sender: sender === null || sender === void 0 ? void 0 : sender.id, recipient: recipient === null || recipient === void 0 ? void 0 : recipient.id },
                    { sender: recipient === null || recipient === void 0 ? void 0 : recipient.id, recipient: sender === null || sender === void 0 ? void 0 : sender.id },
                ],
            })
                .sort({ createdAt: 1 })
                .populate("sender", "username")
                .populate("recipient", "username");
            return messages;
        });
    }
    getMessageSummary(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ username: username });
            if (!user) {
                throw new Error("User does not exist");
            }
            const acceptedRequests = yield requests_1.default.find({
                status: "accepted",
                $or: [{ sender: user._id }, { recipient: user._id }],
            }).populate("sender recipient");
            const usernames = acceptedRequests.map((request) => {
                if (request.sender._id.equals(user._id)) {
                    return request.recipient.username;
                }
                else {
                    return request.sender.username;
                }
            });
            return usernames;
        });
    }
}
exports.default = new MessageService();
//# sourceMappingURL=messages.js.map