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
const unique_username_generator_1 = require("unique-username-generator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const posts_1 = __importDefault(require("./posts"));
const posts_2 = __importDefault(require("../models/posts"));
(0, dotenv_1.config)();
class UserService {
    register(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // generate random username
            const username = yield this.generateRandomUniqueUsername();
            // validate email
            const existingUser = yield users_1.default.findOne({ email: email });
            if (existingUser) {
                throw new Error("Email is already registered.");
            }
            // Validate the password
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passwordRegex.test(password)) {
                if (password.length < 8) {
                    throw new Error("Password must be at least 8 characters long");
                }
                else {
                    throw new Error("Password must contain at least one alphabet and one number");
                }
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield users_1.default.create({
                username: username,
                email: email,
                password: hashedPassword,
            }).catch((error) => {
                throw new Error(error.message);
            });
            const res = yield this.login(email, password);
            return res;
        });
    }
    generateRandomUniqueUsername() {
        return __awaiter(this, void 0, void 0, function* () {
            let username = (0, unique_username_generator_1.generateUsername)("", 2, 19);
            let existingUser = yield users_1.default.findOne({ username: username });
            while (existingUser) {
                username = (0, unique_username_generator_1.generateUsername)("", 2, 19);
                existingUser = yield users_1.default.findOne({ username: username });
            }
            return username;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ email: email });
            if (!user) {
                throw new Error("Email not found");
            }
            const isMatchPassword = yield bcrypt_1.default.compare(password, user.password);
            if (isMatchPassword) {
                const token = jsonwebtoken_1.default.sign({ username: user.username, email: user.email }, process.env.TOKEN_KEY ? process.env.TOKEN_KEY : "", {
                    expiresIn: "365d",
                });
                return {
                    token: token,
                    username: user.username,
                };
            }
            else {
                throw new Error("Incorrect password");
            }
        });
    }
    getDetails(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ username: username });
            if (!user) {
                throw new Error("Username not found");
            }
            const posts = yield posts_2.default.find({
                author: user._id,
            })
                .sort({ createdAt: -1 })
                .populate("author", "username")
                .populate("community", "name");
            const postRes = yield Promise.all(posts.map((post) => __awaiter(this, void 0, void 0, function* () {
                const comments = yield posts_1.default.getCommentsRecursive(post._id);
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
            return {
                username: user.username,
                email: user.email,
                followedCommunities: user.followedCommunities,
                posts: postRes,
            };
        });
    }
    getRandomUsernameList() {
        return __awaiter(this, void 0, void 0, function* () {
            const usernamesArray = [];
            for (let i = 0; i < 5; i++) {
                const randomUsername = yield this.generateRandomUniqueUsername();
                usernamesArray.push(randomUsername);
            }
            return usernamesArray;
        });
    }
    setUsername(email, newUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_1.default.findOne({ email: email });
            if (!user) {
                throw new Error("User does not exist");
            }
            user.username = newUsername;
            yield user.save();
            const token = jsonwebtoken_1.default.sign({ username: user.username, email: user.email }, process.env.TOKEN_KEY ? process.env.TOKEN_KEY : "", {
                expiresIn: "365d",
            });
            return {
                token: token,
                username: newUsername,
            };
        });
    }
}
exports.default = new UserService();
//# sourceMappingURL=users.js.map